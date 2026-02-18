import Task from "../models/task.model.js";
import asyncHandler from "express-async-handler";

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, message: "Task created", data: task });
});

// GET /api/tasks
export const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, sort, order, page = 1, limit = 10 } = req.query;

  // Build filter object (no user restriction)
  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  // Build sort object
  const sortObj = {};
  if (sort) {
    const allowedSortFields = ["dueDate", "createdAt"];
    if (allowedSortFields.includes(sort)) {
      sortObj[sort] = order === "desc" ? -1 : 1;
    }
  } else {
    sortObj.createdAt = -1; // default sorting
  }

  // Pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort(sortObj).skip(skip).limit(limitNum),
    Task.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: tasks,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// PUT /api/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!task)
    return res.status(404).json({ success: false, message: "Task not found" });

  const { title, description, status, priority, dueDate } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save();

  res.status(200).json({ success: true, message: "Task updated", data: task });
});

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  res.status(200).json({ success: true, message: "Task deleted" });
});

// PATCH /api/tasks/:id/status (bonus)
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required",
    });
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    { status },
    { new: true, runValidators: true },
  );

  if (!task)
    return res.status(404).json({ success: false, message: "Task not found" });

  res.status(200).json({
    success: true,
    message: "Task status updated",
    data: task,
  });
});

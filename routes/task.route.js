import express from "express";

const router = express.Router();

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

// All routes are protected
router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

router.patch("/:id/status", updateTaskStatus);

export default router;

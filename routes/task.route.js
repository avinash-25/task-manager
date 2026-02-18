import express from "express";

const router = express.Router();

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

router.get("/all", getTasks);
router.post("/add", authenticate, createTask);
router.put("/update/:id", authenticate, updateTask);
router.delete("/delete/:id", authenticate, deleteTask);

router.patch("/update-status/:id", updateTaskStatus);

export default router;

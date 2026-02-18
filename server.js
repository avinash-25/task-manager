import express from "express";
import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { connectDB } from "./config/database.config.js";

import dotenv from "dotenv";
dotenv.config({ quiet: true });

connectDB();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// check server status
app.get("/", (req, res) => {
  res.json({ message: "Task Management API is running" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

app.use(errorHandler);

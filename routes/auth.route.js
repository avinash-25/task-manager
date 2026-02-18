import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  message: {
    success: false,
    message: "Limit exceeded, please try again after 5 minutes",
  },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

export default router;

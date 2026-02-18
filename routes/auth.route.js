import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
// Rate limiter for auth routes (bonus)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes",
  },
});

router.post("/register", register);
router.post("/login", login);

export default router;

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";

dotenv.config({ quiet: true });

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

//* Register
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email and password",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ success: false, message: "Email already registered" });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    },
  });
});

//* Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email",
    });
  }
  //const isMatch = password === user.password; //* Bug - Plain text password comparison (insecure)
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid password",
    });
  }

  const token = generateToken(user._id);

  // token saved to the postman cookie section for testing protected routes
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });

  req.user = user; // Attach user ID to request for protected routes

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      name: user.name,
      email: user.email,
    },
  });
});

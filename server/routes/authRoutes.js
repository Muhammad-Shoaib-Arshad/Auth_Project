import express from "express";
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} from "../Controllers/authController.js";
import protect from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", protect, getMe);
authRouter.post("/send-verify-otp", protect, sendVerifyOtp);
authRouter.post("/verify-email", protect, verifyEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
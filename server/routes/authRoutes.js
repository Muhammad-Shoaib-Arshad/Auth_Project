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
  getDevResetOtp,
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

if (process.env.NODE_ENV !== 'production') {
  authRouter.get('/dev/reset-otp', getDevResetOtp)
}

export default authRouter;
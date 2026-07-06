import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

const sendError = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sendOtpEmail = async (email, otp, subject, text) => {
  const isConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SENDER_EMAIL);

  if (!isConfigured) {
    console.log(`Email service not configured. OTP for ${email}: ${otp}`);
    // In development, return the OTP so controllers can surface it for local testing
    return { sent: false, otp };
  }

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
  return { sent: true };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, "Missing required fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpireAt: Date.now() + 15 * 60 * 1000,
    });

    try {
      await sendOtpEmail(
        email,
        otp,
        "Verify your account",
        `Your verification code is ${otp}. It expires in 15 minutes.`
      );
    } catch (mailError) {
      console.error("Mail send failed:", mailError);
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 409, "Email already registered");
    }

    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Please provide email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 404, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 400, "Invalid credentials");
    }

    const token = createToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return sendError(res, 500, "Server error during logout");
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const sendVerifyOtp = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.isAccountVerified) {
      return sendError(res, 400, "Account is already verified");
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    try {
      const result = await sendOtpEmail(
        user.email,
        otp,
        "Verify your account",
        `Your verification code is ${otp}. It expires in 15 minutes.`
      );
      const response = { success: true, message: "Verification OTP sent to your email!" };
      if (result && !result.sent && process.env.NODE_ENV !== 'production') response.otp = result.otp;
      return res.status(200).json(response);
    } catch (mailError) {
      console.error("Mail send failed:", mailError);
      const response = { success: true, message: "Verification OTP saved (mail send failed)." };
      if (process.env.NODE_ENV !== 'production') response.otp = otp;
      return res.status(200).json(response);
    }
  } catch (error) {
    next(error);
  }
};

export const verifyEmailPublic = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return sendError(res, 400, 'Missing email or OTP');

    const user = await User.findOne({ email });
    if (!user) return sendError(res, 404, 'User not found');

    if (user.verifyOtp === '' || user.verifyOtp !== otp) return sendError(res, 400, 'Invalid OTP code');
    if (user.verifyOtpExpireAt < Date.now()) return sendError(res, 400, 'OTP has expired. Please request a new one.');

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (err) {
    next(err);
  }
}

export const verifyEmail = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return sendError(res, 400, "Missing OTP code");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return sendError(res, 400, "Invalid OTP code");
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return sendError(res, 400, "OTP has expired. Please request a new one.");
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 400, "Please provide your email");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    try {
      const result = await sendOtpEmail(
        user.email,
        otp,
        "Reset your password",
        `Your password reset code is ${otp}. It expires in 15 minutes.`
      );

      const response = { success: true, message: "Password reset code sent to your email!" };
      // For local development when email isn't configured, include the OTP in the response
      if (result && !result.sent && process.env.NODE_ENV !== 'production') {
        response.otp = result.otp;
      }

      return res.status(200).json(response);
    } catch (mailError) {
      console.error("Mail send failed:", mailError);
      const response = { success: true, message: "Password reset code saved (mail send failed)." };
      if (process.env.NODE_ENV !== 'production') response.otp = otp;
      return res.status(200).json(response);
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return sendError(res, 400, "Missing required fields");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return sendError(res, 400, "Invalid reset code");
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return sendError(res, 400, "Reset code has expired. Please request a new one.");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

export const getDevResetOtp = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') return sendError(res, 404, 'Not found')
    const { email } = req.query
    if (!email) return sendError(res, 400, 'Missing email')
    const user = await User.findOne({ email })
    if (!user) return sendError(res, 404, 'User not found')
    return res.status(200).json({ success: true, otp: user.resetOtp })
  } catch (err) {
    next(err)
  }
}
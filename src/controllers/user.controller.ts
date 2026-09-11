import { Request, Response } from "express";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { RefreshToken } from "../models/refreshToken.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
} from "../utils/tokens.js";

const APP_URL = process.env.APP_URL;

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.body?.email;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.json({
        message: "If that email exists, a reset link has been sent.",
      });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetUrl = `${APP_URL}/reset-password?token=${rawToken}`;
    console.log("\n========================================");
    console.log(`🔑 PASSWORD RESET LINK FOR ${email}:`);
    console.log(resetUrl);
    console.log("========================================\n");

    res.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ message: "Token and new password are required" });
      return;
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!currentPassword || !newPassword) {
      res
        .status(400)
        .json({ message: "Current password and new password are required" });
      return;
    }

    if (newPassword.length < 6) {
      res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
      return;
    }

    const user = await User.findById(userId);
    if (!user || !user.password) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Incorrect current password" });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await RefreshToken.deleteMany({ user: user._id });

    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await RefreshToken.create({ token: refreshToken, user: user._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Password updated successfully", accessToken });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

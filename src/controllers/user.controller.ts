import { Request, Response } from "express";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

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

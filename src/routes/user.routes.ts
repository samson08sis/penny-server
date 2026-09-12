import { Router } from "express";
import {
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword,
  updateProfile,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected
router.get("/me", authenticate, getMe);
router.put("/update-password", authenticate, updatePassword);
router.patch("/profile", authenticate, updateProfile);

export default router;

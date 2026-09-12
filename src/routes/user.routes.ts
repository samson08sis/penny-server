import { Router } from "express";
import {
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected
router.get("/me", authenticate, getMe);
router.patch("/update-password", authenticate, updatePassword);

export default router;

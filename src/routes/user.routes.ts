import { Router } from "express";
import {
  updatePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected
router.patch("/update-password", authenticate, updatePassword);

export default router;

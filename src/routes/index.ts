import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Penny Server is up and running!" });
});

export default router;

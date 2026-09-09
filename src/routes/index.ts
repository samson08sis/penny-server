import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/auth", authRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Penny Server is up and running!" });
});

export default router;

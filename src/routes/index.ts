import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import expenseRoutes from "./expense.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/expense", expenseRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Penny Server is up and running!" });
});

export default router;

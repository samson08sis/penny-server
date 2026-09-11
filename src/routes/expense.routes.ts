import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { getExpenses } from "../controllers/expense.controller";

const router = Router();

router.use(authenticate);

router.get("/", getExpenses);

export default router;

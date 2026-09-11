import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expense.controller";
import { validateExpenseInput } from "../middlewares/validateExpense";

const router = Router();

router.use(authenticate);

router.get("/", getExpenses);
router.post("/", validateExpenseInput, createExpense);
router.put("/:id", validateExpenseInput, updateExpense);
router.delete("/:id", deleteExpense);

export default router;

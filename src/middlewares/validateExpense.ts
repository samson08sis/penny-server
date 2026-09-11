import { Request, Response, NextFunction } from "express";
import { Category } from "../models/expense.model";

export const validateExpenseInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { amount, description, category, date } = req.body;

  if (
    amount === undefined ||
    amount === null ||
    typeof amount !== "number" ||
    isNaN(amount)
  ) {
    res.status(400).json({ message: "A valid numerical amount is required" });
    return;
  }
  if (amount <= 0) {
    res.status(400).json({ message: "Amount must be greater than zero" });
    return;
  }

  if (!description || typeof description !== "string" || !description.trim()) {
    res.status(400).json({ message: "Description is required" });
    return;
  }
  if (description.trim().length > 200) {
    res
      .status(400)
      .json({ message: "Description cannot exceed 200 characters" });
    return;
  }

  if (!category || !Object.values(Category).includes(category as Category)) {
    res.status(400).json({
      message: `Invalid category. Must be one of: ${Object.values(
        Category
      ).join(", ")}`,
    });
    return;
  }

  if (date !== undefined) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ message: "Invalid date format" });
      return;
    }
  }

  next();
};

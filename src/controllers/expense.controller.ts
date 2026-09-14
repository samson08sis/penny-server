import { Request, Response } from "express";
import { Expense } from "../models/expense.model";

export const getExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { category, page = "1", limit = "10" } = req.query;

    const query: Record<string, any> = { user: userId };
    if (category && typeof category === "string") {
      query.category = category;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit as string, 10) || 10)
    );
    const skip = (pageNum - 1) * limitNum;

    // Calculate current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [expenses, total, summaryResult] = await Promise.all([
      Expense.find(query).sort({ date: -1 }).skip(skip).limit(limitNum).lean(),
      Expense.countDocuments(query),
      Expense.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: "$amount" },
            expenseCount: { $sum: 1 },
            monthlyExpenses: {
              $sum: {
                $cond: [{ $gte: ["$date", startOfMonth] }, "$amount", 0],
              },
            },
          },
        },
      ]),
    ]);

    const summary = summaryResult[0] || {
      totalExpenses: 0,
      monthlyExpenses: 0,
      expenseCount: 0,
    };

    res.json({
      expenses,
      summary: {
        totalExpenses: summary.totalExpenses,
        monthlyExpenses: summary.monthlyExpenses,
        expenseCount: summary.expenseCount,
      },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { amount, description, category, date } = req.body;

    const expense = await Expense.create({
      user: userId,
      amount,
      description: description.trim(),
      category,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { amount, description, category, date } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: userId },
      {
        amount,
        description: description.trim(),
        category,
        ...(date && { date: new Date(date) }),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!expense) {
      res.status(404).json({ message: "Expense not found or unauthorized" });
      return;
    }

    res.json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const expense = await Expense.findOneAndDelete({
      _id: id,
      user: userId,
    }).lean();

    if (!expense) {
      res.status(404).json({ message: "Expense not found or unauthorized" });
      return;
    }

    res.json({
      message: "Expense deleted successfully",
      id: expense._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

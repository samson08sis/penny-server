import { Schema, model, Document, Types } from "mongoose";

export enum Category {
  FOOD = "Food",
  TRAVEL = "Travel",
  BILLS = "Bills",
  SHOPPING = "Shopping",
  ENTERTAINMENT = "Entertainment",
  HEALTH = "Health",
  OTHER = "Other",
}

export interface IExpense extends Document {
  user: Types.ObjectId;
  amount: number;
  date: Date;
  description: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    category: {
      type: String,
      enum: Object.values(Category),
      default: Category.OTHER,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.index({ user: 1, date: -1 });

export const Expense = model<IExpense>("Expense", expenseSchema);

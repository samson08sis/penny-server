/// <reference path="./types/express.d.ts" />

import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import routes from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const APP_URL = process.env.APP_URL;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: APP_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("💥 Vercel DB Connection Error:", error);
    res.status(500).json({ error: "Database connection failure" });
  }
});

app.use("/", routes);

export default app;

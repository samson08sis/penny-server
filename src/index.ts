import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import routes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
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

app.use("/", routes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();

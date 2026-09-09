import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use("/", routes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();

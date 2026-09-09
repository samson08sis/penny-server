import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const connStr =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pennywise";
    await mongoose.connect(connStr);
    console.log("🌱 Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

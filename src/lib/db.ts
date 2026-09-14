import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log("🔄 Using cached database connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "");
    isConnected = conn.connections[0].readyState === 1;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(
      `💥 Database connection matrix failed: ${(error as Error).message}`
    );
    process.exit(1);
  }
};

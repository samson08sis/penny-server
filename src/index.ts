import app from "./app.js";
import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT || 4000;

if (!(process.env.NODE_ENV === "production" && process.env.VERCEL === "1")) {
  const startServer = async () => {
    try {
      await connectDB();

      const server = app.listen(PORT, () => {
        console.log(
          `🚀 Server running in ${
            process.env.NODE_ENV || "development"
          } mode on port http://localhost:${PORT}`
        );
      });

      process.on("unhandledRejection", (err: Error) => {
        console.error("💥 UNHANDLED REJECTION! Shutting down gracefully...");
        console.error(err.name, err.message);
        server.close(() => {
          process.exit(1);
        });
      });
    } catch (error) {
      console.error("💥 Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer();

  process.on("uncaughtException", (err: Error) => {
    console.error("💥 UNCAUGHT EXCEPTION! Shutting down immediately...");
    console.error(err.name, err.message);
    process.exit(1);
  });
}

export default app;

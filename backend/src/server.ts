import dotenv from "dotenv";
// Load env vars before loading other modules
dotenv.config();

import app from "./app";
import connectDB from "./config/db";
import { seedDatabase } from "./utils/seed";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Seed default admin/sales accounts and mock leads
  await seedDatabase();

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections gracefully
  process.on("unhandledRejection", (err: any) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });

  // Handle system signals gracefully
  const shutdown = () => {
    console.log("Shutdown signal received. Closing server...");
    server.close(() => {
      console.log("HTTP server closed. Exiting process.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startServer();

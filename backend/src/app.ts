import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Standard middlewares
app.use(cors({
  origin: "*", // Supports access from local and Docker ports
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Liveness/Readiness probe
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
});

// Route mounts
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

// Fallback for unhandled endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;

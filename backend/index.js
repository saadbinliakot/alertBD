// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import reportsRoutes from "./routes/reports.js";
import { pool } from "./db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);      // /auth/register, /auth/login, /auth/logout
app.use("/api/reports", reportsRoutes); // /api/reports endpoints

// Default route
app.get("/", (req, res) => {
  res.send("AlertBD backend is running!");
});

// Start server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

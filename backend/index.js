// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import reportsRoutes from "./routes/reports.js";
import { pool } from "./db.js";
import cookieParser from "cookie-parser";
import locationRoutes from './routes/location.js';
import crimeTypeRoutes from './routes/crimeTypes.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors(
  {
    origin: "http://localhost:5173", 
    credentials: true               
  }
));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);      
app.use("/api", reportsRoutes); 
app.use('/api', locationRoutes);
app.use('/api', crimeTypeRoutes);
app.use('/api', adminRoutes);



// Default route
app.get("/", (req, res) => {
  res.send("AlertBD backend is running!");
});

// Start server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

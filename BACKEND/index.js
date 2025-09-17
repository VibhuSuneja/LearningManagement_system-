import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import userRouter from "./route/userRoute.js";
import authRouter from "./route/authRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());

// --- CORS Configuration for Local Development ---
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your local frontend
    credentials: true,
  })
);

// --- Routes ---
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// --- Health check ---
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// --- Server Startup ---
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  connectDb();
});
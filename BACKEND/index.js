import dotenv from "dotenv";
dotenv.config(); // This MUST be the first thing to run

import express from "express";
import connectDb from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import userRouter from "./route/userRoute.js";
import authRouter from "./route/authRoute.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8080;


app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

// Debug cookies (optional, can be removed in production)
app.use((req, res, next) => {
  console.log("Incoming cookies:", req.cookies);
  next();
});

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
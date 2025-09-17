// server.js
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

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",  // local frontend
  "https://learning-management-system-six-rosy.vercel.app" // your deployed frontend
];

// ✅ CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// Global CORS error handler
app.use((err, req, res, next) => {
  if (err) {
    console.error("CORS error:", err.message);
    res.status(403).json({ message: err.message });
  } else {
    next();
  }
});

// Start server and connect to DB
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  connectDb();
});

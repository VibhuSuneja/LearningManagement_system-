import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDb from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import userRouter from "./route/userRoute.js";
import authRouter from "./route/authRoute.js";
import courseRouter from "./route/courseRoute.js";
import cors from "cors";
import paymentRouter from "./route/paymentRoute.js";
import reviewRouter from "./route/reviewRoute.js";
import searchRouter from "./route/searchRoute.js";
import chatbotRouter from "./route/chatbotRoute.js";
import notificationRouter from "./route/notificationRoute.js";
import messageRouter from "./route/messageRoute.js";
import liveSessionRouter from "./route/liveSessionRoute.js";
import gamificationRouter from "./route/gamificationRoute.js";
import forumRouter from "./route/forumRoute.js";
import quizRouter from "./route/quizRoute.js";
import assignmentRouter from "./route/assignmentRoute.js";
import progressRouter from "./route/progressRoute.js";
import aiRouter from "./route/aiRoute.js";
import analyticsRouter from "./route/analyticsRoute.js";
import { app, server } from "./socket/socket.js";

// --- Scaling & Security Configuration ---
// 1. General Rate Limiting (Prevents DDOS and generic spam)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Strict Rate Limiting for AI & Auth (Prevents costly API abuse and brute force)
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 requests per hour for AI/Auth
  message: "Daily limit reached for AI features. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const port = process.env.PORT || 8080;

// --- Middleware ---
app.set("trust proxy", 1); // Trust Render's proxy for secure cookies
app.use(helmet()); // Set security-related HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(express.json());
app.use(cookieParser());

// Apply general limiter to all requests
app.use(generalLimiter);

const allowedOrigins = [
  "https://learning-management-system-kappa-black.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:4173",
  "http://localhost:4174",
  process.env.FRONTEND_URL
].filter(Boolean); 

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  })
);

// --- Routes ---
app.use("/api/auth", strictLimiter, authRouter); // Apply strict limit to Auth
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/order", paymentRouter);
app.use("/api/review", reviewRouter);
app.use("/api/ai", strictLimiter, searchRouter); // Apply strict limit to AI Search
app.use("/api/chatbot", strictLimiter, chatbotRouter); // Apply strict limit to Chatbot
app.use("/api/notification", notificationRouter);
app.use("/api/message", messageRouter);
app.use("/api/live-session", liveSessionRouter);
app.use("/api/gamification", gamificationRouter);
app.use("/api/forum", forumRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/assignment", assignmentRouter);
app.use("/api/progress", progressRouter);
app.use("/api/ai-features", strictLimiter, aiRouter); // Apply strict limit to AI Quiz/Feedback
app.use("/api/analytics", analyticsRouter);


// --- Health check ---
app.get("/", (req, res) => {
  res.send("🚀 Server is running with WebSockets!");
});

// --- Server Startup ---
server.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  connectDb();
});

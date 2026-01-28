import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDb from "./config/connectDB.js";
import cookieParser from "cookie-parser";
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
import { app, server } from "./socket/socket.js";

const port = process.env.PORT || 8080;

// --- Middleware ---
app.set("trust proxy", 1); // Trust Render's proxy for secure cookies
app.use(express.json());
app.use(cookieParser());
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
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  })
);

// --- Routes ---
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/order", paymentRouter);
app.use("/api/review", reviewRouter);
app.use("/api/ai", searchRouter);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/message", messageRouter);
app.use("/api/live-session", liveSessionRouter);
app.use("/api/gamification", gamificationRouter);
app.use("/api/forum", forumRouter);

// ✅ This message will appear in your terminal if the file is loaded correctly.
console.log("✅ Course router has been successfully loaded.");
console.log("✅ Gamification router has been successfully loaded.");
console.log("✅ Forum router has been successfully loaded.");

// --- Health check ---
app.get("/", (req, res) => {
  res.send("🚀 Server is running with WebSockets!");
});

// --- Server Startup ---
server.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  connectDb();
});

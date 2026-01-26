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

const app = express();
const port = process.env.PORT || 8080;

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "https://learning-management-system-kappa-black.vercel.app",
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined/null values

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
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
app.use("/api/review",reviewRouter);
app.use("/api/ai",searchRouter);
app.use("/api/chatbot", chatbotRouter);

// ✅ This message will appear in your terminal if the file is loaded correctly.
console.log("✅ Course router has been successfully loaded.");

// --- Health check ---
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// --- Server Startup ---
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  connectDb();
});

import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import userRouter from "./route/userRoute.js";
import authRouter from "./route/authRoute.js";
import cors from "cors";

dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Allowed origins (local + production frontend)
const allowedOrigins = [
  "http://localhost:5173",                                   // Local frontend
  "https://learning-management-system-six-rosy.vercel.app"   // Deployed frontend
];

// ✅ CORS config
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello from Server 🚀");
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  connectDb();
});

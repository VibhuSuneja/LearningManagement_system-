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

const app = express();
const port = process.env.PORT || 8080;

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// --- Routes ---
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/order", paymentRouter);
app.use("/api/review",reviewRouter)

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
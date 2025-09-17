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

// --- CORS Configuration ---
// This setup is more robust for deployment.
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // Make sure this is set in Render!
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// --- Middlewares ---
app.use(express.json());
app.use(cookieParser());

// ✅ Simple request logger to help debug 404 errors
app.use((req, res, next) => {
  console.log(`Request received for: ${req.method} ${req.url}`);
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
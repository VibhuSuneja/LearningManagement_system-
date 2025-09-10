import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import userRouter from "./route/userRoute.js";
import authRouter from "./route/authRoute.js";
dotenv.config();
import cors from "cors"
const port = process.env.PORT; // earlier we created a port of any value , 
// now to import value from env file we use process.env.PORT
const app = express(); // use express functionalities of server creation,route creation ... etc.
app.use(express.json()); // it will start taking values in json
app.use(cookieParser()); // parsing token in the cookie
app.use(cors({
  origin:"http://localhost:5173",credentials:true
}))
//get request at our desired port number which is 8080 in our case
app.use("/api/auth",authRouter) //Taking authentication Route when we call authRouter
app.use("/api/user",userRouter)
app.get("/", (req, res) => {
  //define a route where we get our request and response
  res.send("Hello from Server");
});
//adding listen
app.listen(port, () => {
  console.log("Server has been started"); //this will show on terminal
  connectDb();
});

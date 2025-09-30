// BACKEND/route/userRoute.js

import express from "express";
import { getCurrentUser, updateProfile } from "../controller/userController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

// This is the correct route, which translates to "/api/user/current"
userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/profile", isAuth, upload.single("photoUrl"), updateProfile);

export default userRouter;
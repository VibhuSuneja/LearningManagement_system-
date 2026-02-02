// BACKEND/route/userRoute.js

import express from "express";
import { getCurrentUser, updateProfile, getUsersForSidebar, getUserById, deleteProfile } from "../controller/userController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

// This is the correct route, which translates to "/api/user/current"
userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/:id", isAuth, getUserById);
userRouter.post("/profile", isAuth, upload.single("photoUrl"), updateProfile);
userRouter.delete("/profile", isAuth, deleteProfile);
userRouter.get("/", isAuth, getUsersForSidebar);

export default userRouter;
import express from "express";
import { createLiveSession, getLiveSessionsByCourse, updateSessionStatus } from "../controller/liveSessionController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/create", isAuth, createLiveSession);
router.get("/course/:courseId", isAuth, getLiveSessionsByCourse);
router.put("/status/:id", isAuth, updateSessionStatus);

export default router;

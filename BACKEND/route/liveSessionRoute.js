import express from "express";
import { createLiveSession, getLiveSessionsByCourse, updateSessionStatus, deleteLiveSession, addRecordingUrl } from "../controller/liveSessionController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/create", isAuth, createLiveSession);
router.get("/course/:courseId", isAuth, getLiveSessionsByCourse);
router.put("/status/:id", isAuth, updateSessionStatus);
router.delete("/delete/:id", isAuth, deleteLiveSession);
router.put("/recording/:id", isAuth, addRecordingUrl);

export default router;

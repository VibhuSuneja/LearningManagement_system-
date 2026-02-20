import express from "express";
import {
	markAttendance,
	getAttendanceBySession,
	getAttendanceByCourse,
} from "../controller/attendanceController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/mark", isAuth, markAttendance);
router.get("/session/:sessionId", isAuth, getAttendanceBySession);
router.get("/course/:courseId", isAuth, getAttendanceByCourse);

export default router;

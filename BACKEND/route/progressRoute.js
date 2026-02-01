import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
    getCourseProgress,
    markLectureComplete,
    unmarkLectureComplete,
    getCourseStudentsProgress,
    getStudentProgress,
    getMyOverallProgress
} from "../controller/progressController.js";

const progressRouter = express.Router();

// Get my progress for a specific course
progressRouter.get("/course/:courseId", isAuth, getCourseProgress);

// Mark a lecture as complete
progressRouter.post("/course/:courseId/lecture/:lectureId/complete", isAuth, markLectureComplete);

// Unmark a lecture as complete
progressRouter.delete("/course/:courseId/lecture/:lectureId/complete", isAuth, unmarkLectureComplete);

// Get my overall progress across all courses
progressRouter.get("/my-progress", isAuth, getMyOverallProgress);

// Get all students' progress for a course (educators only)
progressRouter.get("/course/:courseId/students", isAuth, getCourseStudentsProgress);

// Get specific student's progress for a course (educators only)
progressRouter.get("/course/:courseId/student/:studentId", isAuth, getStudentProgress);

export default progressRouter;

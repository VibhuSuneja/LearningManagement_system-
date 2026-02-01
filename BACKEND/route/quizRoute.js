import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
    createQuiz,
    getCourseQuizzes,
    getQuizById,
    submitQuizAttempt,
    getStudentQuizResults,
    updateQuiz,
    deleteQuiz,
    getCourseQuizAttempts
} from "../controller/quizController.js";

const quizRouter = express.Router();

// Create a new quiz (educators only)
quizRouter.post("/create", isAuth, createQuiz);

// Get all quizzes for a course
quizRouter.get("/course/:courseId", isAuth, getCourseQuizzes);

// Get a specific quiz (for taking)
quizRouter.get("/:quizId", isAuth, getQuizById);

// Submit quiz attempt
quizRouter.post("/:quizId/submit", isAuth, submitQuizAttempt);

// Get student's quiz results
quizRouter.get("/:quizId/results", isAuth, getStudentQuizResults);

// Update quiz (educators only)
quizRouter.put("/:quizId", isAuth, updateQuiz);

// Delete quiz (educators only)
quizRouter.delete("/:quizId", isAuth, deleteQuiz);

// Get all quiz attempts for a course (educators only)
quizRouter.get("/course/:courseId/attempts", isAuth, getCourseQuizAttempts);

export default quizRouter;

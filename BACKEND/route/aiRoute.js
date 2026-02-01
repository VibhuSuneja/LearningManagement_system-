import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
    generateQuiz,
    aiGradeSubmission,
    studyAssistant,
    getCourseInsights
} from "../controller/aiController.js";

const aiRouter = express.Router();

// AI Quiz Generator
aiRouter.post("/generate-quiz", isAuth, generateQuiz);

// AI Assignment Grader  
aiRouter.post("/grade-submission/:submissionId", isAuth, aiGradeSubmission);

// AI Study Assistant
aiRouter.post("/study-assistant", isAuth, studyAssistant);

// AI Course Insights (for educators)
aiRouter.get("/course-insights/:courseId", isAuth, getCourseInsights);

export default aiRouter;

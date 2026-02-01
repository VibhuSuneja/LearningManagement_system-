import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import {
    createAssignment,
    getCourseAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    getAssignmentSubmissions
} from "../controller/assignmentController.js";
import {
    submitAssignment,
    getMySubmission,
    gradeSubmission,
    deleteSubmission,
    getSubmissionById
} from "../controller/submissionController.js";

const assignmentRouter = express.Router();

// Assignment routes
// Create a new assignment (educators only)
assignmentRouter.post("/create", isAuth, upload.array("attachments", 5), createAssignment);

// Get all assignments for a course
assignmentRouter.get("/course/:courseId", isAuth, getCourseAssignments);

// Get a specific assignment
assignmentRouter.get("/:assignmentId", isAuth, getAssignmentById);

// Update assignment (educators only)
assignmentRouter.put("/:assignmentId", isAuth, upload.array("attachments", 5), updateAssignment);

// Delete assignment (educators only)
assignmentRouter.delete("/:assignmentId", isAuth, deleteAssignment);

// Get all submissions for an assignment (educators only)
assignmentRouter.get("/:assignmentId/submissions", isAuth, getAssignmentSubmissions);

// Submission routes
// Submit or update assignment (students)
assignmentRouter.post("/:assignmentId/submit", isAuth, upload.array("files", 5), submitAssignment);

// Get my submission for an assignment
assignmentRouter.get("/:assignmentId/my-submission", isAuth, getMySubmission);

// Grade a submission (educators only)
assignmentRouter.post("/submission/:submissionId/grade", isAuth, gradeSubmission);

// Get specific submission details
assignmentRouter.get("/submission/:submissionId", isAuth, getSubmissionById);

// Delete submission (students, before grading)
assignmentRouter.delete("/submission/:submissionId", isAuth, deleteSubmission);

export default assignmentRouter;

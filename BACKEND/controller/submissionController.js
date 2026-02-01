import Submission from "../model/submissionModel.js";
import Assignment from "../model/assignmentModel.js";
import Progress from "../model/progressModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { createNotification } from "./notificationController.js";

// Submit or update a submission
export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { submissionText } = req.body;

        const assignment = await Assignment.findById(assignmentId).populate("course");
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check if assignment is still accepting submissions
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        const isLate = now > dueDate;

        // Handle file uploads
        let files = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                // Check file size
                const fileSizeMB = file.size / (1024 * 1024);
                if (fileSizeMB > assignment.maxFileSize) {
                    return res.status(400).json({ 
                        message: `File ${file.originalname} exceeds max size of ${assignment.maxFileSize}MB` 
                    });
                }

                const fileUrl = await uploadOnCloudinary(file.buffer);
                files.push({
                    fileName: file.originalname,
                    fileUrl,
                    fileSize: file.size
                });
            }
        }

        // Check if submission already exists
        let submission = await Submission.findOne({
            assignment: assignmentId,
            student: req.userId
        });

        if (submission) {
            // Update existing submission if not yet graded
            if (submission.status === "graded") {
                return res.status(403).json({ message: "Cannot modify graded submission" });
            }

            submission.submissionText = submissionText || submission.submissionText;
            submission.files = [...submission.files, ...files];
            submission.submittedAt = Date.now();
            submission.isLate = isLate;
            submission.status = isLate ? "late" : "submitted";

            await submission.save();
        } else {
            // Create new submission
            submission = await Submission.create({
                assignment: assignmentId,
                student: req.userId,
                submissionText,
                files,
                isLate,
                status: isLate ? "late" : "submitted"
            });
        }

        // Update progress
        let progress = await Progress.findOne({ 
            user: req.userId, 
            course: assignment.course._id 
        });

        if (!progress) {
            progress = await Progress.create({
                user: req.userId,
                course: assignment.course._id
            });
        }

        // Update assignment submissions in progress
        const existingSubmissionIndex = progress.assignmentSubmissions.findIndex(
            as => as.assignment.toString() === assignmentId
        );

        if (existingSubmissionIndex >= 0) {
            progress.assignmentSubmissions[existingSubmissionIndex].submission = submission._id;
            progress.assignmentSubmissions[existingSubmissionIndex].submittedAt = submission.submittedAt;
        } else {
            progress.assignmentSubmissions.push({
                assignment: assignmentId,
                submission: submission._id,
                submittedAt: submission.submittedAt
            });
        }

        await progress.save();

        // Notify educator
        await createNotification(
            assignment.creator,
            req.userId,
            "assignment_submitted",
            `A student has submitted "${assignment.title}"`,
            assignment.course._id
        );

        return res.status(200).json({
            message: "Assignment submitted successfully",
            submission,
            isLate
        });
    } catch (error) {
        console.error("Error submitting assignment:", error);
        return res.status(500).json({ message: `Failed to submit assignment: ${error.message}` });
    }
};

// Get student's own submission
export const getMySubmission = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const submission = await Submission.findOne({
            assignment: assignmentId,
            student: req.userId
        }).populate("assignment");

        if (!submission) {
            return res.status(404).json({ message: "No submission found" });
        }

        return res.status(200).json({ submission });
    } catch (error) {
        console.error("Error fetching submission:", error);
        return res.status(500).json({ message: `Failed to fetch submission: ${error.message}` });
    }
};

// Grade a submission (for educators)
export const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { grade, feedback } = req.body;

        if (grade === undefined) {
            return res.status(400).json({ message: "Grade is required" });
        }

        const submission = await Submission.findById(submissionId)
            .populate("assignment");
        
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        const assignment = submission.assignment;
        
        // Check authorization
        if (assignment.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to grade this submission" });
        }

        // Validate grade
        if (grade < 0 || grade > assignment.maxPoints) {
            return res.status(400).json({ 
                message: `Grade must be between 0 and ${assignment.maxPoints}` 
            });
        }

        submission.grade = grade;
        submission.feedback = feedback;
        submission.gradedBy = req.userId;
        submission.gradedAt = Date.now();
        submission.status = "graded";

        await submission.save();

        // Update progress with grade
        const progress = await Progress.findOne({
            user: submission.student,
            course: assignment.course
        });

        if (progress) {
            const submissionIndex = progress.assignmentSubmissions.findIndex(
                as => as.submission.toString() === submissionId
            );

            if (submissionIndex >= 0) {
                progress.assignmentSubmissions[submissionIndex].grade = grade;
            }

            await progress.save();
        }

        // Notify student
        await createNotification(
            submission.student,
            req.userId,
            "assignment_graded",
            `Your submission for "${assignment.title}" has been graded. Score: ${grade}/${assignment.maxPoints}`,
            assignment.course
        );

        return res.status(200).json({
            message: "Submission graded successfully",
            submission
        });
    } catch (error) {
        console.error("Error grading submission:", error);
        return res.status(500).json({ message: `Failed to grade submission: ${error.message}` });
    }
};

// Delete a submission (student can delete before grading)
export const deleteSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Check authorization
        if (submission.student.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to delete this submission" });
        }

        // Cannot delete graded submissions
        if (submission.status === "graded") {
            return res.status(403).json({ message: "Cannot delete graded submission" });
        }

        await submission.deleteOne();

        return res.status(200).json({ message: "Submission deleted successfully" });
    } catch (error) {
        console.error("Error deleting submission:", error);
        return res.status(500).json({ message: `Failed to delete submission: ${error.message}` });
    }
};

// Get submission by ID (for educators and the student who submitted)
export const getSubmissionById = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await Submission.findById(submissionId)
            .populate("student", "name email photoUrl")
            .populate("assignment")
            .populate("gradedBy", "name email");

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        const assignment = await Assignment.findById(submission.assignment._id);

        // Check authorization (student or course creator)
        if (submission.student._id.toString() !== req.userId && 
            assignment.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to view this submission" });
        }

        return res.status(200).json({ submission });
    } catch (error) {
        console.error("Error fetching submission:", error);
        return res.status(500).json({ message: `Failed to fetch submission: ${error.message}` });
    }
};

import Assignment from "../model/assignmentModel.js";
import Submission from "../model/submissionModel.js";
import Course from "../model/courseModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { createNotification } from "./notificationController.js";

// Create a new assignment
export const createAssignment = async (req, res) => {
    try {
        let { title, description, courseId, lectureId, dueDate, maxPoints, instructions, allowedFileTypes, maxFileSize } = req.body;

        if (!title || !description || !courseId || !dueDate) {
            return res.status(400).json({ message: "Title, description, course, and due date are required" });
        }

        // Handle empty lectureId string from frontend
        if (lectureId === "" || lectureId === "undefined") {
            lectureId = undefined;
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check authorization
        if (course.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to create assignment for this course" });
        }

        // Handle file attachments if provided
        let attachments = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const fileUrl = await uploadOnCloudinary(file.buffer);
                attachments.push({
                    fileName: file.originalname,
                    fileUrl
                });
            }
        }

        const assignment = await Assignment.create({
            title,
            description,
            course: courseId,
            lecture: lectureId,
            dueDate,
            maxPoints,
            instructions,
            allowedFileTypes: allowedFileTypes ? allowedFileTypes.split(',') : [],
            maxFileSize,
            attachments,
            creator: req.userId
        });

        // Notify enrolled students
        const enrolledStudents = course.enrolledStudents || [];
        for (const studentId of enrolledStudents) {
            await createNotification(
                studentId,
                req.userId,
                "assignment_created",
                `A new assignment "${title}" has been posted in "${course.title}". Due: ${new Date(dueDate).toLocaleDateString()}`,
                courseId
            );
        }

        return res.status(201).json({
            message: "Assignment created successfully",
            assignment
        });
    } catch (error) {
        console.error("Error creating assignment:", error);
        return res.status(500).json({ message: `Failed to create assignment: ${error.message}` });
    }
};

// Get all assignments for a course
export const getCourseAssignments = async (req, res) => {
    try {
        const { courseId } = req.params;

        const assignments = await Assignment.find({ course: courseId, isActive: true })
            .populate("creator", "name email")
            .populate("lecture", "lectureTitle")
            .sort({ dueDate: 1 });

        // If educator, include submission counts
        if (req.user && req.user.role === "educator") {
            const assignmentsWithStats = await Promise.all(assignments.map(async (assignment) => {
                const submissionCount = await Submission.countDocuments({ assignment: assignment._id });
                const gradedCount = await Submission.countDocuments({ assignment: assignment._id, status: "graded" });
                
                const assignmentObj = assignment.toObject();
                assignmentObj.submissionCount = submissionCount;
                assignmentObj.gradedCount = gradedCount;
                return assignmentObj;
            }));
            return res.status(200).json({ assignments: assignmentsWithStats });
        }

        return res.status(200).json({ assignments });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        return res.status(500).json({ message: `Failed to fetch assignments: ${error.message}` });
    }
};

// Get a specific assignment
export const getAssignmentById = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const assignment = await Assignment.findById(assignmentId)
            .populate("creator", "name email photoUrl")
            .populate("lecture", "lectureTitle");

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check if student has already submitted
        let studentSubmission = null;
        if (req.userId) {
            studentSubmission = await Submission.findOne({
                assignment: assignmentId,
                student: req.userId
            });
        }

        return res.status(200).json({ 
            assignment,
            hasSubmitted: !!studentSubmission,
            submission: studentSubmission
        });
    } catch (error) {
        console.error("Error fetching assignment:", error);
        return res.status(500).json({ message: `Failed to fetch assignment: ${error.message}` });
    }
};

// Update assignment
export const updateAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const updateData = req.body;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check authorization
        if (assignment.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to update this assignment" });
        }

        // Handle new attachments
        if (req.files && req.files.length > 0) {
            const newAttachments = [];
            for (const file of req.files) {
                const fileUrl = await uploadOnCloudinary(file.buffer);
                newAttachments.push({
                    fileName: file.originalname,
                    fileUrl
                });
            }
            updateData.attachments = [...assignment.attachments, ...newAttachments];
        }

        const updatedAssignment = await Assignment.findByIdAndUpdate(
            assignmentId,
            { $set: updateData },
            { new: true }
        );

        return res.status(200).json({
            message: "Assignment updated successfully",
            assignment: updatedAssignment
        });
    } catch (error) {
        console.error("Error updating assignment:", error);
        return res.status(500).json({ message: `Failed to update assignment: ${error.message}` });
    }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check authorization
        if (assignment.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to delete this assignment" });
        }

        // Delete all associated submissions
        await Submission.deleteMany({ assignment: assignmentId });

        await assignment.deleteOne();

        return res.status(200).json({ message: "Assignment deleted successfully" });
    } catch (error) {
        console.error("Error deleting assignment:", error);
        return res.status(500).json({ message: `Failed to delete assignment: ${error.message}` });
    }
};

// Get all submissions for an assignment (for educators)
export const getAssignmentSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const assignment = await Assignment.findById(assignmentId).populate("course");
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check authorization
        if (assignment.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to view submissions" });
        }

        const submissions = await Submission.find({ assignment: assignmentId })
            .populate("student", "name email photoUrl")
            .sort({ submittedAt: -1 });

        return res.status(200).json({ 
            submissions,
            assignmentTitle: assignment.title,
            totalSubmissions: submissions.length
        });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({ message: `Failed to fetch submissions: ${error.message}` });
    }
};

import LiveSession from "../model/liveSessionModel.js";
import Course from "../model/courseModel.js";
import { createNotification } from "./notificationController.js";

export const createLiveSession = async (req, res) => {
	try {
		const { title, description, startTime, duration, courseId } = req.body;
		const creatorId = req.user._id;

		// Verify course exists and user is the creator
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}
		if (course.creator.toString() !== creatorId.toString()) {
			return res.status(403).json({ message: "Only the course creator can start a live session" });
		}

		// Generate a unique meeting ID based on title and timestamp
		const meetingId = `lms-${courseId}-${Date.now()}`;

		const newSession = new LiveSession({
			title,
			description,
			startTime,
			duration,
			meetingId,
			courseId,
			creatorId,
			status: "scheduled",
		});

		await newSession.save();

		// Notify all enrolled students
		const populatedCourse = await Course.findById(courseId).populate("enrolledStudents");
		if (populatedCourse && populatedCourse.enrolledStudents) {
			for (const student of populatedCourse.enrolledStudents) {
				if (student) {
					await createNotification(
						student._id || student,
						creatorId,
						"course_update",
						`A live session "${title}" has been scheduled for "${course.title}".`,
						courseId
					);
				}
			}
		}

		res.status(201).json(newSession);
	} catch (error) {
		console.log("Error in createLiveSession:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getLiveSessionsByCourse = async (req, res) => {
	try {
		const { courseId } = req.params;
		const userId = req.user._id;

		// Security Check: Verify user is enrolled or creator
		const course = await Course.findById(courseId);
		if (!course) return res.status(404).json({ message: "Course not found" });

		const isEnrolled = course.enrolledStudents.some(id => id.toString() === userId.toString());
		const isCreator = course.creator.toString() === userId.toString();

		if (!isEnrolled && !isCreator) {
			return res.status(403).json({ message: "Access denied. You must be enrolled in this course to attend live sessions." });
		}

		const sessions = await LiveSession.find({ courseId }).sort({ startTime: -1 });
		res.status(200).json(sessions);
	} catch (error) {
		console.log("Error in getLiveSessionsByCourse:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateSessionStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body; // live, ended

		const session = await LiveSession.findById(id);
		if (!session) return res.status(404).json({ message: "Session not found" });

		if (session.creatorId.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Unauthorized" });
		}

		session.status = status;
		await session.save();

		res.status(200).json(session);
	} catch (error) {
		console.log("Error in updateSessionStatus:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

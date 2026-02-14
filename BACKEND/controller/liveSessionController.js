import LiveSession from "../model/liveSessionModel.js";
import Course from "../model/courseModel.js";
import { createNotification } from "./notificationController.js";
import { io } from "../socket/socket.js";
import { awardPoints, checkBadges } from "./gamificationController.js";

export const participateInSession = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user._id;

		const session = await LiveSession.findById(id);
		if (!session) return res.status(404).json({ message: "Session not found" });

		if (req.user.role === "student") {
			// Award points for participation (Once per session usually, but we'll keep it simple)
			await awardPoints(userId, 50, "Live Session Participation");
			await checkBadges(userId, "live_session_join");
		}

		res.status(200).json({ message: "Participation recorded" });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

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

		// Use a pure random hex string to bypass Jitsi's 'Reserved Room' logic
		const meetingId = 'Room' + [...Array(20)].map(() => (Math.random() * 36 | 0).toString(36)).join('');

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

		// Emit socket event for real-time updates to course room
		io.to(`course_${courseId}`).emit("newSession", { courseId, session: newSession });

		res.status(201).json(newSession);
	} catch (error) {
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

		const isEnrolled = (course.enrolledStudents || []).some(id => id.toString() === userId.toString());
		const isCreator = course.creator.toString() === userId.toString();

		if (!isEnrolled && !isCreator) {
			return res.status(403).json({ message: "Access denied. You must be enrolled in this course to attend live sessions." });
		}

		const sessions = await LiveSession.find({ courseId }).sort({ startTime: -1 });
		res.status(200).json(sessions);
	} catch (error) {
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

        const courseId = session.courseId;
		session.status = status;
		await session.save();

		if (status === 'ended') {
			io.to(`course_${courseId}`).emit("sessionEnded", { sessionId: id });
		}

		// Emit general update for real-time status changes
		io.to(`course_${courseId}`).emit("sessionUpdated", { sessionId: id, status });

		res.status(200).json(session);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteLiveSession = async (req, res) => {
	try {
		const { id } = req.params;
		const session = await LiveSession.findById(id);
		if (!session) return res.status(404).json({ message: "Session not found" });

		if (session.creatorId.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Unauthorized. Only the creator can delete this session." });
		}

		await LiveSession.findByIdAndDelete(id);
		res.status(200).json({ message: "Session deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateSessionDetails = async (req, res) => {
	try {
		const { id } = req.params;
		const { recordingUrl, notes } = req.body;

		const session = await LiveSession.findById(id);
		if (!session) return res.status(404).json({ message: "Session not found" });

		if (session.creatorId.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Unauthorized" });
		}

		if (recordingUrl !== undefined) session.recordingUrl = recordingUrl;
		if (notes !== undefined) session.notes = notes;
		
		await session.save();

		res.status(200).json(session);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

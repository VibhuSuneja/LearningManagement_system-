import Attendance from "../model/attendanceModel.js";
import LiveSession from "../model/liveSessionModel.js";
import Course from "../model/courseModel.js";

export const markAttendance = async (req, res) => {
	try {
		const { sessionId, courseId, records } = req.body;
		const educatorId = req.user._id;

		// Verify session and course exist
		const session = await LiveSession.findById(sessionId);
		if (!session) return res.status(404).json({ message: "Session not found" });

		const course = await Course.findById(courseId);
		if (!course) return res.status(404).json({ message: "Course not found" });

		// Verify educator is the creator
		if (session.creatorId.toString() !== educatorId.toString()) {
			return res.status(403).json({ message: "Unauthorized. Only the session creator can mark attendance." });
		}

		// Check if attendance already exists for this session
		let attendance = await Attendance.findOne({ sessionId });

		if (attendance) {
			attendance.records = records;
			await attendance.save();
		} else {
			attendance = new Attendance({
				sessionId,
				courseId,
				records,
				educatorId,
			});
			await attendance.save();
		}

		res.status(200).json(attendance);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAttendanceBySession = async (req, res) => {
	try {
		const { sessionId } = req.params;
		const attendance = await Attendance.findOne({ sessionId }).populate("records.studentId", "name email");
		if (!attendance) return res.status(404).json({ message: "Attendance record not found for this session" });

		res.status(200).json(attendance);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAttendanceByCourse = async (req, res) => {
	try {
		const { courseId } = req.params;
		const attendanceRecords = await Attendance.find({ courseId })
			.populate("sessionId", "title startTime")
			.populate("records.studentId", "name email");

		res.status(200).json(attendanceRecords);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

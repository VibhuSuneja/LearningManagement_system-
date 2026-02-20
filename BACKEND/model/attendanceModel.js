import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
	{
		sessionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "LiveSession",
			required: true,
		},
		courseId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
		records: [
			{
				studentId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				status: {
					type: String,
					enum: ["present", "absent", "late"],
					default: "present",
				},
			},
		],
		educatorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;

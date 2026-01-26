import mongoose from "mongoose";

const liveSessionSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		startTime: {
			type: Date,
			required: true,
		},
		duration: {
			type: Number, // in minutes
			required: true,
		},
		meetingId: {
			type: String,
			required: true,
			unique: true,
		},
		roomName: {
			type: String,
		},
		recordingUrl: {
			type: String, // Link to recorded video (Drive, Youtube, etc)
			default: "",
		},
		courseId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			required: true,
		},
		creatorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: ["scheduled", "live", "ended"],
			default: "scheduled",
		},
	},
	{ timestamps: true }
);

const LiveSession = mongoose.model("LiveSession", liveSessionSchema);

export default LiveSession;

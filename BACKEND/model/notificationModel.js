import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: ["enrollment", "course_update", "comment", "chat", "system"],
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		relatedId: {
			type: mongoose.Schema.Types.ObjectId, // Can be courseId, chatId, etc.
		},
		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

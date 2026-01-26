import Notification from "../model/notificationModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getNotifications = async (req, res) => {
	try {
		const userId = req.user._id;
		const notifications = await Notification.find({ recipient: userId })
			.sort({ createdAt: -1 })
			.populate("sender", "name email profileImage");

		res.status(200).json(notifications);
	} catch (error) {
		console.log("Error in getNotifications:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const markAsRead = async (req, res) => {
	try {
		const { id } = req.params;
		await Notification.findByIdAndUpdate(id, { isRead: true });
		res.status(200).json({ message: "Notification marked as read" });
	} catch (error) {
		console.log("Error in markAsRead:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const markAllAsRead = async (req, res) => {
	try {
		const userId = req.user._id;
		await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
		res.status(200).json({ message: "All notifications marked as read" });
	} catch (error) {
		console.log("Error in markAllAsRead:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const createNotification = async (recipient, sender, type, content, relatedId) => {
	try {
		const notification = new Notification({
			recipient,
			sender,
			type,
			content,
			relatedId,
		});

		await notification.save();

		const receiverSocketId = getReceiverSocketId(recipient);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newNotification", notification);
		}
	} catch (error) {
		console.log("Error creating notification:", error.message);
	}
};

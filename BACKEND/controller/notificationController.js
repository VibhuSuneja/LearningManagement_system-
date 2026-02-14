import Notification from "../model/notificationModel.js";
import { getReceiverSocketId, getIO } from "../socket/socket.js";

export const getNotifications = async (req, res) => {
	try {
		const userId = req.user._id;
		const notifications = await Notification.find({ recipient: userId })
			.sort({ createdAt: -1 })
			.populate("sender", "name email profileImage");

		res.status(200).json(notifications);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const markAsRead = async (req, res) => {
	try {
		const { id } = req.params;
		await Notification.findByIdAndUpdate(id, { isRead: true });
		res.status(200).json({ message: "Notification marked as read" });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const markAllAsRead = async (req, res) => {
	try {
		const userId = req.user._id;
		await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
		res.status(200).json({ message: "All notifications marked as read" });
	} catch (error) {
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
		// Targeted notification using both room and specific socket ID if available
		getIO().to(recipient.toString()).emit("newNotification", notification);
		
		if (receiverSocketId) {
		}
	} catch (error) {
	}
};

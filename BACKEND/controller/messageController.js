import Conversation from "../model/conversationModel.js";
import Message from "../model/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { createNotification } from "./notificationController.js";
import uploadToCloudinary from "../config/cloudinary.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let imageUrl = "";
		let audioUrl = "";

		// Handle file uploads
		if (req.files) {
			if (req.files.image) {
				imageUrl = await uploadToCloudinary(req.files.image[0].buffer);
			}
			if (req.files.audio) {
				audioUrl = await uploadToCloudinary(req.files.audio[0].buffer);
			}
		}

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message: message || "",
			imageUrl,
			audioUrl,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY - Send to receiver
		const receiverSocketId = getReceiverSocketId(receiverId);
		console.log(`[Message] Sending from ${senderId} to ${receiverId}`);
		console.log(`[Message] Receiver socket ID: ${receiverSocketId}`);
		
		if (receiverSocketId) {
			// Emit to receiver's specific socket
			io.to(receiverSocketId).emit("newMessage", newMessage);
			console.log(`[Message] ✅ Sent to receiver socket: ${receiverSocketId}`);
		} else {
			console.log(`[Message] ⚠️ Receiver ${receiverId} is offline`);
		}
		
		// Also emit to receiver's user room (backup delivery method)
		io.to(receiverId.toString()).emit("newMessage", newMessage);
		console.log(`[Message] ✅ Sent to receiver room: ${receiverId}`);

		// Create notification for the receiver
		let notificationContent = message ? `New message: ${message.substring(0, 20)}...` : "";
		if (imageUrl) notificationContent = "Sent a photo 📷";
		if (audioUrl) notificationContent = "Sent a voice message 🎤";

		await createNotification(
			receiverId,
			senderId,
			"chat",
			notificationContent,
			conversation._id
		);

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

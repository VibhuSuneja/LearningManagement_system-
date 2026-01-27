import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useSocketContext } from "../context/SocketContext";

const useGetMessages = (selectedConversationId) => {
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState([]);
	const { socket } = useSocketContext();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await axios.get(`${serverUrl}/api/message/${selectedConversationId}`, {
					withCredentials: true,
				});
				setMessages(res.data);
			} catch (error) {
				console.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversationId) getMessages();
	}, [selectedConversationId]);

	useEffect(() => {
		if (socket && selectedConversationId) {
			console.log(`[Messages] Setting up listener for conversation: ${selectedConversationId}`);
			
			socket.on("newMessage", (newMessage) => {
				console.log(`[Messages] Received newMessage:`, newMessage);
				console.log(`[Messages] Current conversation: ${selectedConversationId}`);
				console.log(`[Messages] Message senderId: ${newMessage.senderId}`);
				console.log(`[Messages] Message receiverId: ${newMessage.receiverId}`);
				
				// Convert to strings for safe comparison
				const selectedId = selectedConversationId?.toString();
				const messageSenderId = newMessage.senderId?.toString();
				const messageReceiverId = newMessage.receiverId?.toString();
				
				console.log(`[Messages] Comparing: senderId(${messageSenderId}) or receiverId(${messageReceiverId}) with selected(${selectedId})`);
				
				// Message belongs to this conversation if either sender or receiver is the selected user
				const belongsToConversation = messageSenderId === selectedId || messageReceiverId === selectedId;
				
				if (belongsToConversation) {
					console.log(`[Messages] ✅ Adding message to conversation`);
					setMessages((prev) => {
						// Prevent duplicate messages
						const isDuplicate = prev.some(msg => msg._id?.toString() === newMessage._id?.toString());
						if (isDuplicate) {
							console.log(`[Messages] ⚠️ Duplicate message detected, skipping`);
							return prev;
						}
						return [...prev, newMessage];
					});
				} else {
					console.log(`[Messages] ⏭️ Message not for this conversation (senderId: ${messageSenderId}, receiverId: ${messageReceiverId}, selected: ${selectedId})`);
				}
			});

			return () => {
				console.log(`[Messages] Cleaning up listener for conversation: ${selectedConversationId}`);
				socket.off("newMessage");
			};
		}
	}, [socket, selectedConversationId, setMessages]);

	return { messages, setMessages, loading };
};

export default useGetMessages;

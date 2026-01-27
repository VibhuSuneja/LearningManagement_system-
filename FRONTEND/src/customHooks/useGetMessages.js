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
		if (socket) {
			console.log(`[Messages] Setting up listener for conversation: ${selectedConversationId}`);
			
			socket.on("newMessage", (newMessage) => {
				console.log(`[Messages] Received newMessage:`, newMessage);
				console.log(`[Messages] Current conversation: ${selectedConversationId}`);
				console.log(`[Messages] Message senderId: ${newMessage.senderId}`);
				
				// If the message is from the currently selected conversation
				if (newMessage.senderId === selectedConversationId || newMessage.receiverId === selectedConversationId) {
					console.log(`[Messages] ✅ Adding message to conversation`);
					setMessages((prev) => {
						// Prevent duplicate messages
						const isDuplicate = prev.some(msg => msg._id === newMessage._id);
						if (isDuplicate) {
							console.log(`[Messages] ⚠️ Duplicate message detected, skipping`);
							return prev;
						}
						return [...prev, newMessage];
					});
				} else {
					console.log(`[Messages] ⏭️ Message not for this conversation`);
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

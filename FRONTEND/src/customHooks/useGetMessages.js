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
			socket.on("newMessage", (newMessage) => {
				// Convert to strings for safe comparison
				const selectedId = selectedConversationId?.toString();
				const messageSenderId = newMessage.senderId?.toString();
				const messageReceiverId = newMessage.receiverId?.toString();
				
				// Message belongs to this conversation if either sender or receiver is the selected user
				const belongsToConversation = messageSenderId === selectedId || messageReceiverId === selectedId;
				
				if (belongsToConversation) {
					setMessages((prev) => {
						// Prevent duplicate messages
						const isDuplicate = prev.some(msg => msg._id?.toString() === newMessage._id?.toString());
						if (isDuplicate) {
							return prev;
						}
						return [...prev, newMessage];
					});
				}
			});

			return () => {
				socket.off("newMessage");
			};
		}
	}, [socket, selectedConversationId, setMessages]);

	return { messages, setMessages, loading };
};

export default useGetMessages;

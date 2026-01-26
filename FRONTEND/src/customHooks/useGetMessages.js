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
			socket.on("newMessage", (newMessage) => {
				if (newMessage.senderId === selectedConversationId) {
					setMessages((prev) => [...prev, newMessage]);
				}
			});

			return () => socket.off("newMessage");
		}
	}, [socket, selectedConversationId]);

	return { messages, setMessages, loading };
};

export default useGetMessages;

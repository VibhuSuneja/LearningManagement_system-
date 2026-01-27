import { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { serverUrl } from "../App";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { userData } = useSelector((state) => state.user);

	useEffect(() => {
		if (userData) {
			const socket = io(serverUrl, {
				query: {
					userId: userData._id,
				},
				transports: ["websocket", "polling"], // WebSocket first for better real-time performance
				withCredentials: true,
				reconnection: true,
				reconnectionAttempts: 5,
				reconnectionDelay: 1000,
			});

			setSocket(socket);

			// Connection event handlers
			socket.on("connect", () => {
				// Connected
			});

			socket.on("connect_error", (error) => {
				// Connection error
			});

			socket.on("reconnect", (attemptNumber) => {
				// Reconnected
			});

			// Listen to online users updates
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () => {
				socket.close();
			};
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [userData]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};

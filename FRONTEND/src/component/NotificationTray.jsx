import React, { useState, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";
import { useSocketContext } from "../context/SocketContext";
import { toast } from "react-toastify";

const NotificationTray = () => {
	const [notifications, setNotifications] = useState([]);
	const [showTray, setShowTray] = useState(false);
	const { socket } = useSocketContext();
	const { userData } = useSelector((state) => state.user);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const { data } = await axios.get(`${serverUrl}/api/notification`, {
					withCredentials: true,
				});
				setNotifications(data);
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
		};

		if (userData) {
			fetchNotifications();
		}
	}, [userData]);

	useEffect(() => {
		if (socket) {
			socket.on("newNotification", (notification) => {
				setNotifications((prev) => [notification, ...prev]);
				toast.info(`New notification: ${notification.content}`);
			});

			return () => socket.off("newNotification");
		}
	}, [socket]);

	const markAsRead = async (id) => {
		try {
			await axios.put(`${serverUrl}/api/notification/${id}/read`, {}, { withCredentials: true });
			setNotifications((prev) =>
				prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
			);
		} catch (error) {
			console.error("Error marking notification as read:", error);
		}
	};

	const markAllAsRead = async () => {
		try {
			await axios.put(`${serverUrl}/api/notification/mark-all-read`, {}, { withCredentials: true });
			setNotifications((prev) =>
				prev.map((n) => ({ ...n, isRead: true }))
			);
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
		}
	};

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	return (
		<div className="relative">
			<button
				onClick={() => setShowTray(!showTray)}
				className="relative p-2 text-white hover:bg-[#ffffff22] rounded-full transition-all"
			>
				<IoNotificationsOutline size={24} />
				{unreadCount > 0 && (
					<span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
						{unreadCount}
					</span>
				)}
			</button>

			{showTray && (
				<div className="absolute top-12 right-0 w-80 max-h-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-y-auto z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
					<div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
						<h3 className="font-bold text-gray-800">Notifications</h3>
						{unreadCount > 0 && (
							<button 
								onClick={markAllAsRead}
								className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
							>
								Mark all as read
							</button>
						)}
					</div>
					<div className="divide-y divide-gray-50">
						{notifications.length === 0 ? (
							<div className="p-8 text-center text-gray-400">No notifications yet</div>
						) : (
							notifications.map((notification) => (
								<div
									key={notification._id}
									onClick={() => markAsRead(notification._id)}
									className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
										!notification.isRead ? "bg-blue-50/30" : ""
									}`}
								>
									<div className="flex gap-3">
										<div className="flex-1">
											<p className={`text-sm ${!notification.isRead ? "font-semibold text-gray-900" : "text-gray-600"}`}>
												{notification.content}
											</p>
											<span className="text-[10px] text-gray-400 block mt-1">
												{new Date(notification.createdAt).toLocaleString()}
											</span>
										</div>
										{!notification.isRead && (
											<div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
										)}
									</div>
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default NotificationTray;

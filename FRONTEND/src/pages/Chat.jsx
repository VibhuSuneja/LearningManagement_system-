import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { useSocketContext } from "../context/SocketContext";
import useGetMessages from "../customHooks/useGetMessages";
import useSendMessage from "../customHooks/useSendMessage";
import { IoSend, IoImageOutline, IoMicOutline, IoStopCircleOutline, IoTrashOutline, IoDownloadOutline } from "react-icons/io5";

const Chat = () => {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [message, setMessage] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [audioBlob, setAudioBlob] = useState(null);
	const [recording, setRecording] = useState(false);
	
	const navigate = useNavigate();
	const { onlineUsers } = useSocketContext();
	const { userData } = useSelector((state) => state.user);
	const { messages, setMessages, loading: messagesLoading } = useGetMessages(selectedUser?._id);
	const { sendMessage, loading: sendingLoading } = useSendMessage();
	
	const lastMessageRef = useRef();
	const fileInputRef = useRef();
	const mediaRecorderRef = useRef(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const { data } = await axios.get(`${serverUrl}/api/user`, {
					withCredentials: true,
				});
				setUsers(data);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchUsers();
	}, []);

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImage(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			
			const chunks = [];
			mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
			mediaRecorder.onstop = () => {
				const blob = new Blob(chunks, { type: "audio/webm" });
				setAudioBlob(blob);
				stream.getTracks().forEach(track => track.stop());
			};

			mediaRecorder.start();
			setRecording(true);
		} catch (err) {
			console.error("Error starting recording:", err);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			setRecording(false);
		}
	};

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!message.trim() && !image && !audioBlob || !selectedUser) return;
		
		const sentMessage = await sendMessage(selectedUser._id, message, image, audioBlob);
		
		if (sentMessage) {
			setMessages((prev) => [...prev, sentMessage]);
		}
		
		// Reset state
		setMessage("");
		setImage(null);
		setImagePreview(null);
		setAudioBlob(null);
	};

	const handleDownload = async (url, filename) => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = filename || "download";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error("Download failed:", error);
			window.open(url, "_blank");
		}
	};

	return (
		<div className="flex h-[calc(100vh-70px)] mt-[70px] bg-gray-100 overflow-hidden font-sans">
			{/* Sidebar - Hidden on mobile if user selected */}
			<div className={`w-full md:w-1/4 bg-white border-r border-gray-200 overflow-y-auto ${selectedUser ? 'hidden md:block' : 'block'}`}>
				<div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
					<div className="flex items-center gap-3">
						<button 
							onClick={() => navigate('/')}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							title="Back to Home"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
						</button>
						<h2 className="text-xl font-bold text-gray-800 flex-1">Messages</h2>
					</div>
				</div>
				<div className="divide-y divide-gray-50">
					{users.map((user) => (
						<div
							key={user._id}
							onClick={() => setSelectedUser(user)}
							className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-all ${
								selectedUser?._id === user._id ? "bg-blue-50 border-l-4 border-black" : ""
							}`}
						>
							<div className="relative">
								{user.photoUrl && user.photoUrl !== "" ? (
									<img src={user.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
								) : (
									<div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
										{user.name.charAt(0).toUpperCase()}
									</div>
								)}
								{onlineUsers.includes(user._id) && (
									<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
								)}
							</div>
							<div className="flex-1 overflow-hidden">
								<h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
								<p className="text-xs text-gray-500 capitalize">{user.role}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Chat Area - Hidden on mobile if no user selected */}
			<div className={`flex-1 flex-col bg-white ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
				{selectedUser ? (
					<>
						{/* Chat Header */}
						<div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white shadow-sm z-10">
							{/* Back Button for Mobile */}
							<button 
								onClick={() => setSelectedUser(null)}
								className="md:hidden p-2 -ml-2 text-gray-600 hover:text-black"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
							</button>

							<div className="relative">
								{selectedUser.photoUrl && selectedUser.photoUrl !== "" ? (
									<img src={selectedUser.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
								) : (
									<div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
										{selectedUser.name.charAt(0).toUpperCase()}
									</div>
								)}
								{onlineUsers.includes(selectedUser._id) && (
									<div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
								)}
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 leading-none">{selectedUser.name}</h3>
								<span className="text-[10px] text-gray-400 mt-1 block">
									{onlineUsers.includes(selectedUser._id) ? "Active Now" : "Offline"}
								</span>
							</div>
						</div>

						{/* Messages */}
						<div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-[#f9fafb]">
							{messages.map((msg, idx) => {
								const isMe = msg.senderId === userData?._id;
								return (
									<div
										key={msg._id || idx}
										ref={idx === messages.length - 1 ? lastMessageRef : null}
										className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
									>
										<div
											className={`max-w-[85%] md:max-w-[70%] group relative ${
												isMe
													? "bg-black text-white rounded-2xl rounded-tr-none shadow-lg px-4 py-3"
													: "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm px-4 py-3"
											}`}
										>
											{/* Image Attachment */}
											{msg.imageUrl && (
												<div className="mb-2 relative rounded-lg overflow-hidden border border-gray-200/20">
													<img src={msg.imageUrl} alt="attachment" className="max-w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(msg.imageUrl, '_blank')} />
													<button 
														onClick={() => handleDownload(msg.imageUrl, `image_${idx}.jpg`)}
														className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
													>
														<IoDownloadOutline size={18} />
													</button>
												</div>
											)}

											{/* Audio Attachment */}
											{msg.audioUrl && (
												<div className={`mb-2 p-2 rounded-lg flex items-center gap-3 ${isMe ? "bg-white/10" : "bg-gray-50"}`}>
													<audio controls src={msg.audioUrl} className="h-8 max-w-[200px]" />
													<button 
														onClick={() => handleDownload(msg.audioUrl, `voice_note_${idx}.webm`)}
														className={`p-2 rounded-full ${isMe ? "hover:bg-white/20" : "hover:bg-gray-200"}`}
													>
														<IoDownloadOutline size={18} />
													</button>
												</div>
											)}

											{msg.message && <p className="text-sm leading-relaxed">{msg.message}</p>}
											
											<div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
												<span className={`text-[9px] uppercase tracking-wider ${isMe ? "text-gray-400" : "text-gray-400"}`}>
													{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
												</span>
											</div>
										</div>
									</div>
								);
							})}
							{messages.length === 0 && !messagesLoading && (
								<div className="h-full flex flex-col items-center justify-center text-gray-300">
									<IoMicOutline size={48} className="mb-2 opacity-20" />
									<p className="italic">Start a conversation with {selectedUser.name}</p>
								</div>
							)}
						</div>

						{/* Previews */}
						{(imagePreview || audioBlob) && (
							<div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-4 animate-in slide-in-from-bottom-2">
								{imagePreview && (
									<div className="relative w-20 h-20 group">
										<img src={imagePreview} className="w-full h-full object-cover rounded-md border border-gray-200" alt="" />
										<button 
											onClick={() => {setImage(null); setImagePreview(null)}}
											className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
										>
											<IoTrashOutline size={12} />
										</button>
									</div>
								)}
								{audioBlob && (
									<div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md border border-blue-100 flex-1">
										<IoMicOutline className="text-blue-500" size={20} />
										<p className="text-xs font-medium text-blue-700 flex-1">Voice message recorded</p>
										<audio controls src={URL.createObjectURL(audioBlob)} className="h-8" />
										<button 
											onClick={() => setAudioBlob(null)}
											className="bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
										>
											<IoTrashOutline size={14} />
										</button>
									</div>
								)}
							</div>
						)}

						{/* Input Section */}
						<form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
							<div className="flex items-center gap-3 max-w-5xl mx-auto bg-[#f3f4f6] rounded-full px-4 py-2 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-black">
								<input 
									type="file" 
									hidden 
									ref={fileInputRef} 
									accept="image/*"
									onChange={handleImageChange}
								/>
								<button 
									type="button" 
									onClick={() => fileInputRef.current.click()}
									className="text-gray-400 hover:text-black transition-colors"
								>
									<IoImageOutline size={22} />
								</button>

								{recording ? (
									<button 
										type="button"
										onClick={stopRecording}
										className="text-red-500 animate-pulse"
									>
										<IoStopCircleOutline size={26} />
									</button>
								) : (
									<button 
										type="button"
										onClick={startRecording}
										className="text-gray-400 hover:text-black transition-colors"
									>
										<IoMicOutline size={22} />
									</button>
								)}

								<input
									type="text"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder={recording ? "Recording..." : "Type your message..."}
									className="flex-1 bg-transparent border-none py-2 px-1 focus:ring-0 text-sm"
									disabled={recording}
								/>

								<button
									type="submit"
									disabled={sendingLoading || (!message.trim() && !image && !audioBlob)}
									className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-all disabled:opacity-30 disabled:scale-95"
								>
									<IoSend size={18} />
								</button>
							</div>
						</form>
					</>
				) : (
					<div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
						<div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
							<IoMicOutline size={48} className="opacity-10" />
						</div>
						<h3 className="text-xl font-bold text-gray-800 mb-2">Your Conversations</h3>
						<p className="text-gray-400 max-w-xs text-center">Select a student or teacher from the left to start a real-time voice and text chat.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Chat;

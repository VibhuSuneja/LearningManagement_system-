import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { IoVideocamOutline, IoTimeOutline, IoCalendarOutline, IoChevronBackOutline, IoLockClosedOutline, IoTrashOutline, IoPlayCircleOutline, IoLinkOutline, IoDocumentTextOutline } from "react-icons/io5"; // Added icon
import { toast } from "react-toastify";

import { useSocketContext } from "../context/SocketContext";

const LiveSessions = () => {
	const { courseId } = useParams();
    const navigate = useNavigate(); 
	const { userData } = useSelector((state) => state.user);
    const { socket } = useSocketContext();
	const [sessions, setSessions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [activeSession, setActiveSession] = useState(null);
	const [error, setError] = useState(null);
	const [isScriptLoaded, setIsScriptLoaded] = useState(false);
	
	// Form state
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startTime, setStartTime] = useState("");
	const [duration, setDuration] = useState(60); // Default 60 mins
	const [recordingLink, setRecordingLink] = useState("");
	const [notesLink, setNotesLink] = useState(""); // New state for notes
	const [selectedSessionForUpdate, setSelectedSessionForUpdate] = useState(null); // Renamed

	const jitsiContainerRef = useRef(null);
	const jitsiApiRef = useRef(null);

    // ... (useEffect hooks remain same)
    	useEffect(() => {
		fetchSessions();
	}, [courseId]);

    useEffect(() => {
        if (!socket) return;
        
        socket.on("sessionEnded", ({ sessionId }) => {
            console.log(`[Socket] Received sessionEnded for ${sessionId}`);
            if (activeSession && activeSession._id === sessionId) {
                toast.info("The educator has ended the session.");
                if (jitsiApiRef.current) {
                    jitsiApiRef.current.executeCommand('hangup');
                    jitsiApiRef.current.dispose();
                    jitsiApiRef.current = null;
                }
                setActiveSession(null);
                fetchSessions();
            }
        });

        socket.on("newSession", () => {
            fetchSessions();
        });

        socket.on("sessionUpdated", () => {
            fetchSessions();
        });

        return () => {
            socket.off("sessionEnded");
            socket.off("newSession");
            socket.off("sessionUpdated");
        };
    }, [socket, activeSession, courseId]);

	useEffect(() => {
		if (activeSession && isScriptLoaded && !jitsiApiRef.current) {
			// Small delay to ensure the ref the DOM element is rendered
			const timer = setTimeout(() => {
				if (jitsiContainerRef.current) {
					initializeJitsi(activeSession);
				}
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [activeSession, isScriptLoaded]);

	const fetchSessions = async () => {
		try {
			setError(null);
			const { data } = await axios.get(`${serverUrl}/api/live-session/course/${courseId}`, {
				withCredentials: true,
			});
			setSessions(data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching sessions:", error);
			if (error.response?.status === 403 || error.response?.status === 401) {
				setError("You must be enrolled in this course to access live sessions.");
                if (error.response?.status === 401) navigate("/login");
			} else {
				setError("Failed to load sessions. Please try again later.");
			}
			setLoading(false);
		}
	};

	const handleDeleteSession = async (sessionId) => {
		if (!window.confirm("Are you sure you want to delete this session?")) return;
		try {
			await axios.delete(`${serverUrl}/api/live-session/delete/${sessionId}`, { withCredentials: true });
			toast.success("Session deleted");
			fetchSessions();
		} catch (error) {
			console.error("Error deleting session:", error);
			toast.error("Failed to delete session");
		}
	};

	const handleUpdateSessionDetails = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`${serverUrl}/api/live-session/details/${selectedSessionForUpdate}`, 
				{ recordingUrl: recordingLink, notes: notesLink }, 
				{ withCredentials: true }
			);
			toast.success("Session details updated!");
			setRecordingLink("");
			setNotesLink("");
			setSelectedSessionForUpdate(null);
			fetchSessions();
		} catch (error) {
			console.error("Error updating session:", error);
			toast.error("Failed to update details");
		}
	};

	const handleCreateSession = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`${serverUrl}/api/live-session/create`, {
				title,
				description,
				startTime,
				duration,
				courseId
			}, { withCredentials: true });
			
			setTitle("");
			setDescription("");
			setStartTime("");
			setDuration(60);
			setShowForm(false);
			fetchSessions();
		} catch (error) {
			console.error("Error creating session:", error);
		}
	};

	const startMeeting = (session) => {
		// Mobile Optimization: Redirect to Native App/Full Browser logic
		if (window.innerWidth < 768) {
			// CRITICAL FIX: Use the SAME specific domain as the desktop version (meet.guifi.net)
			// and ENFORCE ENGLISH (No quotes for URL hash params)
			window.location.href = `https://meet.guifi.net/${session.meetingId}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.prejoinPageEnabled=false&config.lobbyModeEnabled=false&config.defaultLanguage=en&config.lang=en`;
			return;
		}

		setActiveSession(session);
		
		// Load Jitsi script if not already loaded
		if (!window.JitsiMeetExternalAPI) {
			const script = document.createElement("script");
			script.src = "https://meet.jit.si/external_api.js";
			script.async = true;
			script.onload = () => setIsScriptLoaded(true);
			document.body.appendChild(script);
		} else {
			setIsScriptLoaded(true);
		}
	};

	const handleEndSession = async () => {
		if (!activeSession) return;
		
		try {
			// If educator, mark session as ended in DB
			if (userData._id === activeSession.creatorId) {
				await axios.put(`${serverUrl}/api/live-session/status/${activeSession._id}`, { status: "ended" }, { withCredentials: true });
			}
			
			if (jitsiApiRef.current) {
				jitsiApiRef.current.executeCommand('hangup');
				jitsiApiRef.current.dispose();
				jitsiApiRef.current = null;
			}
			
			setActiveSession(null);
			fetchSessions();
		} catch (err) {
			console.error("Error ending session:", err);
			setActiveSession(null);
		}
	};

	const initializeJitsi = (session) => {
		if (!window.JitsiMeetExternalAPI || !jitsiContainerRef.current) return;

		// connecting to a community instance that allows anonymous room creation
		const domain = "meet.guifi.net";
		const options = {
			roomName: session.meetingId,
			width: "100%",
			height: window.innerWidth < 768 ? "calc(100vh - 80px)" : "600px",
			parentNode: jitsiContainerRef.current,
			lang: 'en',
			configOverwrite: {
				startWithAudioMuted: false,
				startWithVideoMuted: false,
				prejoinPageEnabled: false,
                lobbyModeEnabled: false, // DISABLE WAITING ROOM
				defaultLanguage: 'en',
                lang: 'en'
			},
			interfaceConfigOverwrite: {
				SHOW_JITSI_WATERMARK: false,
				SHOW_BRAND_WATERMARK: false,
				DEFAULT_REMOTE_DISPLAY_NAME: userData.name,
				TOOLBAR_BUTTONS: [
					'microphone', 'camera', 'desktop', 'fullscreen',
					'fodeviceselection', 'hangup', 'chat', 'recording',
					'settings', 'raisehand', 'videoquality', 'filmstrip', 'tileview'
				],
			},
		};

		const api = new window.JitsiMeetExternalAPI(domain, options);
		jitsiApiRef.current = api;
		
		api.executeCommand('displayName', userData.name);

		// Update status to live if creator
		if (userData._id === session.creatorId) {
			axios.put(`${serverUrl}/api/live-session/status/${session._id}`, { status: "live" }, { withCredentials: true });
		}

		api.addEventListeners({
			videoConferenceLeft: () => {
				handleEndSession();
			}
		});
	};

	if (activeSession) {
		return (
			<div className="min-h-screen bg-black pt-[70px] flex flex-col">
				<div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center text-white">
					<div>
						<h2 className="text-xl font-bold">{activeSession.title}</h2>
						<p className="text-sm text-gray-400">Live Classroom</p>
					</div>
					<button 
						onClick={handleEndSession}
						className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full font-bold transition-all"
					>
						{userData._id === activeSession.creatorId ? 'End Class' : 'Leave Class'}
					</button>
				</div>
				<div ref={jitsiContainerRef} className="flex-1 bg-gray-900 border-t border-gray-800 flex items-center justify-center">
					{!jitsiApiRef.current && <div className="text-white animate-pulse font-medium">Connecting to secure classroom...</div>}
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 pt-[100px] px-6 pb-12">
            {/* Header and Create Form Logic remains same */}
			<div className="max-w-5xl mx-auto">
				{/* ... Header ... */}
                <div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
							<div className="p-3 bg-black text-white rounded-2xl shadow-lg">
								<IoVideocamOutline size={28} />
							</div>
							Live Sessions
						</h1>
						<p className="text-gray-500 mt-2">Join live lectures and interact with your instructors in real-time.</p>
					</div>
					{userData.role === "educator" && (
						<button 
							onClick={() => setShowForm(!showForm)}
							className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-all"
						>
							{showForm ? "Cancel" : "Schedule New Session"}
						</button>
					)}
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl text-center mb-10 shadow-sm animate-in fade-in zoom-in">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<IoLockClosedOutline size={32} className="text-red-600" />
						</div>
						<h3 className="text-xl font-bold mb-2">Access Restricted</h3>
						<p className="font-medium">{error}</p>
					</div>
				)}

				{showForm && (
					<div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-10 animate-in fade-in slide-in-from-top-4">
                        {/* ... Create Form ... */}
						<h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Session Details</h3>
						<form onSubmit={handleCreateSession} className="space-y-6">
                            {/* ... Inputs ... */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label className="text-sm font-semibold text-gray-600 ml-1">Session Title</label>
									<input 
										type="text" 
										placeholder="e.g. Weekly Q&A Session"
										className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-semibold text-gray-600 ml-1">Start Time</label>
									<input 
										type="datetime-local" 
										className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all"
										value={startTime}
										onChange={(e) => setStartTime(e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-semibold text-gray-600 ml-1">Duration (minutes)</label>
									<input 
										type="number" 
										placeholder="e.g. 60"
										className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all"
										value={duration}
										onChange={(e) => setDuration(e.target.value)}
										required
										min="1"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-semibold text-gray-600 ml-1">Description</label>
								<textarea 
									placeholder="What will be covered in this session?"
									className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all h-32"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>
							<button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all">
								Create Session & Notify Students
							</button>
						</form>
					</div>
				)}

				{selectedSessionForUpdate && (
					<div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 mb-10 animate-in fade-in zoom-in">
						<h3 className="text-xl font-bold mb-4 text-gray-800">Add Recording & Notes</h3>
						<form onSubmit={handleUpdateSessionDetails} className="flex flex-col gap-4">
							<div className="flex gap-4">
								<input 
									type="url" 
									placeholder="Paste recording link (Youtube, Drive, etc.)"
									className="flex-1 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none"
									value={recordingLink}
									onChange={(e) => setRecordingLink(e.target.value)}
								/>
								<input 
									type="text" 
									placeholder="Paste notes link or short text"
									className="flex-1 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none"
									value={notesLink}
									onChange={(e) => setNotesLink(e.target.value)}
								/>
							</div>
							<div className="flex gap-4 justify-end">
								<button type="submit" className="bg-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all">Save Details</button>
								<button type="button" onClick={() => setSelectedSessionForUpdate(null)} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-2xl font-bold hover:bg-gray-300 transition-all">Cancel</button>
							</div>
						</form>
					</div>
				)}

				<div className="grid gap-6">
					{loading ? (
						<div className="p-12 text-center text-gray-400 font-medium">Loading sessions...</div>
					) : sessions.length === 0 ? (
						<div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
							<IoCalendarOutline size={48} className="mx-auto mb-4 text-gray-200" />
							<p className="text-gray-500 font-medium italic">No live sessions scheduled yet.</p>
						</div>
					) : (
						sessions.map((session) => (
							<div key={session._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center group relative">
								
								{/* Delete Button for Educators */}
								{userData._id === session.creatorId && session.status !== 'live' && (
									<button 
										onClick={() => handleDeleteSession(session._id)}
										className="absolute -top-2 -right-2 p-2 bg-white text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 border border-red-100"
									>
										<IoTrashOutline size={20} />
									</button>
								)}

								<div className="flex gap-6 items-center flex-1">
									<div className={`p-5 rounded-2xl ${session.status === 'live' ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-50 text-gray-400'}`}>
										<IoVideocamOutline size={32} />
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<h3 className="text-xl font-bold text-gray-900">{session.title}</h3>
											{session.status === 'live' && (
												<span className="bg-red-600 text-white text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-widest">Live Now</span>
											)}
											{session.status === 'ended' && (
												<span className="bg-gray-200 text-gray-500 text-[10px] uppercase font-bold px-3 py-1 rounded-full">Finished</span>
											)}
										</div>
										<p className="text-gray-500 text-sm mt-1 mb-3">{session.description}</p>
										<div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
											<div className="flex items-center gap-1.5">
												<IoCalendarOutline />
												{new Date(session.startTime).toLocaleDateString()}
											</div>
											<div className="flex items-center gap-1.5">
												<IoTimeOutline />
												{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
											</div>
											<div className="flex items-center gap-1.5 text-blue-600 font-bold">
												<span>• {session.duration} mins</span>
											</div>
										</div>
									</div>
								</div>
								
								<div className="flex flex-col gap-2">
									{session.status !== 'ended' ? (
										<button 
											onClick={() => startMeeting(session)}
											className={`mt-6 md:mt-0 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg ${
												session.status === 'live' 
													? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200' 
													: 'bg-black text-white hover:shadow-black/20'
											}`}
										>
											{userData._id === session.creatorId ? (session.status === 'live' ? 'Continue Session' : 'Start Session') : 'Join Class'}
										</button>
									) : (
										// Finished Session Actions
										<div className="flex gap-2 flex-wrap justify-end">
											{session.recordingUrl && (
												<a 
													href={session.recordingUrl} 
													target="_blank" 
													rel="noopener noreferrer"
													className="bg-blue-50 text-blue-600 px-4 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-100 transition-all border border-blue-200 shadow-sm"
												>
													<IoPlayCircleOutline size={20} /> Recording
												</a>
											)}
											{session.notes && (
												<a 
													href={session.notes.startsWith('http') ? session.notes : '#'}
													onClick={(e) => !session.notes.startsWith('http') && e.preventDefault()} 
													target={session.notes.startsWith('http') ? "_blank" : "_self"}
													rel="noopener noreferrer"
													className="bg-yellow-50 text-yellow-600 px-4 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-yellow-100 transition-all border border-yellow-200 shadow-sm"
													title={session.notes} // Show text on hover if not a link
												>
													<IoDocumentTextOutline size={20} /> Notes
												</a>
											)}
											
											{userData._id === session.creatorId && (
												<button 
													onClick={() => {
                                                        setSelectedSessionForUpdate(session._id);
                                                        setRecordingLink(session.recordingUrl || "");
                                                        setNotesLink(session.notes || "");
                                                    }}
													className="bg-gray-50 text-gray-600 px-4 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-100 transition-all border border-gray-200 border-dashed"
												>
													<IoLinkOutline size={20} /> Edit Res.
												</button>
											)}
										</div>
									)}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default LiveSessions;

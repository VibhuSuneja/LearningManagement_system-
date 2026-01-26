import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { IoVideocamOutline, IoTimeOutline, IoCalendarOutline, IoChevronBackOutline, IoLockClosedOutline } from "react-icons/io5";

const LiveSessions = () => {
	const { courseId } = useParams();
	const { userData } = useSelector((state) => state.user);
	const [sessions, setSessions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [activeSession, setActiveSession] = useState(null);
	const [error, setError] = useState(null);
	
	// Form state
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startTime, setStartTime] = useState("");
	const [duration, setDuration] = useState(60); // Default 60 mins

	const jitsiContainerRef = useRef(null);
	const jitsiApiRef = useRef(null);

	useEffect(() => {
		fetchSessions();
	}, [courseId]);

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
			if (error.response?.status === 403) {
				setError("You must be enrolled in this course to access live sessions.");
			} else {
				setError("Failed to load sessions. Please try again later.");
			}
			setLoading(false);
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
		setActiveSession(session);
		
		// Load Jitsi script if not already loaded
		if (!window.JitsiMeetExternalAPI) {
			const script = document.createElement("script");
			script.src = "https://meet.jit.si/external_api.js";
			script.async = true;
			script.onload = () => initializeJitsi(session);
			document.body.appendChild(script);
		} else {
			initializeJitsi(session);
		}
	};

	const initializeJitsi = (session) => {
		const domain = "meet.jit.si";
		const options = {
			roomName: session.meetingId,
			width: "100%",
			height: "600px",
			parentNode: jitsiContainerRef.current,
			userInfo: {
				displayName: userData.name,
				email: userData.email,
			},
			configOverwrite: {
				startWithAudioMuted: true,
				disableThirdPartyRequests: true,
				prejoinPageEnabled: false,
				enableWelcomePage: false,
				disableDeepLinking: true,
			},
			interfaceConfigOverwrite: {
				SHOW_JITSI_WATERMARK: false,
				SHOW_WATERMARK_FOR_GUESTS: false,
				SHOW_BRAND_WATERMARK: false,
				MOBILE_APP_PROMO: false,
				DEFAULT_REMOTE_DISPLAY_NAME: 'Student',
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
				if (userData._id === session.creatorId) {
					axios.put(`${serverUrl}/api/live-session/status/${session._id}`, { status: "ended" }, { withCredentials: true });
				}
				setActiveSession(null);
				jitsiApiRef.current = null;
				fetchSessions();
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
						onClick={() => {
							jitsiApiRef.current?.executeCommand('hangup');
							setActiveSession(null);
						}}
						className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full font-bold transition-all"
					>
						{userData.role === 'educator' ? 'End Class' : 'Leave Class'}
					</button>
				</div>
				<div ref={jitsiContainerRef} className="flex-1"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 pt-[100px] px-6 pb-12">
			<div className="max-w-5xl mx-auto">
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
						<h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Session Details</h3>
						<form onSubmit={handleCreateSession} className="space-y-6">
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
							<div key={session._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center group">
								<div className="flex gap-6 items-center flex-1">
									<div className={`p-5 rounded-2xl ${session.status === 'live' ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-50 text-gray-400'}`}>
										<IoVideocamOutline size={32} />
									</div>
									<div>
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
								
								{session.status !== 'ended' && (
									<button 
										onClick={() => startMeeting(session)}
										className={`mt-6 md:mt-0 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg ${
											session.status === 'live' 
												? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200' 
												: 'bg-black text-white hover:shadow-black/20'
										}`}
									>
										{userData.role === 'educator' ? (session.status === 'live' ? 'Continue Session' : 'Start Session') : 'Join Class'}
									</button>
								)}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default LiveSessions;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { useSelector } from 'react-redux';
import Nav from '../component/Nav';
import Footer from '../component/Footer';
import { FaHeart, FaReply, FaChevronLeft, FaTrash, FaUserPlus, FaUserCheck, FaLock, FaThumbtack, FaLockOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const ThreadView = () => {
    // ... same states ...
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.user);
    const [thread, setThread] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isFollowing, setIsFollowing] = useState(false);

    // ... same effects ...

    const handleTogglePin = async () => {
        try {
            const res = await axios.post(`${serverUrl}/api/forum/threads/${id}/pin`, {}, { withCredentials: true });
            setThread(res.data);
            toast.success(res.data.isPinned ? "Thread pinned!" : "Thread unpinned");
        } catch (err) {
            toast.error("Error pinning thread");
        }
    };

    const handleToggleLock = async () => {
        try {
            const res = await axios.post(`${serverUrl}/api/forum/threads/${id}/lock`, {}, { withCredentials: true });
            setThread(res.data);
            toast.success(res.data.isLocked ? "Thread locked!" : "Thread unlocked");
        } catch (err) {
            toast.error("Error locking thread");
        }
    };

    // ... rest of logic ...
    useEffect(() => {
        fetchThread();
    }, [id]);

    useEffect(() => {
        if (thread?.author && userData) {
            setIsFollowing(userData.following?.includes(thread.author._id));
        }
    }, [thread, userData]);

    const fetchThread = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/forum/threads/${id}`, { withCredentials: true });
            setThread(res.data.thread);
            setComments(res.data.comments);
        } catch (err) {
            console.error(err);
            toast.error("Thread not found");
            navigate("/forum");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const res = await axios.post(`${serverUrl}/api/forum/threads/${id}/like`, {}, { withCredentials: true });
            setThread(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${serverUrl}/api/forum/threads/${id}/comments`, { content: newComment }, { withCredentials: true });
            setNewComment("");
            fetchThread(); // Refresh
            toast.success("Comment added!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding comment");
        }
    };

    const handleDeleteThread = async () => {
        if (!window.confirm("Are you sure you want to delete this discussion?")) return;
        try {
            await axios.delete(`${serverUrl}/api/forum/threads/${id}`, { withCredentials: true });
            toast.success("Thread deleted");
            navigate("/forum");
        } catch (err) {
            toast.error("Error deleting thread");
        }
    };

    const handleFollow = async () => {
        try {
            const res = await axios.post(`${serverUrl}/api/forum/user/${thread.author._id}/follow`, {}, { withCredentials: true });
            setIsFollowing(res.data.isFollowing);
            toast.info(res.data.isFollowing ? "Now following!" : "Unfollowed");
        } catch (err) {
            toast.error("Error toggling follow");
        }
    };

    if (loading) return <div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-24">
            <Nav />
            
            <div className="max-w-4xl mx-auto w-full px-6 flex-1 pb-12">
                <button 
                    onClick={() => navigate("/forum")}
                    className="flex items-center gap-2 text-gray-400 font-black text-xs mb-6 hover:text-black transition-all group"
                >
                    <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> BACK TO DISCUSSIONS
                </button>

                {/* Main Thread Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8"
                >
                    <div className="p-8 border-b border-gray-50">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={thread.author?.photoUrl || "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg"} 
                                    className="w-14 h-14 rounded-full object-cover border-4 border-gray-50 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                    alt=""
                                    onClick={() => navigate(`/profile/${thread.author._id}`)}
                                />
                                <div>
                                    <h4 className="font-black text-black text-lg cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate(`/profile/${thread.author._id}`)}>
                                        {thread.author?.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                        <span className="bg-black text-white px-2 py-0.5 rounded-full uppercase">{thread.author?.role}</span>
                                        <span>• {new Date(thread.createdAt).toLocaleString()}</span>
                                        {thread.isPinned && <span className="flex items-center gap-1 text-blue-500"><FaThumbtack /> PINNED</span>}
                                        {thread.isLocked && <span className="flex items-center gap-1 text-red-500"><FaLock /> LOCKED</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {userData?._id !== thread.author?._id && (
                                    <button 
                                        onClick={handleFollow}
                                        className={`px-6 py-2 rounded-full font-black text-xs transition-all flex items-center gap-2 ${isFollowing ? 'bg-gray-100 text-gray-500' : 'bg-black text-white shadow-lg hover:scale-105'}`}
                                    >
                                        {isFollowing ? <><FaUserCheck /> FOLLOWING</> : <><FaUserPlus /> FOLLOW AUTHOR</>}
                                    </button>
                                )}

                                {userData?.role === 'educator' && (
                                    <div className="flex gap-1">
                                        <button onClick={handleTogglePin} className={`p-3 rounded-full transition-all ${thread.isPinned ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:bg-gray-50'}`} title="Pin Thread">
                                            <FaThumbtack />
                                        </button>
                                        <button onClick={handleToggleLock} className={`p-3 rounded-full transition-all ${thread.isLocked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-50'}`} title="Lock Thread">
                                            {thread.isLocked ? <FaLock /> : <FaLockOpen />}
                                        </button>
                                        <button onClick={handleDeleteThread} className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-all" title="Delete Thread">
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <h1 className="text-3xl font-black text-black mb-4 tracking-tight uppercase">{thread.title}</h1>
                        <div className="prose max-w-none text-gray-600 font-medium leading-relaxed mb-6">
                            {thread.content}
                        </div>

                        <div className="flex items-center gap-6">
                            <button 
                                onClick={handleLike}
                                className={`flex items-center gap-2 font-black text-sm px-4 py-2 rounded-full transition-all ${thread.likes?.includes(userData?._id) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:text-black'}`}
                            >
                                <FaHeart /> {thread.likes?.length || 0} LIKES
                            </button>
                            <span className="text-xs font-black text-gray-400 uppercase">{comments.length} REPLIES</span>
                        </div>
                    </div>

                    {/* Comment Form */}
                    <div className="p-8 bg-gray-50/50">
                        {thread.isLocked ? (
                            <div className="bg-gray-100 p-4 rounded-2xl flex items-center justify-center gap-2 text-gray-500 font-bold">
                                <FaLock /> THIS DISCUSSION IS LOCKED
                            </div>
                        ) : (
                            <form onSubmit={handleAddComment} className="space-y-4">
                                <div className="flex gap-4">
                                    <img src={userData?.photoUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                                    <div className="flex-1">
                                        <textarea 
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Add your perspective..."
                                            className="w-full bg-white border border-gray-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black font-medium resize-none shadow-sm"
                                            rows={3}
                                            required
                                        ></textarea>
                                        <div className="flex justify-end mt-2">
                                            <button 
                                                type="submit" 
                                                disabled={!newComment.trim()}
                                                className="bg-black text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                POST REPLY
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>

                {/* Comments List */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Community Replies</h3>
                    {comments.length === 0 ? (
                        <div className="text-center py-12 text-gray-300 font-black italic">Be the first to share your thoughts!</div>
                    ) : (
                        comments.map((comment, index) => (
                            <motion.div 
                                key={comment._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-4"
                            >
                                <img 
                                    src={comment.author?.photoUrl} 
                                    className="w-10 h-10 rounded-full object-cover shadow-sm cursor-pointer hover:scale-110 transition-transform" 
                                    alt="" 
                                    onClick={() => navigate(`/profile/${comment.author._id}`)}
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-black text-black text-sm cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate(`/profile/${comment.author._id}`)}>
                                                {comment.author?.name}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 ml-2">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <button className="text-gray-300 hover:text-black transition-all">
                                            <FaReply size={12} />
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{comment.content}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ThreadView;

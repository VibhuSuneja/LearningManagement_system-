import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../component/Nav';
import Footer from '../component/Footer';
import { FaPlus, FaComments, FaHeart, FaChevronRight, FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Forum = () => {
    const { userData } = useSelector(state => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check for courseId in URL
    const queryParams = new URLSearchParams(location.search);
    const courseIdParam = queryParams.get('courseId');

    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Create Thread Form State (with courseId if present)
    const [newThread, setNewThread] = useState({ 
        title: '', 
        content: '', 
        category: 'General', 
        courseId: courseIdParam || null 
    });

    useEffect(() => {
        fetchThreads();
    }, [category, location.search]);

    const fetchThreads = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/forum/threads`, { 
                params: {
                    category: category || undefined,
                    courseId: courseIdParam || undefined
                },
                withCredentials: true 
            });
            setThreads(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateThread = async (e) => {
        e.preventDefault();
        try {
            console.log("Posting discussion...", newThread);
            await axios.post(`${serverUrl}/api/forum/threads`, newThread, { withCredentials: true });
            setShowCreateModal(false);
            setNewThread({ title: '', content: '', category: 'General', courseId: courseIdParam || null });
            fetchThreads();
            toast.success("Thread created successfully!");
        } catch (err) {
            console.error("Error creating thread:", err);
            toast.error(err.response?.data?.message || "Failed to create thread");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col pt-24">
            <Nav />
            <div className="max-w-6xl mx-auto w-full px-6 flex-1 flex flex-col md:flex-row gap-8">
                
                {/* Sidebar Filters */}
                <div className="md:w-64 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-black font-black mb-4 flex items-center gap-2">
                            <FaFilter /> CATEGORIES
                        </h3>
                        <div className="flex flex-col gap-2">
                            {["", "General", "Question", "Announcement", "Feedback", "Resources"].map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${category === cat ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {cat || "All Discussions"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="w-full bg-black text-white p-4 rounded-3xl font-black flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        <FaPlus /> START A THREAD
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-4 pb-12">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => navigate('/')}
                                    className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition-all group"
                                    title="Back to Home"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                                <h1 className="text-3xl font-black text-black tracking-tight">COMMUNITY FORUM</h1>
                            </div>
                            {courseIdParam && (
                                <div className="flex items-center gap-2 mt-2 ml-14">
                                    <span className="text-xs font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center gap-2">
                                        COURSE DISCUSSIONS <FaTimes className="cursor-pointer" onClick={() => navigate('/forum')} />
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                           <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                           <input type="text" placeholder="Search threads..." className="pl-10 pr-4 py-2 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black w-64 text-sm font-bold" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                        </div>
                    ) : threads.length === 0 ? (
                        <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-100">
                            <FaComments size={50} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-500 font-bold">No discussions found in this category.</p>
                        </div>
                    ) : (
                        threads.map((thread, index) => (
                            <motion.div 
                                key={thread._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => navigate(`/forum/${thread._id}`)}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:border-black hover:shadow-xl transition-all cursor-pointer group"
                            >
                                <div className="flex gap-4">
                                    <img 
                                        src={thread.author?.photoUrl || "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg"} 
                                        className="w-12 h-12 rounded-full border-2 border-gray-50 object-cover hover:scale-110 transition-transform"
                                        alt=""
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/profile/${thread.author._id}`);
                                        }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">{thread.category}</span>
                                            <span 
                                                className="text-[10px] text-gray-400 font-bold hover:text-black transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/profile/${thread.author._id}`);
                                                }}
                                            >
                                                BY {thread.author?.name?.toUpperCase()} • {new Date(thread.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-black text-black group-hover:text-blue-600 transition-colors uppercase tracking-tight">{thread.title}</h2>
                                        <p className="text-gray-500 text-sm line-clamp-2 mt-2">{thread.content}</p>
                                        
                                        <div className="flex items-center gap-6 mt-4">
                                            <span className="flex items-center gap-1 text-xs font-black text-gray-400 group-hover:text-red-500 transition-colors">
                                                <FaHeart /> {thread.likes?.length || 0}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs font-black text-gray-400 group-hover:text-black transition-colors">
                                                <FaComments /> JOIN DISCUSSION
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FaChevronRight className="text-gray-200 group-hover:text-black transition-all" />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Create Thread Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl overflow-hidden"
                        >
                            <h2 className="text-2xl font-black mb-6">NEW DISCUSSION</h2>
                            <form onSubmit={handleCreateThread} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Title</label>
                                    <input 
                                        required 
                                        type="text" 
                                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black font-bold"
                                        placeholder="What's on your mind?"
                                        value={newThread.title}
                                        onChange={(e) => setNewThread({...newThread, title: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Category</label>
                                        <select 
                                            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black font-bold"
                                            value={newThread.category}
                                            onChange={(e) => setNewThread({...newThread, category: e.target.value})}
                                        >
                                            {["General", "Question", "Announcement", "Feedback", "Resources"].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Tags (Optional)</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black font-bold"
                                            placeholder="React, CSS, Help..."
                                            onChange={(e) => setNewThread({...newThread, tags: e.target.value.split(',').map(t => t.trim())})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Content</label>
                                    <textarea 
                                        required 
                                        rows={6}
                                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black font-bold resize-none"
                                        placeholder="Describe your discussion topic in detail..."
                                        value={newThread.content}
                                        onChange={(e) => setNewThread({...newThread, content: e.target.value})}
                                    ></textarea>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 bg-gray-100 text-gray-500 font-black p-4 rounded-2xl hover:bg-gray-200 transition-all"
                                    >
                                        CANCEL
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 bg-black text-white font-black p-4 rounded-2xl shadow-xl hover:scale-105 transition-all"
                                    >
                                        POST DISCUSSION
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default Forum;

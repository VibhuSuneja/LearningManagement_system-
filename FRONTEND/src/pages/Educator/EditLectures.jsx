import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaArrowLeftLong, FaCheck, FaTrash, FaCloudUploadAlt, FaVideo } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import { setLectureData } from '../../redux/lectureSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../../component/Nav';
import Footer from '../../component/Footer';

function EditLectures() {
    const { courseId, lectureId } = useParams();
    const { lectureData } = useSelector(state => state.lecture);
    const selectedLecture = lectureData?.find(lecture => lecture._id == lectureId);
    const navigate = useNavigate();
    
    const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "");
    const [videoFile, setVideoFile] = useState(null);
    const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture?.isPreviewFree || false);
    const [loading, setLoading] = useState(false);
    const [loadingRemove, setLoadingRemove] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!selectedLecture) {
            navigate(`/createlecture/${courseId}`);
        }
    }, [selectedLecture, courseId, navigate]);

    const handleEditLecture = async () => {
        if (!lectureTitle.trim()) {
            toast.error("Signature required");
            return;
        }

        setLoading(true);
        const formdata = new FormData();
        formdata.append("lectureTitle", lectureTitle);
        if (videoFile) {
            formdata.append("videoUrl", videoFile);
        }
        formdata.append("isPreviewFree", isPreviewFree);

        try {
            const result = await axios.post(
                `${serverUrl}/api/course/editlecture/${lectureId}`, 
                formdata, 
                { withCredentials: true }
            );
            
            // Update local state by replacing the edited lecture
            const updatedLectures = lectureData.map(l => l._id === lectureId ? result.data.lecture : l);
            dispatch(setLectureData(updatedLectures));
            
            toast.success("Neural Node Recalibrated");
            navigate(`/createlecture/${courseId}`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Recalibration failed");
        } finally {
            setLoading(false);
        }
    };

    const removeLecture = async () => {
        if (!window.confirm("Are you sure you want to purge this node? This action cannot be undone.")) return;
        
        setLoadingRemove(true);
        try {
            await axios.delete(`${serverUrl}/api/course/removelecture/${lectureId}`, { withCredentials: true });
            const filteredLectures = lectureData.filter(l => l._id !== lectureId);
            dispatch(setLectureData(filteredLectures));
            toast.success("Node Purged Successfully");
            navigate(`/createlecture/${courseId}`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Purge protocol failed");
        } finally {
            setLoadingRemove(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            <Nav />

            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/[0.02] blur-[150px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/[0.02] blur-[150px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto px-6 pt-40 pb-24 relative z-10">
                
                {/* Header Navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate(`/createlecture/${courseId}`)}
                            className="flex items-center gap-3 text-white/30 hover:text-white transition-all group"
                        >
                            <FaArrowLeftLong className="group-hover:-translate-x-2 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Archive</span>
                        </button>
                        <div className="space-y-2">
                            <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Pathway Recalibration</h2>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Edit Node</h1>
                        </div>
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={removeLecture}
                        disabled={loadingRemove}
                        className="px-8 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-red-500 flex items-center gap-3 hover:bg-red-500 hover:text-white transition-all disabled:opacity-20"
                    >
                        <FaTrash className="opacity-50" />
                        {loadingRemove ? "Purging..." : "Purge Node"}
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* Logic Column */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 md:p-14 space-y-12"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Node Parameters</h2>
                            <div className="h-px w-20 bg-white/10" />
                        </div>

                        <div className="space-y-8">
                            {/* Title */}
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Display Signature</label>
                                <input
                                    type="text"
                                    value={lectureTitle}
                                    onChange={(e) => setLectureTitle(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none focus:ring-1 focus:ring-white/10 transition-all font-medium placeholder:text-white/5"
                                    placeholder="Module title"
                                />
                            </div>

                            {/* Access Toggle */}
                            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Access Protocol</h4>
                                    <p className="text-[11px] font-medium text-white/60">Public Preview Mode</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={isPreviewFree}
                                        onChange={() => setIsPreviewFree(!isPreviewFree)}
                                    />
                                    <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white/20 after:border-white/10 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-500/20 peer-checked:after:bg-indigo-500"></div>
                                </label>
                            </div>
                        </div>

                        <div className="pt-8">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleEditLecture}
                                disabled={loading}
                                className="w-full py-6 bg-white text-black rounded-[28px] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? <ClipLoader size={18} color="black" /> : (
                                    <>
                                        Calibrate Node
                                        <FaCheck size={12} />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Media Column */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Neural Stream</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Video Asset Configuration</p>
                            </div>

                            <div className="space-y-6">
                                {selectedLecture?.videoUrl && !videoFile && (
                                    <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 relative group">
                                        <video src={selectedLecture.videoUrl} className="w-full h-full object-cover opacity-40" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/40">
                                                <FaVideo size={24} />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-md border border-white/5 rounded-2xl flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Current Stream Active</span>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Override Stream (Optional)</label>
                                    <div className="relative group">
                                        <input 
                                            type="file" 
                                            accept="video/*"
                                            onChange={(e) => setVideoFile(e.target.files[0])}
                                            className="hidden" 
                                            id="video-upload"
                                        />
                                        <label 
                                            htmlFor="video-upload" 
                                            className="w-full flex flex-col items-center justify-center gap-4 py-12 border-2 border-dashed border-white/5 rounded-[32px] cursor-pointer hover:bg-white/5 hover:border-white/10 transition-all"
                                        >
                                            <div className="p-5 bg-white/5 rounded-2xl text-white/20 group-hover:text-white transition-colors">
                                                <FaCloudUploadAlt size={32} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                                                    {videoFile ? videoFile.name : "Inject New Stream"}
                                                </p>
                                                <p className="text-[9px] font-medium text-white/10 mt-1">MP4, WebM preferred</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {loading && (
                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] p-8 flex items-center gap-6 animate-pulse">
                                <ClipLoader size={24} color="#6366F1" />
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Stream Propagation in Progress</h4>
                                    <p className="text-[11px] font-medium text-indigo-400/60">Synchronizing neural data with edge nodes...</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EditLectures;

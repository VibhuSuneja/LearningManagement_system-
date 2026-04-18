import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaUsers, FaFileAlt, FaCalendarAlt, FaStar, FaCheckCircle, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../../component/Nav';
import Footer from '../../component/Footer';

function ManageAssignments() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, assignmentId: null, assignmentTitle: '' });

  useEffect(() => {
    fetchAssignments();
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, {
        withCredentials: true
      });
      setCourseName(response.data.title);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/assignment/course/${courseId}`,
        { withCredentials: true }
      );
      setAssignments(response.data.assignments || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch assignments');
      setLoading(false);
    }
  };

  const handleDelete = async (assignmentId) => {
    try {
      await axios.delete(`${serverUrl}/api/assignment/${assignmentId}`, {
        withCredentials: true
      });
      toast.success('Assignment deleted successfully');
      setDeleteModal({ show: false, assignmentId: null, assignmentTitle: '' });
      fetchAssignments();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete assignment');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-2 border-white/5 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <ClipLoader color="white" size={30} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
      <Nav />
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/[0.03] blur-[150px] rounded-full" />
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-blue-600/[0.02] blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
          <div className="space-y-8">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/courses')}
              className="group flex items-center gap-4 text-white/40 hover:text-white transition-all duration-300"
            >
              <div className="p-3 rounded-full border border-white/5 bg-white/[0.02] group-hover:bg-white/[0.05] group-hover:border-white/10 transition-all duration-300">
                <FaArrowLeft className="text-xs" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Hub</span>
            </motion.button>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-blue-500/50" />
                <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.5em]">{courseName || "Knowledge Archive"}</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">
                Manage<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Assignments</span>
              </h1>
            </motion.div>
          </div>
          
          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/create-assignment/${courseId}`)}
            className="group relative overflow-hidden px-10 py-6 bg-white text-black rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-4 transition-all duration-500 shadow-2xl shadow-blue-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4 group-hover:text-white transition-colors duration-500">
              <FaPlus className="text-xs" />
              <span>Initialize Node</span>
            </div>
          </motion.button>
        </div>

        {/* Assignments Logic */}
        {assignments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-32 rounded-[4rem] bg-[#0A0A0A] border border-white/5 text-center flex flex-col items-center gap-10 overflow-hidden relative"
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/[0.02] blur-3xl rounded-full" />
            <div className="relative">
              <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center animate-pulse">
                <FaFileAlt className="text-white/10" size={32} />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black uppercase tracking-widest text-white/80">No challenges defined</h3>
              <p className="text-white/20 text-[11px] font-medium tracking-widest max-w-sm mx-auto leading-loose uppercase">
                Initialize your first assignment node to stimulate student intelligence.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/create-assignment/${courseId}`)}
              className="px-12 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-500"
            >
              Initiate Program
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-4 px-8 opacity-40">
              <div className="h-px w-8 bg-white" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Active Protocols</span>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <AnimatePresence>
                {assignments.map((assignment, index) => (
                  <motion.div 
                    key={assignment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ scale: 1.01 }}
                    className="group relative bg-[#0A0A0A] border border-white/5 rounded-[4rem] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 hover:border-white/10 transition-all duration-700 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 p-12 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <span className="text-white/[0.02] text-9xl font-black italic">0{index + 1}</span>
                    </div>

                    {/* Visual Anchor */}
                    <div className="shrink-0 relative">
                      <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-center group-hover:border-blue-500/30 group-hover:bg-blue-500/[0.05] transition-all duration-700 rotate-12 group-hover:rotate-0">
                        <FaFileAlt className="text-white/20 group-hover:text-blue-400 transition-all duration-700" size={32} />
                      </div>
                      {new Date(assignment.dueDate) < new Date() && (
                        <div className="absolute -top-3 -right-3 p-3 bg-red-500 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.4)]" title="Protocol Expired">
                          <FaExclamationCircle className="text-white" size={12} />
                        </div>
                      )}
                    </div>

                    {/* Node Data */}
                    <div className="flex-1 space-y-6 text-center lg:text-left relative z-10">
                      <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6">
                        <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/40 transition-all duration-700">
                          {assignment.title}
                        </h3>
                        <div className={`px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-700 ${
                          new Date(assignment.dueDate) < new Date() 
                          ? "bg-red-500/10 text-red-400 border-red-500/20 group-hover:bg-red-500/20" 
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-500/20"
                        }`}>
                          {new Date(assignment.dueDate) < new Date() ? 'Archived' : 'In Service'}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap justify-center lg:justify-start gap-12 items-center">
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Temporal Cutoff</p>
                          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-white/60">
                            <FaCalendarAlt className="text-blue-500/40" />
                            <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Magnitude</p>
                          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-white/60">
                            <FaStar className="text-amber-500/40" />
                            <span>{assignment.maxPoints} PTS</span>
                          </div>
                        </div>

                        <div className="h-10 w-px bg-white/5 hidden lg:block" />

                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Engagement Level</p>
                          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-purple-400/80">
                            <FaUsers className="text-purple-500/40" />
                            <span>{assignment.submissionCount || 0} SUBMISSIONS</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Audit Status</p>
                          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-emerald-400/80">
                            <FaCheckCircle className="text-emerald-500/40" />
                            <span>{assignment.gradedCount || 0} PROCESSED</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4 relative z-10">
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/grade-assignment/${assignment._id}`)}
                        className="px-10 py-5 bg-white/[0.02] border border-white/10 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 shadow-xl"
                      >
                        Performance Audit
                      </motion.button>
                      
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/create-assignment/${courseId}?edit=${assignment._id}`)}
                          className="w-14 h-14 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-2xl text-white/20 hover:text-white transition-all duration-500"
                        >
                          <FaEdit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(239,68,68,0.1)" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteModal({ show: true, assignmentId: assignment._id, assignmentTitle: assignment.title })}
                          className="w-14 h-14 flex items-center justify-center bg-red-500/[0.02] border border-red-500/10 rounded-2xl text-red-500/40 hover:text-red-500 transition-all duration-500"
                        >
                          <FaTrash size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ show: false, assignmentId: null, assignmentTitle: '' })}
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 p-12 md:p-16 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,1)] space-y-12 text-center"
            >
              <div className="space-y-6">
                <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                  <FaTrash size={32} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-black uppercase tracking-tighter italic">Confirm Erasure</h3>
                  <p className="text-white/30 text-[11px] font-medium tracking-[0.1em] leading-relaxed uppercase">
                    You are about to permanently decommission <span className="text-white font-black italic">"{deleteModal.assignmentTitle}"</span>. All associated intelligence vectors and metadata will be permanently lost.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteModal({ show: false, assignmentId: null, assignmentTitle: '' })}
                  className="flex-1 py-6 bg-white/[0.02] border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all duration-500"
                >
                  Abort
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.assignmentId)}
                  className="flex-[2] py-6 bg-red-500 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all duration-500 shadow-2xl shadow-red-500/20"
                >
                  Decommission Node
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default ManageAssignments;

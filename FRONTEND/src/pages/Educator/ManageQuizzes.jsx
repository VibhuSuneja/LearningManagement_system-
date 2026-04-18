import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaClock, FaTrophy, FaEdit, FaTrash, FaPlus, FaUsers, FaRobot } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../../component/Nav';
import Footer from '../../component/Footer';

function ManageQuizzes() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, quizId: null, quizTitle: '' });

  useEffect(() => {
    fetchQuizzes();
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

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/quiz/course/${courseId}`,
        { withCredentials: true }
      );
      setQuizzes(response.data.quizzes || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch quizzes');
      setLoading(false);
    }
  };

  const handleDelete = async (quizId) => {
    try {
      await axios.delete(`${serverUrl}/api/quiz/${quizId}`, {
        withCredentials: true
      });
      toast.success('Quiz deleted successfully');
      setDeleteModal({ show: false, quizId: null, quizTitle: '' });
      fetchQuizzes();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete quiz');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <ClipLoader color="white" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <Nav />
      
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/[0.02] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/[0.02] blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-40 pb-24 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="space-y-6">
            <button 
              onClick={() => navigate('/courses')}
              className="flex items-center gap-3 text-white/30 hover:text-white transition-all group"
            >
              <FaArrowLeftLong className="group-hover:-translate-x-2 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Archive</span>
            </button>
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">{courseName || "Assessment Hub"}</h2>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Manage Quizzes</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/create-quiz/${courseId}`, { state: { autoOpenAI: true } })}
              className="px-8 py-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-purple-400 flex items-center gap-3 hover:bg-purple-500 hover:text-white transition-all"
            >
              <FaRobot className="opacity-50" />
              AI Synthesis
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/create-quiz/${courseId}`)}
              className="px-8 py-4 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-gray-200 transition-all shadow-xl"
            >
              <FaPlus />
              Initialize Quiz
            </motion.button>
          </div>
        </div>

        {/* List Section */}
        {quizzes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[40px] p-20 text-center space-y-8"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <FaTrophy className="text-white/20 text-3xl" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-widest">No assessments detected</h3>
              <p className="text-white/30 text-xs tracking-wide">Begin by defining your first assessment node for this track.</p>
            </div>
            <button
              onClick={() => navigate(`/create-quiz/${courseId}`)}
              className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all"
            >
              Start Configuration
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {quizzes.map((quiz, index) => (
                <motion.div 
                  key={quiz._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.04)" }}
                  className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[32px] p-8 flex flex-col lg:flex-row items-center gap-10 group transition-all"
                >
                  {/* Status Indicator */}
                  <div className="shrink-0">
                    <div className="w-16 h-16 bg-white/5 rounded-[22px] flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-all">
                      <FaTrophy className="text-white/20 group-hover:text-white transition-colors" size={24} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-4 text-center lg:text-left">
                    <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-white transition-colors">
                      {quiz.title}
                    </h3>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30">
                        <FaClock className="text-blue-500/50" />
                        <span>{quiz.duration} MIN</span>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30">
                        <FaTrophy className="text-amber-500/50" />
                        <span>{quiz.passingScore}% SYNC</span>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30 text-white/30 border-l border-white/10 pl-6">
                        <span className="text-white/60">{quiz.questions?.length || 0}</span> NODES
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30">
                        <FaUsers className="text-green-500/50" />
                        <span>{quiz.studentAttempts?.length || 0} ENGAGEMENTS</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/take-quiz/${quiz._id}`)}
                      className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
                    >
                      Preview
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteModal({ show: true, quizId: quiz._id, quizTitle: quiz.title })}
                      className="w-12 h-12 flex items-center justify-center bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <FaTrash size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ show: false, quizId: null, quizTitle: '' })}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white/[0.02] border border-white/10 p-10 rounded-[48px] shadow-2xl space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto text-red-500">
                  <FaTrash size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Purge Node?</h3>
                  <p className="text-white/30 text-xs leading-relaxed">
                    Confirm complete data erasure for <span className="text-white font-bold">"{deleteModal.quizTitle}"</span>. This protocol is irreversible.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setDeleteModal({ show: false, quizId: null, quizTitle: '' })}
                  className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] hover:bg-white/10 transition-all"
                >
                  Abort
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.quizId)}
                  className="flex-1 py-5 bg-red-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                >
                  Confirm Purge
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

export default ManageQuizzes;


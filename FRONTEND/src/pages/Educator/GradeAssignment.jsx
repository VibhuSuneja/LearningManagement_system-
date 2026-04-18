import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaGraduationCap, FaRobot, FaCheckCircle, FaExclamationCircle, FaUser, FaFileAlt, FaLink, FaCalendarAlt, FaArrowLeft, FaMagic, FaCheck, FaTimes } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../../component/Nav';
import Footer from '../../component/Footer';

function GradeAssignment() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [submissions, setSubmissions] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/assignment/${assignmentId}/submissions`, {
        withCredentials: true
      });
      setSubmissions(response.data.submissions);
      setAssignmentTitle(response.data.assignmentTitle);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch submissions");
      setLoading(false);
    }
  };

  const selectSubmission = (sub) => {
    setSelectedSubmission(sub);
    setGrade(sub.grade || '');
    setFeedback(sub.feedback || '');
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!grade) return toast.warning("Please provide a grade");
    
    setSubmittingGrade(true);
    try {
      await axios.post(`${serverUrl}/api/assignment/submission/${selectedSubmission._id}/grade`, {
        grade,
        feedback
      }, { withCredentials: true });
      
      toast.success("Submission graded successfully!");
      fetchSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit grade");
    } finally {
      setSubmittingGrade(false);
    }
  };

  const generateAIGrade = async () => {
    if (!selectedSubmission) return;
    setGeneratingAI(true);
    try {
      const response = await axios.post(`${serverUrl}/api/ai-features/grade-submission/${selectedSubmission._id}`, {}, {
        withCredentials: true
      });
      
      toast.success("AI feedback generated!");
      setGrade(response.data.suggestedGrade);
      
      fetchSubmissions().then(() => {
          const updated = submissions.find(s => s._id === selectedSubmission._id);
          if (updated) setSelectedSubmission(updated);
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "AI grading failed");
    } finally {
      setGeneratingAI(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-black flex justify-center items-center'>
        <div className="relative">
          <div className="w-20 h-20 border-2 border-white/5 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ClipLoader size={30} color='#fff' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans'>
      <Nav />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/[0.03] blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[30%] w-[40%] h-[40%] bg-emerald-500/[0.02] blur-[120px] rounded-full" />
      </div>

      <main className='relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-24'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20'>
          <div className='space-y-8'>
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center gap-4 text-white/40 hover:text-white transition-all duration-300"
            >
              <div className="p-3 rounded-full border border-white/5 bg-white/[0.02] group-hover:bg-white/[0.05] group-hover:border-white/10 transition-all duration-300">
                <FaArrowLeft className="text-xs" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Management</span>
            </button>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='space-y-4'
            >
              <div className="flex items-center gap-4 text-emerald-400">
                <div className="h-[1px] w-12 bg-emerald-500/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Audit</span>
              </div>
              <h1 className='text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]'>
                Student<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40 italic">Performance</span>
              </h1>
              <p className='text-white/30 text-[11px] font-bold tracking-[0.3em] uppercase'>{assignmentTitle}</p>
            </motion.div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="px-8 py-5 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Submissions</p>
              <p className="text-xl font-black italic tracking-tighter">{submissions.length}</p>
            </div>
            <div className="px-8 py-5 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Graded</p>
              <p className="text-xl font-black italic tracking-tighter text-emerald-400">
                {submissions.filter(s => s.status === 'graded').length}
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start'>
          {/* Submissions List */}
          <div className='lg:col-span-4 space-y-6'>
            <div className="flex items-center justify-between px-4">
              <h3 className='text-[10px] font-black text-white/30 uppercase tracking-[0.5em]'>
                Engagement List
              </h3>
            </div>
            
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {submissions.length === 0 ? (
                <div className='bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-16 text-center space-y-6'>
                  <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                    <FaExclamationCircle className='text-white/10 text-2xl' />
                  </div>
                  <p className='text-white/20 text-[10px] font-black uppercase tracking-widest'>Zero signal detection</p>
                </div>
              ) : (
                submissions.map((sub, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={sub._id}
                    onClick={() => selectSubmission(sub)}
                    className={`group p-6 rounded-[2rem] cursor-pointer transition-all duration-500 border relative overflow-hidden ${
                      selectedSubmission?._id === sub._id 
                        ? 'bg-white border-white scale-[1.02] shadow-[0_20px_50px_rgba(255,255,255,0.1)]' 
                        : 'bg-[#0A0A0A] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className='flex items-center gap-5 relative z-10'>
                      <div className="relative">
                        <img 
                          src={sub.student?.photoUrl || 'https://via.placeholder.com/50'} 
                          className={`w-14 h-14 rounded-2xl object-cover border-2 ${
                            selectedSubmission?._id === sub._id ? 'border-black/5' : 'border-white/5'
                          }`} 
                        />
                        {sub.status === 'graded' && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center border-2 border-black">
                            <FaCheck className="text-white text-[10px]" />
                          </div>
                        )}
                      </div>
                      <div className='flex-1 overflow-hidden'>
                        <p className={`text-sm font-black uppercase tracking-tight truncate ${
                          selectedSubmission?._id === sub._id ? 'text-black' : 'text-white/90'
                        }`}>
                          {sub.student?.name}
                        </p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                          selectedSubmission?._id === sub._id ? 'text-black/40' : 'text-white/30'
                        }`}>
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {sub.grade && (
                        <div className={`text-xl font-black italic tracking-tighter ${
                          selectedSubmission?._id === sub._id ? 'text-black' : 'text-emerald-400'
                        }`}>
                          {sub.grade}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Grading Area */}
          <div className='lg:col-span-8 flex flex-col gap-8'>
            <AnimatePresence mode="wait">
              {selectedSubmission ? (
                <motion.div 
                  key={selectedSubmission._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='space-y-8'
                >
                  {/* Submission Context Card */}
                  <div className='bg-[#0A0A0A] p-10 md:p-14 rounded-[4rem] border border-white/5 relative overflow-hidden'>
                    <div className="absolute top-0 right-0 p-10 opacity-30">
                      <FaGraduationCap size={120} className="text-white/[0.02]" />
                    </div>

                    <div className='flex flex-col md:flex-row justify-between items-start gap-8 mb-16 relative z-10'>
                      <div className='flex items-center gap-6'>
                        <img src={selectedSubmission.student?.photoUrl} className='w-20 h-20 rounded-[2rem] border border-white/10 shadow-2xl' />
                        <div className="space-y-1">
                          <h3 className='text-3xl font-black italic tracking-tighter uppercase'>{selectedSubmission.student?.name}</h3>
                          <p className='text-[10px] text-white/30 font-black uppercase tracking-[0.4em]'>{selectedSubmission.student?.email}</p>
                        </div>
                      </div>
                      <div className={`px-6 py-2 rounded-full border text-[9px] font-black uppercase tracking-[0.4em] ${
                         selectedSubmission.status === 'graded' 
                         ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                         : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                       }`}>
                         {selectedSubmission.status} Protocol
                      </div>
                    </div>

                    <div className='space-y-12 relative z-10'>
                      {/* Text Body */}
                      {selectedSubmission.submissionText && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 opacity-30">
                            <div className="h-px w-8 bg-white" />
                            <h4 className='text-[9px] font-black uppercase tracking-[0.5em]'>Output Log</h4>
                          </div>
                          <div className='bg-white/[0.02] p-8 md:p-10 rounded-[3rem] text-white/70 leading-[1.8] text-[15px] font-medium whitespace-pre-wrap border border-white/5'>
                            {selectedSubmission.submissionText}
                          </div>
                        </div>
                      )}

                      {/* Assets Section */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                          {selectedSubmission.githubLink && (
                            <div className="space-y-4">
                              <h4 className='text-[9px] font-black text-white/20 uppercase tracking-[0.5em] pl-4'>External Link</h4>
                              <motion.a 
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                                href={selectedSubmission.githubLink} 
                                target="_blank" 
                                className='flex items-center justify-between p-6 bg-blue-500/5 text-blue-400 border border-blue-500/20 rounded-3xl group'
                              >
                                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                                  <FaLink className="group-hover:rotate-45 transition-transform" /> 
                                  <span>View Deployment</span>
                                </div>
                                <div className="p-2 bg-blue-400/20 rounded-xl">
                                  <FaArrowLeft className="rotate-180 text-[10px]" />
                                </div>
                              </motion.a>
                            </div>
                          )}
                          {selectedSubmission.files?.length > 0 && (
                            <div className="space-y-4">
                              <h4 className='text-[9px] font-black text-white/20 uppercase tracking-[0.5em] pl-4'>Payload Subsystem</h4>
                              <div className='grid grid-cols-1 gap-3'>
                                {selectedSubmission.files.map((file, idx) => {
                                  let downloadUrl = file.fileUrl;
                                  if (downloadUrl.includes('cloudinary.com') && downloadUrl.toLowerCase().endsWith('.pdf') && !downloadUrl.includes('fl_attachment')) {
                                    downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
                                  }
                                  return (
                                    <motion.a 
                                      whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
                                      key={idx} 
                                      href={downloadUrl} 
                                      target="_blank" 
                                      download={file.fileName} 
                                      className='flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-white/20 transition-all'
                                    >
                                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                                        <FaFileAlt className='text-white/20' />
                                      </div>
                                      <span className="truncate flex-1">{file.fileName}</span>
                                    </motion.a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* AI & Grading Integration */}
                  <div className='bg-[#0A0A0A] p-10 md:p-14 rounded-[4rem] border border-white/5 relative overflow-hidden'>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/[0.03] blur-[150px] rounded-full" />
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black rotate-3">
                          <FaGraduationCap size={20} />
                        </div>
                        <h3 className='text-3xl font-black italic tracking-tighter uppercase'>Audit Panel</h3>
                      </div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={generateAIGrade}
                        disabled={generatingAI}
                        className='group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all duration-500 shadow-2xl shadow-purple-500/20 disabled:opacity-50'
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10 flex items-center gap-3">
                          {generatingAI ? (
                            <>
                              <ClipLoader size={12} color='#fff' />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <FaRobot /> 
                              <span>Initialize AI Review</span>
                            </>
                          )}
                        </span>
                      </motion.button>
                    </div>

                    <div className="space-y-10 relative z-10">
                      {/* AI Feedback Display */}
                      <AnimatePresence>
                        {selectedSubmission.aiGeneratedFeedback && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className='bg-purple-500/[0.02] p-10 rounded-[3rem] border border-purple-500/10'
                            >
                               <div className="flex items-center gap-3 mb-6">
                                 <FaMagic className="text-purple-400 text-sm" />
                                 <h4 className='text-[9px] font-black text-purple-400 uppercase tracking-[0.5em]'>Synthesized Intelligence</h4>
                               </div>
                               <p className='text-[15px] text-white/60 leading-relaxed whitespace-pre-wrap font-medium'>{selectedSubmission.aiGeneratedFeedback}</p>
                               <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-3 opacity-30">
                                 <FaExclamationCircle size={10} />
                                 <p className='text-[8px] font-black uppercase tracking-widest'>Validation required by authorized instructor</p>
                               </div>
                            </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Manual Input Form */}
                      <form onSubmit={handleGradeSubmit} className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                        <div className='md:col-span-1 space-y-4'>
                          <label className='block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] px-4'>Score Magnitude</label>
                          <div className="relative group">
                            <input
                              type="number"
                              value={grade}
                              onChange={(e) => setGrade(e.target.value)}
                              placeholder="00"
                              className='w-full px-8 py-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 focus:border-white/20 outline-none font-black text-5xl text-center group-hover:bg-white/[0.04] transition-all'
                            />
                            <div className="absolute top-1/2 -translate-y-1/2 right-6 text-[10px] font-black text-white/10 rotate-90 tracking-tighter uppercase whitespace-nowrap">Points</div>
                          </div>
                        </div>
                        
                        <div className='md:col-span-3 space-y-4 flex flex-col'>
                          <label className='block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] px-4'>Direct Transmission (Feedback)</label>
                          <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Constructive critique for the student..."
                            className='flex-1 w-full px-10 py-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 focus:border-white/20 outline-none font-medium text-[15px] resize-none hover:bg-white/[0.04] transition-all min-h-[180px]'
                          />
                        </div>

                        <div className='md:col-span-4 flex justify-end items-center gap-8 pt-6'>
                          <button 
                            type="button"
                            onClick={() => setSelectedSubmission(null)}
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
                          >
                            Reset Focus
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={submittingGrade}
                            className='bg-white text-black px-12 py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all'
                          >
                            {submittingGrade ? <ClipLoader size={12} color='#000' /> : <><FaCheck /> Authorize Grade</>}
                          </motion.button>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='h-[800px] bg-[#0A0A0A] rounded-[4rem] border border-white/5 flex flex-col items-center justify-center text-center p-20 relative overflow-hidden group'
                >
                  <div className="absolute inset-0 bg-blue-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className='w-32 h-32 bg-white/[0.02] rounded-[3rem] border border-white/5 flex items-center justify-center mb-10 group-hover:border-white/20 transition-all duration-700'
                  >
                    <FaUser className='text-white/10 group-hover:text-white/40 transition-all duration-700' size={40} />
                  </motion.div>
                  <div className="space-y-4 max-w-sm relative z-10">
                    <h3 className='text-2xl font-black italic tracking-tighter uppercase'>Awaiting Subject Selection</h3>
                    <p className='text-white/20 text-[11px] font-medium tracking-widest leading-loose uppercase'>
                      Identify a specific student submission from the grid to initiate performance auditing and grade authorization.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default GradeAssignment;


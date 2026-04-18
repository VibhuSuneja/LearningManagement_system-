import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaFileUpload, FaRegPaperPlane, FaClock, FaCheckCircle, FaUndo, FaLink, FaFileAlt, FaStar, FaInfoCircle, FaRobot } from 'react-icons/fa';
import { FaArrowLeftLong, FaArrowRight } from 'react-icons/fa6';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../component/Nav';
import Footer from '../component/Footer';

function SubmitAssignment() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    submissionText: '',
    githubLink: ''
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/assignment/${assignmentId}`, {
        withCredentials: true
      });
      setAssignment(response.data.assignment);
      setHasSubmitted(response.data.hasSubmitted);
      setSubmission(response.data.submission);
      if (response.data.hasSubmitted && response.data.submission) {
        setFormData({
          submissionText: response.data.submission.submissionText || '',
          githubLink: response.data.submission.githubLink || ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch assignment details");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.submissionText && files.length === 0) {
      return toast.warning("Please provide a text response or upload a file");
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('submissionText', formData.submissionText);
      data.append('githubLink', formData.githubLink);
      
      files.forEach(file => {
        data.append('files', file);
      });

      await axios.post(`${serverUrl}/api/assignment/${assignmentId}/submit`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      toast.success("Assignment submitted successfully! 🚀");
      fetchAssignment(); // Refresh state
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-black flex justify-center items-center'>
        <ClipLoader size={50} color='#fff' />
      </div>
    );
  }

  const isPastDue = new Date(assignment?.dueDate) < new Date();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black'
    >
      <Nav />
      
      <main className='pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto'>
        {/* Back Button & Header */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
        >
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-white hover:text-black transition-all active:scale-90 group"
            >
              <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] block mb-2">Assignment Portal</span>
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">{assignment?.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Global Deadline</span>
                <span className="text-sm font-black text-white uppercase">{new Date(assignment?.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
             </div>
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPastDue && !hasSubmitted ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                <FaClock size={18} />
             </div>
          </div>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Main Content Area */}
          <div className='lg:col-span-8 space-y-8'>
            
            {/* Project Brief Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className='bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden group'
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-1000"></div>
              
              <div className="relative z-10">
                <div className='flex items-center gap-4 mb-8'>
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                      <FaFileAlt size={20} />
                   </div>
                   <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Project Briefing</h3>
                </div>

                <div className='prose prose-invert max-w-none mb-10'>
                  <p className='text-lg md:text-xl text-white/80 font-medium leading-relaxed'>{assignment?.description}</p>
                </div>

                {assignment?.instructions && (
                  <div className='bg-white/5 p-8 rounded-[30px] border border-white/5 relative overflow-hidden'>
                    <div className="absolute top-4 right-6 text-white/5">
                      <FaInfoCircle size={40} />
                    </div>
                    <h4 className='text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4'>Detailed Instructions</h4>
                    <p className='text-sm text-white/60 leading-relaxed font-medium whitespace-pre-wrap'>{assignment?.instructions}</p>
                  </div>
                )}

                {/* Resource Files */}
                {assignment?.attachments?.length > 0 && (
                  <div className='mt-12 space-y-6'>
                    <h4 className='text-[10px] font-black text-white/40 uppercase tracking-[0.5em]'>Standard Assets</h4>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      {assignment.attachments.map((file, idx) => {
                        let downloadUrl = file.fileUrl;
                        if (downloadUrl.includes('cloudinary.com') && downloadUrl.toLowerCase().endsWith('.pdf') && !downloadUrl.includes('fl_attachment')) {
                          downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
                        }

                        return (
                          <motion.a 
                            key={idx} 
                            href={downloadUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            download={file.fileName}
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                            className='flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl transition-all group'
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                                <FaFileAlt />
                              </div>
                              <span className='text-xs font-bold text-white/70 group-hover:text-white truncate max-w-[150px]'>{file.fileName}</span>
                            </div>
                            <FaArrowRight size={12} className="text-white/20 group-hover:text-white transition-all group-hover:translate-x-1" />
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Grading Report Area (Visible if Graded) */}
            <AnimatePresence>
              {hasSubmitted && submission?.status === 'graded' && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className='bg-emerald-500/5 backdrop-blur-3xl border border-emerald-500/20 rounded-[40px] p-8 md:p-12 relative overflow-hidden'
                >
                  <div className="absolute top-0 right-0 p-10 text-emerald-500/10">
                    <FaCheckCircle size={100} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10'>
                      <div className='flex items-center gap-6'>
                        <div className="w-16 h-16 rounded-[24px] bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                          <FaStar size={28} />
                        </div>
                        <div>
                          <h3 className='text-2xl font-black text-white uppercase tracking-tighter'>Performance Report</h3>
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Status: Verified & Graded</p>
                        </div>
                      </div>
                      <div className='text-center bg-white/5 px-10 py-6 rounded-[30px] border border-white/5 backdrop-blur-xl'>
                        <p className='text-[10px] font-black uppercase text-white/40 tracking-[0.4em] mb-2'>Audit Score</p>
                        <p className='text-4xl font-black text-white tracking-tighter'>{submission.grade} <span className="text-white/20 text-xl">/ {assignment.maxPoints}</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {submission.feedback && (
                        <div className='bg-black/40 p-8 rounded-[30px] border border-white/5'>
                          <h4 className='text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4'>Instructor Notes</h4>
                          <p className='text-sm text-white/80 italic font-medium leading-relaxed whitespace-pre-wrap'>"{submission.feedback}"</p>
                        </div>
                      )}
                      
                      {submission.aiGeneratedFeedback && (
                          <div className='bg-blue-500/5 p-8 rounded-[30px] border border-blue-500/20 group relative overflow-hidden'>
                               <div className="absolute top-4 right-6 text-blue-500/20">
                                  <FaRobot size={24} />
                               </div>
                               <h4 className='text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4'>AI Synthesis</h4>
                               <p className='text-sm text-blue-100/70 font-medium leading-relaxed whitespace-pre-wrap'>{submission.aiGeneratedFeedback}</p>
                          </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submission Terminal Section */}
            {!hasSubmitted || submission?.status !== 'graded' ? (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-12'
              >
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl">
                       <FaFileUpload size={20} />
                    </div>
                    <div>
                       <h3 className='text-xl font-black text-white uppercase tracking-tighter'>
                         {hasSubmitted ? 'Update Repository' : 'Deploy Submission'}
                       </h3>
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">V1.0.4 Secure Protocol</p>
                    </div>
                 </div>

                 <form onSubmit={handleSubmit} className='space-y-10'>
                    <div className='space-y-8'>
                        <div className="space-y-4">
                          <label className='block text-[10px] font-black text-white/40 uppercase tracking-[0.4em]'>Text Response / Documentation</label>
                          <textarea
                            name="submissionText"
                            rows={8}
                            value={formData.submissionText}
                            onChange={handleInputChange}
                            placeholder="Draft your solution narrative here..."
                            className='w-full bg-black/40 border border-white/5 rounded-[30px] p-8 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none transition-all placeholder:text-white/10 resize-none font-medium leading-relaxed'
                          />
                        </div>

                        <div className="space-y-4">
                          <label className='block text-[10px] font-black text-white/40 uppercase tracking-[0.4em]'>Artifact Repository (Optional)</label>
                          <div className='relative group'>
                            <input
                              type="url"
                              name="githubLink"
                              value={formData.githubLink}
                              onChange={handleInputChange}
                              placeholder="https://github.com/project-repository"
                              className='w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none transition-all placeholder:text-white/10'
                            />
                            <FaLink className='absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors' />
                          </div>
                        </div>

                        <div className="space-y-4">
                            <label className='block text-[10px] font-black text-white/40 uppercase tracking-[0.4em]'>File Manifest</label>
                            <div className='border-2 border-dashed border-white/5 rounded-[40px] p-12 text-center hover:bg-white/[0.02] transition-all cursor-pointer relative group'>
                                <input
                                  type="file"
                                  multiple
                                  onChange={(e) => setFiles([...e.target.files])}
                                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                                />
                                <div className="space-y-4">
                                  <div className="w-16 h-16 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-white group-hover:scale-110 transition-all">
                                    <FaFileUpload size={24} />
                                  </div>
                                  <div>
                                    <p className='text-sm font-black text-white uppercase tracking-widest mb-1'>Transfer Files</p>
                                    <p className='text-[10px] font-bold text-white/30 uppercase tracking-widest'>Drag artifacts or click to browse</p>
                                  </div>
                                </div>
                            </div>
                            
                            <AnimatePresence>
                              {files.length > 0 && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className='mt-6 flex flex-wrap gap-3'
                                  >
                                      {files.map((file, i) => (
                                          <div key={i} className='bg-white/5 border border-white/10 text-white/80 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3'>
                                              <FaFileAlt className="text-white/40" /> {file.name}
                                          </div>
                                      ))}
                                  </motion.div>
                              )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01, translateY: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={submitting || (isPastDue && !hasSubmitted)}
                      className='w-full bg-white text-black py-6 rounded-3xl font-black text-xs uppercase tracking-[0.5em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)] disabled:opacity-20 transition-all flex items-center justify-center gap-4'
                    >
                      {submitting ? (
                        <ClipLoader size={20} color='#000' />
                      ) : (
                        <>
                          {hasSubmitted ? <><FaUndo /> Overwrite Entry</> : <><FaRegPaperPlane /> Execute Submission</>}
                        </>
                      )}
                    </motion.button>
                 </form>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 border border-white/10 rounded-[40px] p-12 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/10">
                  <FaCheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Mission Accomplished</h3>
                <p className="text-sm text-white/40 font-medium max-w-sm mx-auto leading-relaxed">Your submission has been finalized and evaluated. You can no longer modify this entry as the grading phase is complete.</p>
              </motion.div>
            )}
          </div>

          {/* Sidebar Metrics */}
          <div className='lg:col-span-4 space-y-6'>
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 space-y-10'
            >
              <div>
                <h4 className='text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-8 text-center'>Pulse Metrics</h4>
                <div className='space-y-8'>
                  <div className='flex justify-between items-end'>
                    <div>
                      <span className='text-[9px] font-black text-white/20 uppercase tracking-widest block mb-2'>Submission Window</span>
                      <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl ${
                        hasSubmitted ? 'bg-emerald-500/10 text-emerald-400' : isPastDue ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {hasSubmitted ? 'Closed' : isPastDue ? 'Expired' : 'Open'}
                      </span>
                    </div>
                    <div className="text-right">
                       <span className='text-[9px] font-black text-white/20 uppercase tracking-widest block mb-2'>Verification</span>
                       <span className="text-xs font-black text-white/70 uppercase tracking-widest">{hasSubmitted ? 'Verified' : 'Uncertain'}</span>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5">
                     <div className='flex items-center gap-4 mb-6'>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                         <FaStar size={16} />
                      </div>
                      <h4 className='text-[10px] font-black text-white uppercase tracking-[0.3em]'>Potential Reward</h4>
                    </div>
                    <div className='flex items-baseline gap-2'>
                       <p className='text-5xl font-black text-white tracking-tighter'>{assignment?.maxPoints}</p>
                       <p className='text-[10px] font-black text-white/20 uppercase tracking-widest'>Credits</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-white/5 p-8 rounded-[30px] border border-white/5 relative overflow-hidden group'>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
                <h4 className='text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 tracking-[0.2em]'>Security Protocol</h4>
                <p className='text-xs text-white/50 font-medium leading-relaxed'>
                  Each submission undergoes a cryptographic verification and an AI-driven integrity check. Multiple versioning is supported before final grading.
                </p>
              </div>
            </motion.div>

            {/* Quick Status Pill */}
             <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white text-black p-8 rounded-[40px] text-center"
            >
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2">Current Milestone</h4>
               <p className="text-lg font-black uppercase tracking-tighter">{hasSubmitted ? 'Awaiting Evaluation' : 'Initial Submission Required'}</p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}

export default SubmitAssignment;


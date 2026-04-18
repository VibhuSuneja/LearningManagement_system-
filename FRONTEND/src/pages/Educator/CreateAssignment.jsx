import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaCloudUploadAlt, FaCalendarAlt, FaStar, FaInfoCircle, FaFileAlt, FaArrowLeft, FaPlus, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../../component/Nav';
import Footer from '../../component/Footer';

function CreateAssignment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get('edit');
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lectureId: '',
    dueDate: '',
    maxPoints: 100,
    instructions: '',
    allowedFileTypes: 'pdf,doc,docx,zip,txt',
    maxFileSize: 10 // MB
  });
  
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchCourseDetails();
    if (editId) {
      fetchAssignmentDetails();
    }
  }, [courseId, editId]);

  const fetchAssignmentDetails = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/assignment/${editId}`, {
        withCredentials: true
      });
      const ass = response.data.assignment;
      setFormData({
        title: ass.title,
        description: ass.description,
        lectureId: ass.lecture?._id || ass.lecture || '',
        dueDate: ass.dueDate ? new Date(ass.dueDate).toISOString().slice(0, 16) : '',
        maxPoints: ass.maxPoints,
        instructions: ass.instructions || '',
        allowedFileTypes: ass.allowedFileTypes?.join(',') || 'pdf,doc,docx,zip,txt',
        maxFileSize: ass.maxFileSize
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch assignment for editing");
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, {
        withCredentials: true
      });
      setCourse(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch course details");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      data.append('courseId', courseId);
      
      files.forEach(file => {
        data.append('attachments', file);
      });

      if (editId) {
        await axios.put(`${serverUrl}/api/assignment/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        toast.success("Assignment updated successfully! 📝");
      } else {
        await axios.post(`${serverUrl}/api/assignment/create`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        toast.success("Assignment created successfully! 📝");
      }
      
      navigate(`/manage-assignments/${courseId}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || `Failed to ${editId ? 'update' : 'create'} assignment`);
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-white/50 font-black tracking-[0.3em] text-[10px] uppercase animate-pulse">
          Initializing Engine...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-purple-500/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[25%] h-[25%] bg-blue-600/[0.02] rounded-full blur-[80px]" />
      </div>

      <Nav />

      <main className="relative pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group mb-12 flex items-center gap-3 text-white/40 hover:text-white transition-colors duration-300"
        >
          <div className="p-2.5 rounded-full border border-white/5 bg-white/[0.02] group-hover:bg-white/[0.05] group-hover:border-white/10 transition-all duration-300">
            <FaArrowLeft className="text-xs" />
          </div>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">Back to Management</span>
        </motion.button>

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="h-[1px] w-12 bg-blue-500/50" />
            <span className="text-blue-400 text-[10px] font-black tracking-[0.5em] uppercase">
              {editId ? "Modification Protocol" : "Initialization Sequence"}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 italic">
            {editId ? "EDIT" : "CREATE"}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
              ASSIGNMENT
            </span>
          </h1>
          <p className="text-white/40 max-w-xl text-lg font-medium leading-relaxed">
            Configure parameters for <span className="text-white/80 font-bold border-b border-white/10 italic">"{course?.title}"</span> project delivery.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* Core Parameters */}
            <motion.section 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group p-8 md:p-12 rounded-[2rem] bg-[#0A0A0A] border border-white/5 relative overflow-hidden transition-all duration-500 hover:border-white/10"
            >
              <div className="absolute top-0 right-0 p-8">
                <FaFileAlt className="text-white/[0.02] text-8xl rotate-12" />
              </div>

              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/50">Primary Attributes</h3>
                </div>

                <div className="space-y-6">
                  {/* Title Input */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 ml-2">Assignment Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter a descriptive title..."
                      className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all duration-300 font-medium"
                    />
                  </div>

                  {/* Description Textarea */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 ml-2">Context & Objectives</label>
                    <textarea
                      name="description"
                      required
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Briefly explain the goal of this assignment..."
                      className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all duration-300 font-medium resize-none"
                    />
                  </div>

                  {/* Instructions Textarea */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 ml-2">Technical Instructions</label>
                    <textarea
                      name="instructions"
                      rows={4}
                      value={formData.instructions}
                      onChange={handleInputChange}
                      placeholder="Detailed steps, formatting rules, or resources..."
                      className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all duration-300 font-medium resize-none"
                    />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Asset Integration */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 rounded-[2rem] bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/50">Asset Repository</h3>
              </div>

              <div className="space-y-6">
                <div className="relative group/upload h-48 border-2 border-dashed border-white/5 rounded-[2rem] hover:border-blue-500/30 hover:bg-blue-500/[0.01] transition-all duration-500 cursor-pointer overflow-hidden">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
                    <div className="p-4 rounded-full bg-white/[0.02] border border-white/5 mb-4 group-hover/upload:scale-110 group-hover/upload:border-blue-500/30 transition-all duration-500">
                      <FaCloudUploadAlt className="text-3xl text-white/20 group-hover/upload:text-blue-400 transition-colors duration-500" />
                    </div>
                    <p className="font-bold text-white/40 group-hover/upload:text-white/60 transition-colors uppercase tracking-widest text-xs">
                      Engage Upload Sequence
                    </p>
                    <p className="text-[10px] font-black tracking-widest text-white/20 mt-2 uppercase">
                      Reference Material • Max 50MB
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      {files.map((file, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 group/item hover:border-white/10 transition-all"
                        >
                          <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                            <FaFileAlt className="text-xs" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate text-white/60">{file.name}</p>
                            <p className="text-[8px] font-black tracking-widest text-white/20 uppercase">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="text-white/20 hover:text-red-400 transition-colors"
                          >
                           ✕
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Delivery Constraints */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/5 space-y-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/50">Delivery Constraints</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 ml-1">Deadline Sequence</label>
                  <div className="relative group">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="datetime-local"
                      name="dueDate"
                      required
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-xs text-white/80 focus:outline-none focus:border-blue-500/50 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 ml-1">Magnitude (Points)</label>
                  <div className="relative group">
                    <FaStar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-yellow-500 transition-colors" />
                    <input
                      type="number"
                      name="maxPoints"
                      value={formData.maxPoints}
                      onChange={handleInputChange}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-xs text-white/80 focus:outline-none focus:border-blue-500/50 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 ml-1">Structural Node</label>
                  <select
                    name="lectureId"
                    value={formData.lectureId}
                    onChange={handleInputChange}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-white/80 focus:outline-none focus:border-blue-500/50 transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0A0A0A]">General Assignment</option>
                    {course?.lectures?.map(lec => (
                      <option key={lec._id} value={lec._id} className="bg-[#0A0A0A]">{lec.lectureTitle}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Validation Protocol */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/50">Validation Protocol</h3>
              </div>

              <div className="space-y-5">
                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Accepted Signatures</label>
                  <input
                    type="text"
                    name="allowedFileTypes"
                    value={formData.allowedFileTypes}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-mono text-blue-400 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Quantum Threshold (MB)</label>
                  <input
                    type="number"
                    name="maxFileSize"
                    value={formData.maxFileSize}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white/60 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Submit Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <button
                type="submit"
                disabled={submitting}
                className="w-full relative group overflow-hidden rounded-[1.5rem] bg-white p-[1px] transition-all duration-300 active:scale-95 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 group-hover:opacity-80" />
                <div className="relative h-full w-full bg-black rounded-[1.4rem] py-6 flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-transparent">
                  {submitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white">Transfusing...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-[11px] font-black tracking-[0.5em] uppercase text-white group-hover:scale-110 transition-transform duration-300">
                        {editId ? "SYNC PROTOCOL" : "INITIATE DEPLOY"}
                      </span>
                      <FaPlus className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                    </>
                  )}
                </div>
              </button>
              
              <p className="text-center text-[8px] font-black tracking-widest text-white/20 uppercase mt-4">
                Encryption Enabled • SSL Secure Data Transmission
              </p>
            </motion.div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default CreateAssignment;

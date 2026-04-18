import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { FaArrowLeftLong, FaCheck } from "react-icons/fa6";
import { FaEdit, FaTrash, FaCloudUploadAlt, FaRocket } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import img from "../../assets/empty.jpg";
import { serverUrl } from '../../App';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../../component/Nav';
import Footer from '../../component/Footer';

function EditCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const thumb = useRef();
  const [isPublished, setIsPublished] = useState(false);
  const [selectCourse, setSelectCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState(img);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const getCourseById = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, { withCredentials: true });
      setSelectCourse(result.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch course details");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    getCourseById();
  }, [courseId]);

  useEffect(() => {
    if (selectCourse) {
      setTitle(selectCourse.title || "");
      setSubtitle(selectCourse.subtitle || "");
      setDescription(selectCourse.description || "");
      setCategory(selectCourse.category || "");
      setLevel(selectCourse.level || "");
      setPrice(selectCourse.price || "");
      setFrontendImage(selectCourse.thumbnail?.url || img);
      setIsPublished(selectCourse.isPublished || false);
    }
  }, [selectCourse]);

  const handleEditCourse = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subtitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", price);
    if (backendImage) {
      formData.append("thumbnail", backendImage);
    }
    formData.append("isPublished", isPublished);

    try {
      await axios.post(
        `${serverUrl}/api/course/editcourse/${courseId}`,
        formData,
        { withCredentials: true }
      );
      toast.success("Node Configuration Updated");
      navigate("/courses");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = async () => {
    if (!window.confirm("Are you sure you want to decommission this track? All data will be lost.")) return;
    
    setLoadingRemove(true);
    try {
      await axios.delete(serverUrl+`/api/course/removecourse/${courseId}`, { withCredentials: true });
      toast.success("Track Decommissioned Successfully");
      navigate("/courses");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Removal failed");
    } finally {
      setLoadingRemove(false);
    }
  };

  if (initialLoading) return (
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

      <div className="max-w-5xl mx-auto px-6 pt-40 pb-24 relative z-10">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
          <div className="space-y-4">
            <button 
              onClick={() => navigate("/courses")}
              className="flex items-center gap-3 text-white/30 hover:text-white transition-all group"
            >
              <FaArrowLeftLong className="group-hover:-translate-x-2 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Hub</span>
            </button>
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Configuration Mode</h2>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Edit Track</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/createlecture/${courseId}`)}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-white hover:text-black transition-all"
            >
              <FaRocket className="opacity-50" />
              Modify Lectures
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRemoveCourse}
              disabled={loadingRemove}
              className="px-8 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-red-500 flex items-center gap-3 hover:bg-red-500 hover:text-white transition-all disabled:opacity-20"
            >
              <FaTrash className="opacity-50" />
              {loadingRemove ? "..." : "Decommission"}
            </motion.button>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-10"
          >
            {/* Status Card */}
            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">System Status</p>
                <h3 className="text-lg font-black uppercase tracking-tighter">
                  {isPublished ? "Live Node" : "Internal Sync Only"}
                </h3>
              </div>
              <button 
                onClick={() => setIsPublished(!isPublished)}
                className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] transition-all border ${
                  isPublished 
                  ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white" 
                  : "bg-blue-500/10 border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white"
                }`}
              >
                {isPublished ? "Deactivate" : "Deploy Live"}
              </button>
            </div>

            {/* General Info Form */}
            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 md:p-14 space-y-10">
              <div className="space-y-2 mb-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Core Definition</h2>
                <div className="h-px w-20 bg-white/10" />
              </div>

              <div className="space-y-8">
                {/* Title */}
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Display Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none focus:ring-1 focus:ring-white/10 transition-all font-medium placeholder:text-white/5"
                    placeholder="Enter node title"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Tagline Reference</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none focus:ring-1 focus:ring-white/10 transition-all font-medium placeholder:text-white/5"
                    placeholder="Brief objective"
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Technical Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-[32px] px-8 py-6 text-white focus:outline-none focus:ring-1 focus:ring-white/10 transition-all font-medium placeholder:text-white/5 h-48 resize-none"
                    placeholder="Define the scope of this information nexus..."
                  />
                </div>

                {/* Domain & Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Niche Sector</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none focus:ring-1 focus:ring-white/10 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-black">Select Sector</option>
                      <option value="Web Development" className="bg-black">Web Development</option>
                      <option value="App Development" className="bg-black">App Development</option>
                      <option value="AI/ML" className="bg-black">AI/ML</option>
                      <option value="AI Tools" className="bg-black">AI Tools</option>
                      <option value="Data Science" className="bg-black">Data Science</option>
                      <option value="Ethical Hacking" className="bg-black">Ethical Hacking</option>
                      <option value="UI UX Designing" className="bg-black">UI UX Designing</option>
                      <option value="Others" className="bg-black">Others</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Complexity Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none focus:ring-1 focus:ring-white/10 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-black">Select Scale</option>
                      <option value="Beginner" className="bg-black">Primary (Beginner)</option>
                      <option value="Intermediate" className="bg-black">Moderate (Intermediate)</option>
                      <option value="Advanced" className="bg-black">Complex (Advanced)</option>
                    </select>
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Asset Valuation (INR)</label>
                    <div className="relative">
                      <span className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 font-black">₹</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-8 py-5 text-white focus:outline-none focus:ring-1 focus:ring-white/10 transition-all font-medium placeholder:text-white/5"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Asset Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            {/* Visual Identification */}
            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 space-y-8">
              <div className="space-y-2">
                <h2 className="text-xl font-black uppercase tracking-tighter">Visual Identity</h2>
                <div className="h-px w-10 bg-white/10" />
              </div>

              <div 
                onClick={() => thumb.current.click()}
                className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 group cursor-pointer bg-white/5"
              >
                <img 
                  src={frontendImage} 
                  alt="Track Preview" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                    <FaCloudUploadAlt size={24} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Update Asset</span>
                </div>
                <input type="file" hidden ref={thumb} accept='image/*' onChange={handleThumbnail} />
              </div>

              <div className="flex gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 items-center">
                <div className="p-3 bg-white/5 rounded-xl text-white/30">
                  <FaEdit size={14} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Manual Override</h4>
                  <p className="text-[11px] font-medium text-white/60">Click image to upload new schema.</p>
                </div>
              </div>
            </div>

            {/* Persistence Controls */}
            <div className="space-y-6">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEditCourse}
                disabled={loading}
                className="w-full py-6 bg-white text-black rounded-[28px] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <ClipLoader size={18} color="black" /> : (
                  <>
                    Commit Changes
                    <FaCheck size={12} />
                  </>
                )}
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/courses")}
                className="w-full py-6 bg-transparent border border-white/10 rounded-[28px] font-black uppercase tracking-[0.4em] text-[10px] text-white/40 hover:text-white transition-all"
              >
                Abort Protocol
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EditCourse;
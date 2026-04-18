import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import Nav from "../../component/Nav";
import Footer from "../../component/Footer";

function CreateCourses() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateCourse = async () => {
    if (!title || !category) {
      toast.error("Please enter both title and category");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/course/create",
        { title, category },
        { withCredentials: true }
      );
      toast.success("Course Initialized Successfully");
      navigate("/courses");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Initialization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <Nav />

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20 relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-16 relative overflow-hidden"
        >
          {/* Back Button */}
          <button 
            onClick={() => navigate("/courses")}
            className="absolute top-8 left-8 p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
          >
            <FaArrowLeftLong />
          </button>

          <div className="text-center space-y-4 mb-12">
            <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Genesis Protocol</h2>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Initialize Track</h1>
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
              Define the core parameters of your new educational node.
            </p>
          </div>

          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateCourse();
            }}
          >
            {/* Title */}
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Module Title</label>
              <input
                type="text"
                placeholder="e.g. Advanced Quantum Computing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-transparent transition-all placeholder:text-white/10"
              />
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Domain Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none transition-all"
                >
                  <option value="" className="bg-black">Select Domain</option>
                  <option value="App Development" className="bg-black">App Development</option>
                  <option value="AI/ML" className="bg-black">AI/ML</option>
                  <option value="AI Tools" className="bg-black">AI Tools</option>
                  <option value="Data Science" className="bg-black">Data Science</option>
                  <option value="Data Analytics" className="bg-black">Data Analytics</option>
                  <option value="Ethical Hacking" className="bg-black">Ethical Hacking</option>
                  <option value="UI UX Designing" className="bg-black">UI UX Designing</option>
                  <option value="Web Development" className="bg-black">Web Development</option>
                  <option value="Others" className="bg-black">Others</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">▼</div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] shadow-[0_20px_40px_rgba(255,255,255,0.05)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all flex justify-center items-center disabled:opacity-20 mt-4"
            >
              {loading ? <ClipLoader size={20} color="black" /> : "Initiate Genesis"}
            </motion.button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default CreateCourses;
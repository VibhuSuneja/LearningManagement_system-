import React, { useEffect } from 'react';
import { FaArrowLeftLong, FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import img from "../../assets/empty.jpg";
import { FaEdit, FaVideo, FaClipboardList, FaListUl, FaEye, FaTasks, FaGraduationCap } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { setCreatorCourseData } from '../../redux/courseSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Nav from '../../component/Nav';
import Footer from '../../component/Footer';

function Courses() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { creatorCourseData } = useSelector(state => state.course);

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true });
        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to fetch courses");
      }
    };
    getCreatorData();
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className='min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans'>
      <Nav />
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className='max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-20 relative z-10'
      >
        <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16'>
          <div className='space-y-4'>
            <motion.button 
              variants={itemVariants}
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group mb-4"
            >
              <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Return to Core</span>
            </motion.button>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              Track<br />
              <span className="text-white/20">Archive</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
              Managing {creatorCourseData?.length || 0} educational nodes
            </motion.p>
          </div>

          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='group px-10 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl flex items-center gap-3 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]' 
            onClick={() => navigate("/createcourse")}
          >
            <FaPlus className="group-hover:rotate-90 transition-transform duration-500" />
            Initialize New Course
          </motion.button>
        </div>

        {/* Courses Display */}
        {creatorCourseData?.length > 0 ? (
          <div className='grid grid-cols-1 gap-6'>
            {creatorCourseData.map((course, index) => (
              <motion.div 
                key={course._id || index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className='group bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[30px] p-6 flex flex-col lg:flex-row items-center gap-8 hover:bg-white/[0.04] hover:border-white/10 transition-all'
              >
                {/* Thumbnail */}
                <div className='w-full lg:w-64 h-40 rounded-2xl overflow-hidden border border-white/5 relative'>
                  <img 
                    src={course?.thumbnail || img} 
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                    alt={course?.title} 
                  />
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md border ${course.isPublished ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" : "bg-amber-500/20 text-amber-400 border-amber-500/20"}`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </div>
                </div>

                {/* Course Info */}
                <div className='flex-1 space-y-2 text-center lg:text-left'>
                  <h2 className='text-2xl font-black uppercase tracking-tight'>{course?.title}</h2>
                  <p className='text-[10px] font-black text-white/30 uppercase tracking-[0.2em]'>{course?.category || "Uncategorized"}</p>
                  <div className='flex items-center justify-center lg:justify-start gap-4 mt-4'>
                    <span className='text-xl font-black text-white'>₹{course?.price || "NA"}</span>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className='grid grid-cols-4 sm:grid-cols-7 lg:flex gap-3'>
                  {[
                    { icon: <FaEdit />, label: "Edit", path: `/editcourse/${course?._id}`, color: "hover:bg-blue-500/10 hover:text-blue-400" },
                    { icon: <FaEye />, label: "View", path: `/viewlecture/${course?._id}`, color: "hover:bg-emerald-500/10 hover:text-emerald-400" },
                    { icon: <FaVideo />, label: "Live", path: `/live/${course?._id}`, color: "hover:bg-red-500/10 hover:text-red-400" },
                    { icon: <FaClipboardList />, label: "Quiz", path: `/create-quiz/${course?._id}`, color: "hover:bg-amber-500/10 hover:text-amber-400" },
                    { icon: <FaListUl />, label: "Manage", path: `/manage-quizzes/${course?._id}`, color: "hover:bg-purple-500/10 hover:text-purple-400" },
                    { icon: <FaGraduationCap />, label: "Assign", path: `/create-assignment/${course?._id}`, color: "hover:bg-indigo-500/10 hover:text-indigo-400" },
                    { icon: <FaTasks />, label: "Review", path: `/manage-assignments/${course?._id}`, color: "hover:bg-rose-500/10 hover:text-rose-400" },
                  ].map((action, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(action.path)}
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-white/40 transition-all ${action.color}`}
                      title={action.label}
                    >
                      {action.icon}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className='bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[40px] p-20 text-center space-y-6'>
            <div className='w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto'>
              <FaPlus className='text-white/20 text-3xl' />
            </div>
            <h3 className='text-xl font-black uppercase tracking-widest'>No tracks detected in archive</h3>
            <p className='text-white/40 text-sm max-w-sm mx-auto'>Begin your legacy by initializing your first course track today.</p>
          </div>
        )}
      </motion.div>
      <Footer />
    </div>
  );
}

export default Courses;
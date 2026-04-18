import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoVideocamOutline, IoPlayCircleOutline } from "react-icons/io5";
import { FiTrendingUp, FiCheckCircle, FiClock, FiActivity } from "react-icons/fi";
import useGetCurrentUser from '../customHooks/getCurrentUser';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../component/Nav';
import Footer from '../component/Footer';

function MyEnrolledCourse() {
  const navigate = useNavigate();
  useGetCurrentUser();
  
  const { userData } = useSelector((state) => state.user);
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverallProgress();
  }, []);

  const fetchOverallProgress = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/progress/my-progress`, {
        withCredentials: true
      });
      setProgressData(response.data.progressRecords);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching progress:", error);
      setLoading(false);
    }
  };

  const getCourseProgress = (courseId) => {
    const record = progressData.find(p => p.course?._id === courseId || p.course === courseId);
    return record ? record.completionPercentage : 0;
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-[#000] flex justify-center items-center'>
        <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse" />
            <ClipLoader size={50} color='#ffffff' speedMultiplier={0.5} />
        </div>
      </div>
    );
  }

  const statConfig = [
    { label: 'Active Tracks', value: stats?.totalCourses || 0, icon: FiTrendingUp, color: 'blue' },
    { label: 'Milestones', value: stats?.completedCourses || 0, icon: FiCheckCircle, color: 'emerald' },
    { label: 'In Transition', value: stats?.inProgressCourses || 0, icon: FiClock, color: 'purple' },
    { label: 'Efficiency', value: `${stats?.averageCompletion || 0}%`, icon: FiActivity, color: 'rose' },
  ];

  return (
    <div className="min-h-screen bg-[#000] text-white selection:bg-white selection:text-black font-['Inter']">
      <Nav />
      
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-[1600px] mx-auto px-8 md:px-16 pt-32 pb-32 relative z-10"
      >
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
          <div className="space-y-8 max-w-2xl">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-4 text-white/30 hover:text-white transition-all group mb-8 border border-white/5 bg-white/[0.02] px-6 py-3 rounded-full w-fit hover:bg-white/5"
            >
              <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Return</span>
            </button>
            <div className="space-y-4">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.6em]">Personnel Matrix</span>
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] font-['Outfit']">
                Learning<br />
                <span className="text-white/10 hover:text-white transition-colors duration-1000">Simulation</span>
                </h1>
            </div>
            <p className="text-white/40 font-medium text-lg leading-relaxed max-w-lg">Comprehensive telemetry of your neural convergence and active developmental sequences.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-auto">
            {statConfig.map((stat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 rounded-[32px] min-w-[200px] hover:border-white/20 transition-all group relative overflow-hidden"
              >
                <div className={`absolute -top-10 -right-10 w-24 h-24 bg-${stat.color}-500/10 blur-3xl group-hover:bg-${stat.color}-500/20 transition-colors`} />
                <stat.icon className="text-white/20 mb-6 group-hover:text-white transition-colors" size={24} />
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
                <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {!userData?.enrolledCourses || userData.enrolledCourses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-48 flex flex-col items-center justify-center text-center space-y-8 bg-white/[0.01] border border-white/5 rounded-[48px] backdrop-blur-xl"
          >
            <div className="w-24 h-24 rounded-[32px] bg-white/[0.02] flex items-center justify-center text-5xl border border-white/5 relative group">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="relative">🛰️</span>
            </div>
            <div className="space-y-3">
                <h3 className="text-3xl font-black uppercase tracking-tighter">Void Sequence</h3>
                <p className="text-white/30 max-w-sm mx-auto font-medium leading-relaxed">Your neural repository is currently offline. Synchronize with the simulation hub to begin your ascent.</p>
            </div>
            <button 
              onClick={() => navigate("/allcourses")}
              className="px-12 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-full hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
               Browse Dimensions
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {userData.enrolledCourses.filter(Boolean).map((course, index) => (
                <motion.div
                  key={course._id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  className="bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden group hover:border-white/20 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/20 to-transparent opacity-90" />
                    
                    <div className="absolute top-6 left-6">
                      <span className="px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-lg">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-10 space-y-10 relative">
                    <h2 className="text-2xl font-black text-white tracking-tighter leading-[1.1] min-h-[3rem] group-hover:text-blue-400 transition-colors duration-500">
                      {course?.title}
                    </h2>
                    
                    {/* Progress Information */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Synchronization</span>
                        <span className="text-lg font-black text-white tracking-tighter">{getCourseProgress(course._id)}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5 p-[1px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${getCourseProgress(course._id)}%` }}
                          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
                          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-full rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => navigate(`/viewlecture/${course._id}`)}
                        className="flex items-center justify-center gap-3 py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-100 transition-all active:scale-[0.97] shadow-lg"
                      >
                        <IoPlayCircleOutline size={20} /> Resume
                      </button>
                      <button 
                        onClick={() => navigate(`/live/${course._id}`)}
                        className="flex items-center justify-center gap-3 py-5 bg-red-600/10 text-red-500 border border-red-500/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white hover:border-transparent transition-all active:scale-[0.97]"
                      >
                        <IoVideocamOutline size={20} /> Live
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      <Footer />
    </div>
  );
}

export default MyEnrolledCourse;


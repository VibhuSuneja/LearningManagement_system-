import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import img from "../../assets/empty.jpg";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaUsers, FaArrowUp, FaGraduationCap, FaRupeeSign, FaArrowRightLong } from "react-icons/fa6";
import { FaHistory, FaChartLine } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../../component/Nav';
import Footer from '../../component/Footer';

function Dashboard() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/analytics/educator`, { withCredentials: true });
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black uppercase font-black tracking-widest text-white">
      <div className="flex flex-col items-center gap-6">
        <ClipLoader size={40} color="white" />
        <span className="opacity-50 text-[10px] tracking-[0.4em]">Syncing Intelligence...</span>
      </div>
    </div>
  );

  const { summary, coursePerformance, recentActivity } = analytics || {
      summary: { totalRevenue: 0, totalStudents: 0, averageCompletion: 0, courseCount: 0 },
      coursePerformance: [],
      recentActivity: []
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-5 rounded-[24px] shadow-2xl">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 border-b border-white/5 pb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6 py-1">
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{entry.name}</span>
              <span className="text-sm font-black text-white">{entry.name === 'revenue' ? `₹${entry.value}` : `${entry.value}%`}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <Nav />
      
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/[0.03] blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-6 pt-40 pb-24 relative z-10 space-y-16"
      >
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/")}
                className="flex items-center gap-3 text-white/30 hover:text-white transition-all group"
            >
              <FaArrowLeftLong className="group-hover:-translate-x-2 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">System Exit</span>
            </motion.button>
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Command Center</h2>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
                Neural<br />
                <span className="text-white/10">Dashboard</span>
              </h1>
            </div>
          </div>

          <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/createcourses")}
              className="px-10 py-6 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-full hover:bg-gray-100 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.05)] border border-white/20"
          >
              Initialize New Node
          </motion.button>
        </div>

        {/* Analytics Overview Label */}
        <div className="flex items-center gap-4 text-white/20">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em]">Ecosystem Metrics</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: "Yield (Gross)", value: `₹${summary.totalRevenue.toLocaleString()}`, icon: <FaRupeeSign />, trend: "+12%" },
                { label: "Active Entities", value: summary.totalStudents, icon: <FaUsers />, trend: "+5%" },
                { label: "Execution Rate", value: `${summary.averageCompletion}%`, icon: <FaGraduationCap />, trend: "Optimal" },
                { label: "System Tracks", value: summary.courseCount, icon: <FaChartLine />, trend: "Stable" }
            ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,0.04)" }}
                  className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[40px] flex flex-col justify-between group h-full relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      {stat.icon}
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">{stat.label}</p>
                          <span className="text-[8px] font-black uppercase text-green-500/50">{stat.trend}</span>
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Charts & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Completion Rates Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 md:p-14"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black uppercase tracking-tighter">Completion Analysis</h2>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Performance variance per deployed track</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                      <span className="text-[9px] font-black text-white/50 uppercase tracking-widest leading-none">Live Protocol</span>
                    </div>
                </div>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={coursePerformance}>
                            <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 900, textAnchor: 'middle'}}
                                dy={20}
                            />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 900}} />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                            <Bar dataKey="completion" fill="#ffffff" radius={[12, 12, 4, 4]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Recent Activity Feed */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 md:p-14 flex flex-col h-[650px] lg:h-auto"
            >
                <div className="flex items-center gap-4 mb-14">
                    <div className="p-3 bg-white/5 rounded-2xl text-white/20">
                      <FaHistory size={14} />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black uppercase tracking-tighter">Neural Feed</h2>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Recent portal interactions</p>
                    </div>
                </div>
                <div className="space-y-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, i) => (
                            <motion.div 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              key={i} 
                              className="flex gap-5 items-start group"
                            >
                                <div className="relative shrink-0">
                                  <img 
                                      src={activity?.photo || img} 
                                      className="w-14 h-14 rounded-[20px] border border-white/5 object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                                      alt="" 
                                  />
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-[3px] border-black shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h4 className="text-xs font-black text-white flex items-center justify-between truncate uppercase tracking-tighter">
                                        {activity?.user || "Anonymous Node"}
                                        <span className="text-[8px] bg-white/5 px-2 py-1 rounded-md text-white/20 tracking-widest font-black uppercase">
                                          {activity?.time ? new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                                        </span>
                                    </h4>
                                    <p className="text-[11px] text-white/40 font-medium mt-2 leading-relaxed group-hover:text-white/70 transition-colors uppercase tracking-tight">{activity?.content}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-5 grayscale">
                            <FaUsers className="text-6xl mb-6" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Feed Inactive</p>
                        </div>
                    )}
                </div>
                <button 
                  onClick={() => navigate("/grade-assignments")}
                  className="w-full mt-10 py-5 bg-white text-black font-black rounded-3xl text-[9px] uppercase tracking-[0.4em] hover:bg-gray-200 transition-all active:scale-[0.98] shadow-2xl"
                >
                  Inspect Interactions
                </button>
            </motion.div>
        </div>

        {/* Dana Protocol Access */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          onClick={() => navigate("/dana-protocol")}
          className="bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 md:p-14 relative overflow-hidden group cursor-pointer"
        >
            <div className="absolute inset-0 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Protocol Optimized</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
                        Dana<br />
                        <span className="text-white/20 group-hover:text-white transition-colors">Financial Hub</span>
                    </h2>
                    <p className="text-[10px] font-medium text-white/40 uppercase tracking-[0.2em] max-w-md">
                        Advanced tax reporting, yield optimization, and cryptographic transaction verification.
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Monthly Capacity</p>
                        <p className="text-2xl font-black tracking-tighter text-white">98.4%</p>
                    </div>
                    <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        <FaArrowRightLong size={24} />
                    </div>
                </div>
            </div>
            
            {/* Visual Decorator */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/[0.02] blur-[80px] rounded-full pointer-events-none" />
        </motion.div>

      </motion.div>
      <Footer />
    </div>
  );
}

export default Dashboard;



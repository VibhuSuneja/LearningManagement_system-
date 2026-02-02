import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import img from "../../assets/empty.jpg";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaUsers, FaArrowUp, FaGraduationCap, FaRupeeSign } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 uppercase font-black tracking-widest text-black">
      <div className="flex flex-col items-center gap-4">
        <ClipLoader size={40} color="black" />
        Generating Insights...
      </div>
    </div>
  );

  const { summary, coursePerformance, recentActivity } = analytics || {
      summary: { totalRevenue: 0, totalStudents: 0, averageCompletion: 0, courseCount: 0 },
      coursePerformance: [],
      recentActivity: []
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <div className="w-full px-6 py-10 space-y-8 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div onClick={() => navigate("/")} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-black hover:text-white transition-all cursor-pointer border border-gray-100">
                    <FaArrowLeftLong />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-black uppercase tracking-tight">Educator Dashboard</h1>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Performance Analytics & Insights</p>
                </div>
            </div>
            <button 
                onClick={() => navigate("/courses")}
                className="bg-black text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
            >
                Create New Course
            </button>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
                { label: "Total Revenue", value: `₹${summary.totalRevenue.toLocaleString()}`, icon: <FaRupeeSign />, color: "text-green-600", bg: "bg-green-50" },
                { label: "Total Students", value: summary.totalStudents, icon: <FaUsers />, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Avg. Completion", value: `${summary.averageCompletion}%`, icon: <FaGraduationCap />, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Active Courses", value: summary.courseCount, icon: <FaArrowUp />, color: "text-orange-600", bg: "bg-orange-50" }
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
                    </div>
                    <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl text-xl`}>
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Completion Rates Chart */}
            <div className="lg:col-span-2 bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black uppercase tracking-tight">Course Completion Analysis</h2>
                    <span className="text-[10px] font-black text-gray-400 uppercase">Per Student Average (%)</span>
                </div>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={coursePerformance}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                                padding={{ left: 20, right: 20 }}
                            />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                            <Tooltip 
                                cursor={{fill: '#f8fafc'}}
                                contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800}}
                            />
                            <Bar dataKey="completion" fill="#000" radius={[10, 10, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                    <FaHistory className="text-gray-400" />
                    <h2 className="text-xl font-black uppercase tracking-tight">Student Activity</h2>
                </div>
                <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, i) => (
                            <div key={i} className="flex gap-4 items-start group">
                                <img 
                                    src={activity.photo || img} 
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-md" 
                                    alt="" 
                                />
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-black flex items-center gap-2">
                                        {activity.user}
                                        <span className="text-[8px] bg-gray-100 px-2 py-0.5 rounded-full uppercase text-gray-400">Assignment</span>
                                    </h4>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5 italic">{activity.content}</p>
                                    <span className="text-[8px] text-gray-300 font-bold uppercase mt-1 block">
                                        {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-10">
                            <FaUsers className="text-gray-100 text-6xl mb-4" />
                            <p className="text-gray-300 font-black uppercase text-[10px] tracking-widest">No recent student activity</p>
                        </div>
                    )}
                </div>
                <button 
                  onClick={() => navigate("/grade-assignments")}
                  className="w-full mt-6 py-3 border-2 border-gray-100 text-gray-400 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:border-black hover:text-black transition-all"
                >
                  View All Submissions
                </button>
            </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-tight mb-8">Revenue Contribution</h2>
            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={coursePerformance}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" hide />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard

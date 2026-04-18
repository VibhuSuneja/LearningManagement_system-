import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import Nav from '../component/Nav';
import Footer from '../component/Footer';
import { FaCrown, FaMedal, FaTrophy, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/gamification/leaderboard`, { withCredentials: true });
                setLeaders(res.data);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-[80px] selection:bg-white selection:text-black">
      <Nav />
      {/* Background Decorative Blurs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-20 z-10">
        <div className="text-center mb-16 md:mb-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-2xl px-6 py-2 rounded-full border border-white/10 shadow-2xl mb-8"
          >
            <FaTrophy className="text-yellow-400 text-lg animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Global Competition</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
            Legacy <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/40 via-white to-white/40">Leaderboard</span>
          </h1>
          <p className="text-white/40 font-medium text-sm md:text-lg mt-6 max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
            Celebrating our top scholars. Rise through the ranks by mastering new skills.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-white mb-6"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Calculating Standings...</p>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-32">
            {/* Top 3 Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pb-8">
              {[leaders[1], leaders[0], leaders[2]].map((student, idx) => {
                if (!student) return null;
                const podiumIdx = idx === 1 ? 0 : idx === 0 ? 1 : 2;
                const isWinner = podiumIdx === 0;
                
                return (
                  <motion.div
                    key={student._id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex flex-col items-center p-10 rounded-[45px] border transition-all relative overflow-hidden group ${
                      isWinner 
                        ? 'bg-white text-black border-white shadow-[0_0_80px_rgba(255,255,255,0.1)] md:-translate-y-8 md:scale-110 z-20' 
                        : 'bg-white/[0.03] backdrop-blur-3xl border-white/10 border-b-white/5'
                    }`}
                  >
                    {isWinner && (
                      <>
                        <FaCrown className="text-yellow-400 text-5xl absolute -top-4 animate-bounce drop-shadow-2xl" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/[0.02] to-black/[0.05] pointer-events-none"></div>
                      </>
                    )}
                    
                    <div className="relative mb-8">
                      <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 ${isWinner ? 'bg-black' : 'bg-white/20'}`}></div>
                      <img 
                        src={student?.photoUrl || "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg"} 
                        alt="" 
                        className={`relative w-28 h-28 md:w-32 md:h-32 rounded-3xl object-cover border-4 transition-transform duration-500 group-hover:scale-105 ${isWinner ? 'border-black' : 'border-white/10'}`}
                      />
                      <div className={`absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border-4 ${
                        isWinner ? 'bg-black text-white border-white' : 'bg-white text-black border-black/10'
                      }`}>
                        {podiumIdx + 1}
                      </div>
                    </div>
                    
                    <h3 className={`text-2xl font-black uppercase tracking-tight truncate w-full text-center ${isWinner ? 'text-black' : 'text-white'}`}>
                      {student?.name || "Scholar"}
                    </h3>
                    
                    <div className="flex items-center gap-3 mt-4">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isWinner ? 'bg-black/10 text-black' : 'bg-white/10 text-white/60'}`}>
                        LVL {student.level}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isWinner ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        {student.points.toLocaleString()} XP
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* List View */}
            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[50px] border border-white/5 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-12 bg-white/[0.02] p-8 border-b border-white/5">
                <div className="col-span-2 md:col-span-1 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Rank</div>
                <div className="col-span-6 md:col-span-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Scholar</div>
                <div className="hidden md:block md:col-span-3 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Activity Streak</div>
                <div className="col-span-4 md:col-span-2 text-right text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Mastery pts</div>
              </div>

              <div className="divide-y divide-white/5">
                {leaders.filter(s => s !== null).map((student, index) => (
                  <motion.div 
                    key={student._id || index}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    className="grid grid-cols-12 px-8 py-7 items-center transition-colors"
                  >
                    <div className="col-span-2 md:col-span-1">
                      <span className={`text-lg md:text-xl font-black ${index < 3 ? 'text-white' : 'text-white/20'}`}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="col-span-6 md:col-span-6 flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={student?.photoUrl || "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg"} 
                          alt="" 
                          className="w-12 h-12 rounded-xl object-cover border border-white/10" 
                        />
                        {index < 3 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-black"></div>}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-white text-base md:text-lg truncate tracking-tight">{student?.name || "Student"}</div>
                        <div className="md:hidden flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{student.streak} DAY STREAK 🔥</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block col-span-3 text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border tracking-widest uppercase ${student.streak > 0 ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-white/5 text-white/20 border-white/5'}`}>
                            {student.streak} Day streak 🔥
                        </div>
                    </div>
                    <div className="col-span-4 md:col-span-2 text-right">
                        <div className="flex flex-col">
                          <span className="text-lg md:text-xl font-black text-white tracking-tighter">
                            {student.points >= 1000 ? `${(student.points/1000).toFixed(1)}k` : student.points}
                          </span>
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">XP Accumulated</span>
                        </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Strategy Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-[50px] p-10 text-black relative overflow-hidden group shadow-2xl"
                >
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 leading-none">XP Mastery <br /><span className="text-black/30">Manual</span></h2>
                        <div className="space-y-4">
                            {[
                                { text: "Enroll in new courses", xp: "+100" },
                                { text: "Complete modules", xp: "+50" },
                                { text: "Daily learning streaks", xp: "Bonus" },
                                { text: "Quiz perfection", xp: "2X Mul" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-black/60 text-sm font-black uppercase tracking-widest border-b border-black/5 pb-3">
                                    <span>{item.text}</span>
                                    <span className="text-black">{item.xp}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <FaStar className="absolute right-0 bottom-0 text-[200px] text-black/5 -mr-12 -mb-12 rotate-12 transition-transform duration-700" />
                </motion.div>

                <motion.div 
                  whileHover={{ y: -10 }}
                  className="bg-white/[0.03] backdrop-blur-3xl rounded-[50px] p-10 border border-white/10 flex flex-col justify-between text-left group"
                >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 rotate-3">
                        <FaTrophy className="text-black text-3xl" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Command the <br />Standings</h2>
                      <p className="text-white/40 text-base font-medium mb-10 leading-relaxed">Consistent learning and community leadership are the only paths to becoming a legend.</p>
                      <button 
                        onClick={() => navigate("/allcourses")}
                        className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl relative overflow-hidden"
                      >
                        <span className="relative z-10">Enter Arena</span>
                      </button>
                    </div>
                </motion.div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};


export default Leaderboard;

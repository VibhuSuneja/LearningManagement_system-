import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import Nav from '../component/Nav';
import Footer from '../component/Footer';
import { FaCrown, FaMedal, FaTrophy, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <FaCrown className="text-yellow-400 text-3xl" />;
            case 1: return <FaMedal className="text-gray-300 text-2xl" />;
            case 2: return <FaMedal className="text-amber-600 text-xl" />;
            default: return <span className="text-gray-500 font-bold">#{index + 1}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-20">
            <Nav />
            <div className="flex-1 max-w-4xl mx-auto w-full p-6">
                <div className="text-center mb-10">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-black mb-2 flex items-center justify-center gap-3"
                    >
                        <FaTrophy className="text-yellow-500" /> STUDENT LEADERBOARD
                    </motion.h1>
                    <p className="text-gray-600 font-medium italic">Rise through the ranks by learning and participating!</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="grid grid-cols-12 bg-black text-white p-4 font-bold uppercase text-xs tracking-widest">
                            <div className="col-span-2 text-center">Rank</div>
                            <div className="col-span-4">Student</div>
                            <div className="col-span-2 text-center">Streak</div>
                            <div className="col-span-2 text-center">Level</div>
                            <div className="col-span-2 text-center">XP Points</div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {leaders.filter(s => s !== null).map((student, index) => (
                                <motion.div 
                                    key={student._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`grid grid-cols-12 p-4 items-center transition-colors hover:bg-gray-50 ${index < 3 ? 'bg-yellow-50/30' : ''}`}
                                >
                                    <div className="col-span-2 flex justify-center">
                                        {getRankIcon(index)}
                                    </div>
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="relative">
                                            <img 
                                                src={student?.photoUrl || "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg"} 
                                                alt={student?.name || "Student"} 
                                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                            />
                                            {index === 0 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 truncate max-w-[120px]">{student?.name || "Student"}</div>
                                            <div className="flex gap-1">
                                                {student?.badges?.slice(0, 3).map((badge, i) => (
                                                    <span key={i} title={badge?.name} className="text-xs">{badge?.icon}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <div className={`flex items-center justify-center gap-1 font-black ${student.streak > 0 ? 'text-orange-500' : 'text-gray-300'}`}>
                                            {student.streak || 0} 
                                            <span className={`${student.streak > 0 ? 'animate-pulse' : ''} text-[10px]`}>🔥</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className="bg-black text-white text-[10px] font-black px-2 py-1 rounded-full">
                                            LVL {student.level}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-center font-black text-black">
                                        {student.points.toLocaleString()}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="mt-12 bg-gradient-to-r from-black to-gray-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black mb-2">HOW TO EARN XP?</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                            <li className="flex items-center gap-2"><FaStar className="text-yellow-400" /> Enroll in a Course: +100 XP</li>
                            <li className="flex items-center gap-2"><FaStar className="text-yellow-400" /> Join Live Classroom: +50 XP</li>
                            <li className="flex items-center gap-2"><FaStar className="text-yellow-400" /> Daily Streak: Bonus XP Daily!</li>
                            <li className="flex items-center gap-2"><FaStar className="text-yellow-400" /> New Badges: Achievement Unlocks!</li>
                        </ul>
                    </div>
                    <FaTrophy className="absolute right-0 bottom-0 text-[180px] text-white/5 transform rotate-12 -mr-10 -mb-10" />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Leaderboard;

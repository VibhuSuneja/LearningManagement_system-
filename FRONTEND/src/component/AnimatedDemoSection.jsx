import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaRobot, FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';

const AnimatedDemoSection = () => {
    const features = [
        {
            title: "AI-Powered Learning",
            desc: "Generate quizzes and get instant feedback using Gemini AI.",
            icon: <FaRobot className="text-purple-500" />,
            color: "bg-purple-50"
        },
        {
            title: "Real-time Tracking",
            desc: "Watch your progress grow with detailed analytics and bars.",
            icon: <FaChartLine className="text-blue-500" />,
            color: "bg-blue-50"
        },
        {
            title: "Expert Instruction",
            desc: "Learn from top-tier educators with direct feedback loops.",
            icon: <FaGraduationCap className="text-orange-500" />,
            color: "bg-orange-50"
        }
    ];

    return (
        <div className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full"
                    >
                        Experience the Platform
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 mt-4 tracking-tight"
                    >
                        The Future of LMS is <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Animated</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Interactive Mockup */}
                    <div className="relative">
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="relative z-10 bg-white p-4 rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-gray-100"
                        >
                            <div className="bg-gray-50 rounded-[32px] overflow-hidden aspect-[4/3] relative">
                                {/* Simulated UI Elements */}
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute top-10 left-10 right-10 bg-white p-6 rounded-3xl shadow-xl flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold">L</div>
                                        <div>
                                            <div className="h-3 w-32 bg-gray-100 rounded-full mb-2" />
                                            <div className="h-2 w-20 bg-gray-50 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                                </motion.div>

                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="absolute bottom-10 right-10 bg-black text-white p-6 rounded-[32px] shadow-2xl w-2/3"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaRobot className="text-purple-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">AI Assistant</span>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed">
                                        "Based on your latest assignment, I recommend reviewing the 'Advanced Logic' lecture. Your understanding of loops is 94%!"
                                    </p>
                                </motion.div>

                                {/* Floating Stats */}
                                <motion.div 
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    className="absolute top-40 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-gray-50"
                                >
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl font-black text-blue-600">88%</span>
                                        <span className="text-[8px] font-black text-gray-400 tracking-tighter uppercase">Completion</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Background Blobs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-50/50 rounded-full blur-3xl -z-10" />
                    </div>

                    {/* Features List */}
                    <div className="space-y-8">
                        {features.map((f, i) => (
                            <motion.div 
                                key={i}
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="group flex items-start gap-6 p-6 rounded-3xl hover:bg-gray-50 transition-all cursor-default"
                            >
                                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                                    {f.icon}
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-gray-800 mb-1">{f.title}</h4>
                                    <p className="text-gray-500 font-medium">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Global Stats Counter */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Active Learners", val: "12k+" },
                        { label: "AI Quizzes Daily", val: "5k+" },
                        { label: "Success Rate", val: "94%" },
                        { label: "Expert Mentors", val: "850+" }
                    ].map((s, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center"
                        >
                            <p className="text-4xl font-black text-gray-900 mb-1">{s.val}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnimatedDemoSection;

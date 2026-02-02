import React from 'react';
import { motion } from 'framer-motion';
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { BiSolidBadgeCheck, BiRocket, BiTargetLock, BiGroup } from "react-icons/bi";
import { FaGraduationCap, FaChalkboardTeacher, FaAward, FaInfinity } from "react-icons/fa";

// Note: Using the stunning generated image for the premium look
import aboutHero from "../assets/lms_about_hero_1770053422258.png"; 
import founderImg from "../assets/founder.jpg";

const StatCard = ({ icon: Icon, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center justify-center min-w-[160px] hover:bg-white/20 transition-all cursor-default group"
  >
    <div className="bg-blue-500/20 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
      <Icon className="text-blue-400 text-3xl" />
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </motion.div>
);

const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-3 text-gray-300 group">
    <div className="bg-green-500/20 p-1.5 rounded-lg group-hover:bg-green-500/40 transition-colors">
      <BiSolidBadgeCheck className="text-green-400 text-xl" />
    </div>
    <span className="font-medium">{text}</span>
  </div>
);

function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#0a0a0c] py-20 px-4 md:px-10 lg:px-20">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16"
      >
        {/* Left Side: Visual Experience */}
        <motion.div 
          className="lg:w-1/2 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative z-10 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl shadow-blue-500/10 group">
            <img 
              src={aboutHero || "https://images.unsplash.com/photo-1501504905953-f8c97f2d819b?q=80&w=1974&auto=format&fit=crop"} 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
              alt="About Virtual Courses" 
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-60" />
            
            {/* Experience Badge */}
            <motion.div 
              initial={{ rotate: -10, opacity: 0 }}
              whileInView={{ rotate: 10, opacity: 1 }}
              className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-xl border border-white/20 hidden md:block"
            >
              <div className="text-4xl font-black text-white">05+</div>
              <div className="text-xs font-bold text-blue-100 uppercase tracking-widest mt-1">Years of Excellence</div>
            </motion.div>

            {/* Founder Trust Badge */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20 flex items-center gap-3 shadow-2xl hidden lg:flex"
            >
              <div className="relative">
                <img src={founderImg} className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500" alt="Founder" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0c] animate-pulse" />
              </div>
              <div className="pr-4">
                <div className="text-white text-xs font-black uppercase tracking-tighter">Vibhu Suneja</div>
                <div className="text-blue-400 text-[10px] font-bold uppercase">Lead Educator</div>
              </div>
            </motion.div>
          </div>
          
          {/* Floating Element */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        </motion.div>

        {/* Right Side: Content & Mission */}
        <div className="lg:w-1/2">
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <span className="text-blue-400 font-bold uppercase tracking-[0.2em] text-sm">About Us</span>
            <TfiLayoutLineSolid className="text-blue-500 w-10 h-10" />
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-8"
          >
            Empowering the Next Generation of <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Digital Innovators</span>
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-gray-400 text-lg leading-relaxed mb-10"
          >
            We don't just provide courses; we build careers. Our AI-driven ecosystem bridges the gap between traditional learning and modern industry demands through immersive experience and real-time mentorship.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 mb-12"
          >
            <FeatureItem text="AI-Powered Learning Paths" />
            <FeatureItem text="Expert Industry Mentors" />
            <FeatureItem text="Real-world Project Experience" />
            <FeatureItem text="Lifetime Community Access" />
          </motion.div>

          {/* Mission & Vision Mini-Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-blue-500/50 transition-all group"
            >
              <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/40 transition-all">
                <BiRocket className="text-blue-400 text-2xl" />
              </div>
              <h4 className="text-white font-bold mb-2 text-lg">Our Mission</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                To democratize high-end tech education through accessible, intelligent, and project-based learning.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-purple-500/50 transition-all group"
            >
              <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/40 transition-all">
                <BiTargetLock className="text-purple-400 text-2xl" />
              </div>
              <h4 className="text-white font-bold mb-2 text-lg">Our Vision</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                To become the global standard for AI-integrated vocational training and skill development.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto mt-24">
        <div className="flex flex-wrap justify-center lg:justify-between gap-8 py-12 border-t border-white/10">
          <StatCard icon={FaGraduationCap} value="15K+" label="Active Students" delay={0.2} />
          <StatCard icon={FaChalkboardTeacher} value="120+" label="Expert Mentors" delay={0.4} />
          <StatCard icon={FaInfinity} value="Home" label="Curated Courses" delay={0.6} />
          <StatCard icon={FaAward} value="98%" label="Success Rate" delay={0.8} />
        </div>
      </div>
    </div>
  );
}

export default About;

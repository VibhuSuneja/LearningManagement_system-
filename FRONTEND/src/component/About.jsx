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
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[140px] hover:bg-white/10 transition-all cursor-default group"
  >
    <div className="bg-blue-500/20 p-2.5 rounded-full mb-2 group-hover:scale-110 transition-transform">
      <Icon className="text-blue-400 text-2xl" />
    </div>
    <div className="text-xl font-bold text-white mb-0.5">{value}</div>
    <div className="text-gray-400 text-xs tracking-wide">{label}</div>
  </motion.div>
);

const FeatureItem = ({ text }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="flex items-center gap-3 text-gray-300 group"
  >
    <div className="bg-green-500/10 p-1.5 rounded-lg group-hover:bg-green-500/20 transition-colors border border-green-500/20">
      <BiSolidBadgeCheck className="text-green-400 text-xl" />
    </div>
    <span className="font-medium text-sm md:text-base">{text}</span>
  </motion.div>
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
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#0a0a0c] py-24 px-4 md:px-10 lg:px-20 border-t border-white/5">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
      >
        {/* Left Side: Founder Visuals */}
        <motion.div 
          className="lg:w-1/2 relative flex justify-center lg:justify-start"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative z-10 w-full max-w-[450px]">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-3xl group relative">
              <img 
                src={founderImg} 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                alt="Vibhu Suneja - Founder" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
            </div>
            
            {/* Pulsing Status Badge */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="absolute -top-6 -right-6 md:-right-10 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-3 shadow-2xl"
            >
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
              <div>
                <div className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Active Creator</div>
              </div>
            </motion.div>

            {/* Float Experience Badge */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              className="absolute -bottom-8 -left-6 md:-left-12 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] shadow-2xl border border-white/20 hidden sm:block"
            >
              <div className="text-4xl font-black text-white leading-none">Pro</div>
              <div className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mt-2 border-t border-white/20 pt-2">Lifelong Learner</div>
            </motion.div>
          </div>
          
          {/* Background Sphere */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Right Side: Mission & Content */}
        <div className="lg:w-1/2">
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <span className="text-blue-400 font-bold uppercase tracking-[0.3em] text-xs">Meet the Founder</span>
            <div className="h-[1px] w-12 bg-blue-500/50" />
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-8"
          >
            Developing Skills for the <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Future of Work</span>
          </motion.h2>

          <motion.div variants={itemVariants} className="mb-10 flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit">
               <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <BiRocket className="text-blue-400 text-2xl" />
               </div>
               <div>
                  <h4 className="text-white font-bold text-sm">Vibhu Suneja</h4>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold italic">Ambitious CS Student & Developer</p>
               </div>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="text-gray-400 text-base md:text-lg leading-relaxed mb-10 max-w-xl italic"
          >
            "I built V-LMS to bridge the gap between traditional learning and modern tech demands. Our goal is to empower learners with project-based skills that translate directly to industry success."
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

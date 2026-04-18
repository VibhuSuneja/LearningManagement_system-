import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'

import Nav from '../component/Nav'
import home from "../assets/home1.jpg"
import { SiViaplay } from "react-icons/si";
import { FaArrowRight, FaRobot, FaChalkboardTeacher } from "react-icons/fa";
import ai from "../assets/ai.png"
import ail from "../assets/SearchAi.png"
import Logos from '../component/Logos';
import ExploreCourses from '../component/ExploreCourses';
import CardPage from '../component/CardPage';
import getPublishedCourse from '../customHooks/getPublishedCourse';
import About from '../component/About';
import Footer from '../component/Footer'
import ReviewPage from '../component/ReviewPage';
import AnimatedDemoSection from '../component/AnimatedDemoSection';

function Home() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate()
  getPublishedCourse();
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  const handleLiveRedirect = () => {
    if (!userData) {
      navigate("/login");
      return;
    }
    if (userData.role === "educator") {
      navigate("/courses");
    } else {
      navigate("/mycourses");
    }
  };

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen overflow-x-hidden">
      <Nav />
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] md:h-[110vh] flex items-center justify-center overflow-hidden py-20 px-4">
        {/* Background Layer */}
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img 
            src={home} 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-110" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </motion.div>

        {/* Content Layer */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="space-y-6 md:space-y-8"
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-[10px] md:text-sm font-black uppercase tracking-[0.3em] mb-2">
              The Future of Learning is Here
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Digital Legacy</span>
            </h1>
            <p className="max-w-xl mx-auto text-base md:text-xl text-white/50 font-medium tracking-tight px-4 leading-relaxed">
              Elevate your career with industry-leading courses, AI-driven learning paths, and personalized mentorship from world-class educators.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "circOut" }}
            className="mt-10 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-2xl px-4"
          >
            <button 
              onClick={() => navigate("/allcourses")}
              className="group relative w-full sm:w-auto px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-xs md:text-sm rounded-2xl overflow-hidden active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 bg-gray-100 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                Explore Courses <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button 
              onClick={() => navigate("/search")}
              className="group w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-2xl border border-white/10 text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
            >
              <FaRobot className="text-xl text-white group-hover:rotate-12 transition-transform" />
              A.I. Search
            </button>

            <button 
              onClick={handleLiveRedirect}
              className="w-full sm:w-auto px-10 py-5 bg-red-600 text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-2xl flex items-center justify-center gap-3 hover:bg-red-700 transition-all active:scale-95 shadow-2xl shadow-red-600/20"
            >
              <FaChalkboardTeacher className="text-xl md:text-2xl" />
              Live
            </button>
          </motion.div>
          
          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-20 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full px-2"
          >
            {[
              { label: "Active Students", value: "250K+" },
              { label: "Total Courses", value: "1.2K+" },
              { label: "Expert Mentors", value: "800+" },
              { label: "Success Rate", value: "98%" },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="p-5 md:p-8 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[30px] md:rounded-[40px] text-center transition-colors hover:bg-white/[0.04] hover:border-white/10"
              >
                <h3 className="text-xl md:text-4xl font-black tracking-tighter mb-1 md:mb-2">{stat.value}</h3>
                <p className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Decorative Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"></div>
      </section>

      {/* Main Content Sections */}
      <div className="relative z-10 bg-black">
        <div className="relative">
           <Logos />
           {/* Section Divider */}
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
        
        <ExploreCourses />
        
        <div className="py-20 md:py-32">
          <AnimatedDemoSection />
        </div>
        
        <div className="py-20 md:py-32 bg-gradient-to-b from-black via-white/[0.01] to-black relative">
          <CardPage />
        </div>
        
        <About />
        
        <div className="py-24 border-y border-white/5">
          <ReviewPage />
        </div>
      </div>

      {userData && (
        <motion.button 
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.startAppTour && window.startAppTour()}
          className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 bg-white text-black px-6 md:px-8 py-4 md:py-5 rounded-full shadow-2xl flex items-center gap-3 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] border border-white/20 transition-all hover:shadow-white/20"
        >
          <SiViaplay className="text-lg md:text-xl" />
          Interactive Tour
        </motion.button>
      )}

      <Footer />
    </div>
  )
}

export default Home



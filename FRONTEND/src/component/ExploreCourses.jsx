import React from 'react'
import { SiViaplay } from "react-icons/si";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdAppShortcut } from "react-icons/md";
import { FaHackerrank } from "react-icons/fa";
import { TbBrandOpenai } from "react-icons/tb";
import { SiGoogledataproc } from "react-icons/si";
import { BsClipboardDataFill } from "react-icons/bs";
import { SiOpenaigym } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'

function ExploreCourses() {
  const navigate = useNavigate()
  
  const categories = [
    { name: "Web Dev", icon: <TbDeviceDesktopAnalytics />, color: "from-fuchsia-500 to-purple-600" },
    { name: "UI/UX", icon: <LiaUikit />, color: "from-emerald-400 to-cyan-500" },
    { name: "App Dev", icon: <MdAppShortcut />, color: "from-rose-400 to-orange-500" },
    { name: "Hacking", icon: <FaHackerrank />, color: "from-sky-400 to-indigo-500" },
    { name: "AI/ML", icon: <TbBrandOpenai />, color: "from-yellow-300 to-amber-500" },
    { name: "Data Sci", icon: <SiGoogledataproc />, color: "from-orange-400 to-red-500" },
    { name: "Analytics", icon: <BsClipboardDataFill />, color: "from-slate-300 to-slate-500" },
    { name: "AI Tools", icon: <SiOpenaigym />, color: "from-violet-400 to-indigo-600" },
  ];

  return (
    <section className="w-full py-24 md:py-32 px-6 bg-black relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-24">
        {/* Left Section: Context */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-2/5 flex flex-col items-start space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85]">
              Explore<br />
              <span className="text-white/20">Our Universe</span>
            </h2>
            <div className="w-20 h-1 bg-white rounded-full"></div>
          </div>
          
          <p className="text-white/50 font-medium text-lg md:text-xl max-w-md leading-relaxed">
            Master the most in-demand skills with our curated curriculum, designed by industry experts for the next generation of digital architects.
          </p>

          <button 
            onClick={() => navigate("/allcourses")}
            className="group relative flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gray-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <span className="relative z-10 flex items-center gap-3">
              View All Courses 
              <SiViaplay className="text-xl group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>

        {/* Right Section: Categories Grid */}
        <div className="w-full lg:w-3/5 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/allcourses`)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-[35px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 flex flex-col items-center justify-center gap-4 hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-2 transition-all duration-500">
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 rounded-[35px] transition-opacity duration-500`}></div>
                
                <div className={`text-4xl md:text-5xl text-white group-hover:scale-110 transition-transform duration-500 z-10 p-4 rounded-2xl bg-gradient-to-br ${cat.color} bg-clip-text text-transparent filter drop-shadow-sm`}>
                 <span className="text-white/80 group-hover:text-white transition-colors"> {cat.icon} </span>
                </div>
                
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors z-10 text-center px-2">
                  {cat.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExploreCourses


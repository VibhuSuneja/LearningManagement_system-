import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Nav from '../component/Nav';
import Footer from '../component/Footer';
import About from '../component/About';
import { BiRocket, BiTargetLock, BiChevronRight, BiTimeFive } from 'react-icons/bi';
import { FaGraduationCap, FaQuoteLeft, FaGlobeAmericas, FaShieldAlt, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import founderImg from '../assets/founder.jpg';

const ValueCard = ({ icon: Icon, title, description, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ y: -10, borderColor: 'rgba(255,255,255,0.2)' }}
    className="bg-white/[0.01] border border-white/5 p-10 rounded-[40px] backdrop-blur-3xl transition-all group shadow-2xl relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-${color}-500/10 border border-${color}-500/20 group-hover:scale-110 transition-all relative z-10`}>
      <Icon className={`text-${color}-400 text-3xl`} />
    </div>
    <h3 className="text-white text-2xl font-black mb-4 tracking-tighter uppercase font-['Outfit'] relative z-10">{title}</h3>
    <p className="text-white/40 leading-relaxed text-sm font-medium relative z-10">{description}</p>
  </motion.div>
);

const TimelineItem = ({ year, title, description, side }) => (
  <motion.div 
    initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    className={`flex items-center justify-center w-full mb-16 flex-col ${side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'}`}
  >
    <div className="w-full md:w-1/2 px-8 text-center md:text-right">
      {side === 'left' ? (
        <div className="md:pr-12">
          <span className="text-blue-400 font-black text-xl mb-4 block tracking-[0.2em] font-['Outfit']">{year}</span>
          <h4 className="text-white text-2xl font-black mb-3 uppercase tracking-tighter font-['Outfit']">{title}</h4>
          <p className="text-white/30 text-sm leading-relaxed font-medium">{description}</p>
        </div>
      ) : <div className="hidden md:block" />}
    </div>
    <div className="w-6 h-6 rounded-full bg-white/5 border-4 border-white/10 my-6 md:my-0 relative shrink-0 z-10">
      <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
      <div className="absolute inset-1.5 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
    </div>
    <div className="w-full md:w-1/2 px-8 text-center md:text-left">
      {side === 'right' ? (
        <div className="md:pl-12">
          <span className="text-blue-400 font-black text-xl mb-4 block tracking-[0.2em] font-['Outfit']">{year}</span>
          <h4 className="text-white text-2xl font-black mb-3 uppercase tracking-tighter font-['Outfit']">{title}</h4>
          <p className="text-white/30 text-sm leading-relaxed font-medium">{description}</p>
        </div>
      ) : <div className="hidden md:block" />}
    </div>
  </motion.div>
);

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#000] min-h-screen font-['Inter'] selection:bg-white selection:text-black overflow-x-hidden"
    >
      <Nav />
      
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      {/* Hero Header */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mb-4"
          >
            Established MMXX
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-6xl md:text-[8rem] font-black text-white tracking-tighter leading-[0.9] font-['Outfit']"
          >
            Reimagining<br />
            <span className="text-white/10 hover:text-white transition-colors duration-1000 cursor-default">Intelligence</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/30 text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto font-medium italic"
          >
            We are a mission-driven assembly of architects building a smarter, unified future for the next generation of digital creators.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-8"
          >
            <button 
              onClick={() => navigate('/allcourses')}
              className="px-12 py-5 bg-white text-black rounded-[24px] font-black uppercase text-[11px] tracking-[0.3em] flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Explore Tracks <BiChevronRight className="text-2xl" />
            </button>
            <button className="px-12 py-5 bg-white/[0.02] hover:bg-white/10 text-white rounded-[24px] font-black border border-white/10 transition-all cursor-pointer text-[11px] uppercase tracking-[0.3em]">
              Join the Echelon
            </button>
          </motion.div>
        </div>
      </section>

      {/* Embedded About Section */}
      <About />

      {/* Values Grid */}
      <section className="py-32 px-6 max-w-[1400px] mx-auto">
        <div className="text-center mb-24 space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-black text-blue-400 uppercase tracking-[0.6em] block"
          >
            Core Operations
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-['Outfit']"
          >
            Our Directives
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard 
            icon={FaGraduationCap} 
            title="Entity Centric" 
            description="Every neural pathway we build is optimized for absolute learner empowerment and success."
            color="blue"
          />
          <ValueCard 
            icon={BiRocket} 
            title="Hyper Evolution" 
            description="Adapting to the digital speed of light, ensuring your skillset never hits obsolescence."
            color="purple"
          />
          <ValueCard 
            icon={FaGlobeAmericas} 
            title="Grid Unified" 
            description="Decentralizing high-tier expertise to every node on the planet without friction."
            color="indigo"
          />
          <ValueCard 
            icon={FaShieldAlt} 
            title="Integrity Core" 
            description="Enforcing the highest protocols of educational excellence and professional ethics."
            color="green"
          />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-['Outfit'] mb-8"
            >
              The Evolution Path
            </motion.h2>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-[11px] md:left-1/2 md:-translate-x-1/2 w-[2px] h-full bg-white/10" />
            
            <TimelineItem 
              year="2020" 
              title="Initialization" 
              description="Conceptualized in a dorm room with a singular directive: optimize online technical education." 
              side="left" 
            />
            <TimelineItem 
              year="2022" 
              title="Network Expansion" 
              description="Scaled to 50k active nodes across 12 countries, initializing our prototype AI advisors." 
              side="right" 
            />
            <TimelineItem 
              year="2024" 
              title="Quantum Leap" 
              description="Launched v2.0 with deep neural integration and real-time skill matching algorithms." 
              side="left" 
            />
            <TimelineItem 
              year="Beyond" 
              title="Singularity" 
              description="Developing neural-adaptive learning paths to achieve absolute personalized education." 
              side="right" 
            />
          </div>
        </div>
      </section>

      {/* Meet the Founder Section */}
      <section className="py-32 px-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative w-full"
          >
            <a href="/resume.pdf" target="_blank" rel="noreferrer" title="View Dossier" className="block relative z-10">
              <div className="rounded-[60px] overflow-hidden border-8 border-white/5 shadow-2xl group relative">
                <img src={founderImg} alt="Vibhu Suneja" className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
            
            <motion.div 
              initial={{ rotate: -10, opacity: 0 }}
              whileInView={{ rotate: 5, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute -bottom-10 -right-10 bg-white text-black p-10 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-8 border-[#000] hidden md:block z-20"
            >
              <div className="text-5xl font-black tracking-tighter font-['Outfit']">PRO</div>
              <div className="text-[9px] font-black uppercase tracking-[0.5em] mt-2 opacity-40">Direct Architect</div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-10"
          >
            <div className="space-y-4">
              <span className="text-blue-400 font-black uppercase tracking-[0.6em] text-[10px] block">Director Intelligence</span>
              <h2 className="text-5xl md:text-8xl font-black text-white leading-none font-['Outfit'] tracking-tighter italic">Vibhu Suneja</h2>
            </div>
            
            <h4 className="text-xl text-blue-300 font-bold uppercase tracking-[0.4em] font-['Outfit']">Architect & Founder</h4>
            
            <p className="text-white/40 text-xl leading-relaxed italic font-medium">
              "As a developer dedicated to the evolution of human logic, I founded this platform with a singular conviction: Education must transition from consumption to optimized production. We are building the neural bridge between theory and creation."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-10 items-start sm:items-center pt-6">
              <span className="text-white/20 font-black text-[10px] uppercase tracking-[0.6em]">Satellite Link:</span>
              <div className="flex gap-6">
                <a href="https://www.linkedin.com/in/vibhusuneja08" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-[24px] bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                  <FaLinkedin size={24} />
                </a>
                <a href="https://www.instagram.com/o_.vibhu._o" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-[24px] bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-48 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto bg-white/[0.01] border border-white/5 p-20 md:p-32 rounded-[60px] shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
          <FaQuoteLeft className="absolute -top-10 -left-10 text-white/[0.02] text-[300px] pointer-events-none group-hover:text-blue-500/[0.05] transition-colors" />
          
          <p className="text-3xl md:text-5xl font-black text-white mb-12 italic relative z-10 leading-[1.1] tracking-tighter font-['Outfit']">
            "Education is not the acquisition of data, but the optimization of the human processor. We are building the hardware for that evolution."
          </p>
          <div className="font-black text-blue-400 uppercase tracking-[0.6em] text-[11px] relative z-10"> — Vibhu Suneja, Directive 001 </div>
        </motion.div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default AboutPage;

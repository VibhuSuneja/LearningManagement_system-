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
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm transition-all hover:border-blue-500/50 group"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${color}-500/20 group-hover:bg-${color}-500/40 transition-all`}>
      <Icon className={`text-${color}-400 text-3xl`} />
    </div>
    <h3 className="text-white text-xl font-bold mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

const TimelineItem = ({ year, title, description, side }) => (
  <div className={`flex items-center justify-center w-full mb-12 flex-col ${side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
    <div className="w-full md:w-1/2 px-8 text-center md:text-right">
      {side === 'left' ? (
        <div className="md:pr-8">
          <span className="text-blue-400 font-bold text-lg mb-2 block">{year}</span>
          <h4 className="text-white text-xl font-bold mb-2">{title}</h4>
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </div>
      ) : <div className="hidden md:block" />}
    </div>
    <div className="w-4 h-4 rounded-full bg-blue-500 my-4 md:my-0 relative shrink-0">
      <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-25" />
    </div>
    <div className="w-full md:w-1/2 px-8 text-center md:text-left">
      {side === 'right' ? (
        <div className="md:pl-8">
          <span className="text-blue-400 font-bold text-lg mb-2 block">{year}</span>
          <h4 className="text-white text-xl font-bold mb-2">{title}</h4>
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </div>
      ) : <div className="hidden md:block" />}
    </div>
  </div>
);

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0a0a0c] min-h-screen">
      <Nav />
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            Since 2020
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight"
          >
            Reimagining Education for the <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent italic">AI Era</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
          >
            We are a mission-driven team of educators, engineers, and dreamers dedicated to building a smarter, more accessible future for learners worldwide.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <button 
              onClick={() => navigate('/allcourses')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-500/20"
            >
              Explore Courses <BiChevronRight className="text-2xl" />
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold border border-white/10 transition-all">
              Join Our Workforce
            </button>
          </motion.div>
        </div>
      </section>

      {/* Embedded About Section (The core UI component) */}
      <About />

      {/* Values Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Our Core Values</h2>
          <p className="text-gray-500 max-w-xl mx-auto">The principles that guide every feature we build and every course we deliver.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard 
            icon={FaGraduationCap} 
            title="Student First" 
            description="Every decision we make starts with how it benefits the learner's journey and success."
            color="blue"
          />
          <ValueCard 
            icon={BiRocket} 
            title="Rapid Innovation" 
            description="The world changes fast; our platform evolves even faster to keep you ahead of the curve."
            color="purple"
          />
          <ValueCard 
            icon={FaGlobeAmericas} 
            title="Global Access" 
            description="Breaking down geographical and economic barriers to top-tier technical education."
            color="indigo"
          />
          <ValueCard 
            icon={FaShieldAlt} 
            title="Integrity" 
            description="Maintaining the highest standards of educational quality and professional ethics."
            color="green"
          />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5 relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">The Journey So Far</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-[8px] md:left-1/2 md:-translate-x-1/2 w-[2px] h-full bg-white/10" />
            
            <TimelineItem 
              year="2020" 
              title="The Spark" 
              description="Founded in a small dorm room with a single vision: to fix online tech education." 
              side="left" 
            />
            <TimelineItem 
              year="2022" 
              title="Global Scale" 
              description="Reached 50k users across 12 countries and launched our first AI-tutor beta." 
              side="right" 
            />
            <TimelineItem 
              year="2024" 
              title="The AI Milestone" 
              description="Launched 2.0 with deep AI integration and real-time skill matching." 
              side="left" 
            />
            <TimelineItem 
              year="Today" 
              title="The Future" 
              description="Working on neural-adaptive learning paths to personalize education further." 
              side="right" 
            />
          </div>
        </div>
      </section>

      {/* Meet the Founder Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="relative z-10 rounded-[40px] overflow-hidden border-8 border-white/5 shadow-2xl">
              <img src={founderImg} alt="Vibhu Suneja" className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            {/* Lifelong Learner Badge */}
            <motion.div 
              initial={{ rotate: -10, opacity: 0 }}
              whileInView={{ rotate: 10, opacity: 1 }}
              className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-xl border border-white/20 hidden md:block z-20"
            >
              <div className="text-4xl font-black text-white">PRO</div>
              <div className="text-xs font-bold text-blue-100 uppercase tracking-widest mt-1">Lifelong Learner</div>
            </motion.div>
            {/* Decorative background blur */}
            <div className="absolute -inset-10 bg-blue-600/20 rounded-full blur-[100px] -z-10" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <span className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">Meet the Visionary</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Vibhu Suneja</h2>
            <h4 className="text-xl text-blue-300 font-semibold mb-8 uppercase tracking-widest">Ambitious CS Student & Founder</h4>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              "As an ambitious computer science student and a lifelong learner, I founded this platform with a simple belief: education should be about producing results, not just consuming content. I'm dedicated to building a bridge between classroom theory and real-world digital creation."
            </p>
            <div className="flex gap-6 items-center">
              <span className="text-white font-bold text-sm uppercase tracking-wider">Follow My Journey:</span>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/in/vibhusuneja08" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-blue-600 transition-all">
                  <FaLinkedin size={20} />
                </a>
                <a href="https://www.instagram.com/o_.vibhu._o" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-pink-600 transition-all">
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 p-12 rounded-[40px] shadow-2xl relative overflow-hidden"
        >

          <FaQuoteLeft className="absolute -top-4 -left-4 text-white/10 text-[160px] pointer-events-none" />
          <p className="text-2xl md:text-3xl font-medium text-white mb-8 italic relative z-10 leading-relaxed">
            "Education is not the learning of facts, but the training of the mind to think. We are building the gym for that training."
          </p>
          <div className="font-black text-blue-100 uppercase tracking-widest text-sm"> — Vibhu Suneja, Founder </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;

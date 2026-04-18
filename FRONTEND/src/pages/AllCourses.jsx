import React, { useEffect, useState } from 'react';
import Card from "../component/Card.jsx";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GiTireIronCross } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import Nav from '../component/Nav';
import Footer from '../component/Footer';
import ai from '../assets/SearchAi.png';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

function AllCourses() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);
  const { courseData } = useSelector(state => state.course);

  const toggleCategory = (catName) => {
    if (category.includes(catName)) {
      setCategory(prev => prev.filter(item => item !== catName));
    } else {
      setCategory(prev => [...prev, catName]);
    }
  };

  const applyFilter = () => {
    let courseCopy = courseData.slice();
    if (category.length > 0) {
      courseCopy = courseCopy.filter(item => category.includes(item.category));
    }
    setFilterCourses(courseCopy);
  };

  useEffect(() => {
    setFilterCourses(courseData);
  }, [courseData]);

  useEffect(() => {
    applyFilter();
  }, [category]);

  const categories = [
    'App Development', 'AI/ML', 'AI Tools', 'Data Science', 
    'Data Analytics', 'Ethical Hacking', 'UI UX Designing', 
    'Web Development', 'Others'
  ];

  return (
    <div className="min-h-screen bg-[#000] text-white selection:bg-white selection:text-black overflow-x-hidden font-['Inter']">
      <Nav />
      
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="flex flex-col md:flex-row relative max-w-[1920px] mx-auto w-full pt-[80px] min-h-[calc(100vh-70px)]">
        
        {/* Mobile Filters Toggle */}
        <button
          onClick={() => setIsSidebarVisible(prev => !prev)}
          className="fixed bottom-10 right-10 z-[100] bg-white text-black px-8 py-5 rounded-[24px] md:hidden flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(255,255,255,0.2)] active:scale-95 transition-all"
        >
          {isSidebarVisible ? <GiTireIronCross className="text-sm" /> : <span className="flex items-center gap-3">Parameters <img src={ai} className="w-5 h-5 rounded-full" alt="" /></span>}
        </button>

        {/* Backdrop for Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarVisible && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[80] md:hidden"
              onClick={() => setIsSidebarVisible(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`fixed md:sticky md:top-[80px] left-0 h-[calc(100vh-80px)] w-[85%] sm:w-[380px] md:w-[380px] bg-white/[0.01] backdrop-blur-3xl border-r border-white/5 p-6 md:p-12 overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[90]
          ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Selection Matrix</span>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-['Outfit']">Filters</h2>
                <button 
                  onClick={() => navigate("/")}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                >
                  <FaArrowLeftLong className="text-white/40 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="space-y-10">
              <div className="relative group/search">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl opacity-0 group-hover/search:opacity-100 transition-opacity" />
                <button 
                  className="w-full relative flex items-center justify-center gap-4 bg-white text-black py-5 md:py-6 rounded-[24px] font-black text-[11px] uppercase tracking-[0.25em] hover:bg-gray-100 active:scale-95 transition-all shadow-xl"
                  onClick={() => navigate("/search")}
                >
                  Synthesize with AI 
                  <img src={ai} className="w-6 h-6 rounded-full border border-black/10" alt="AI" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-3">
                  {categories.map((catName) => (
                    <motion.div 
                      key={catName}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        toggleCategory(catName);
                        if(window.innerWidth < 768) setIsSidebarVisible(false);
                      }}
                      className={`flex items-center gap-4 p-5 rounded-[24px] border transition-all duration-300 cursor-pointer group ${
                        category.includes(catName) 
                          ? 'border-white bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.15)]' 
                          : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-white/40'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${category.includes(catName) ? 'bg-black scale-125' : 'bg-white/10 group-hover:bg-white/40'}`} />
                      <span className={`text-[11px] font-bold uppercase tracking-widest ${category.includes(catName) ? 'text-black' : 'group-hover:text-white'}`}>
                        {catName}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-12 lg:p-16 xl:p-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="mb-16 md:mb-24 space-y-8"
          >
            <div className="space-y-4">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.6em] block">Resource Hub</span>
                <h1 className="text-5xl sm:text-6xl md:text-[5rem] lg:text-[7rem] font-black text-white uppercase tracking-tighter leading-[0.9] font-['Outfit']">
                Explore<br />
                <span className="text-white/10 hover:text-white transition-colors duration-1000 cursor-default">Knowledge</span>
                </h1>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="h-[1px] w-20 bg-gradient-to-r from-blue-500 to-transparent" />
              <p className="text-white/30 font-black text-[10px] uppercase tracking-[0.5em]">
                {filterCourses.length} Learning Vectors Detected
              </p>
            </div>
          </motion.div>

          {/* Optimized Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
            <AnimatePresence mode="popLayout">
              {filterCourses?.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.05,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  key={item._id || index}
                  className="flex justify-center"
                >
                  <Card 
                    thumbnail={item.thumbnail} 
                    title={item.title} 
                    price={item.price} 
                    category={item.category} 
                    id={item._id} 
                    reviews={item.reviews} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filterCourses.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full py-32 md:py-56 flex flex-col items-center justify-center text-center space-y-10"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[40px] bg-white/[0.02] backdrop-blur-3xl flex items-center justify-center text-5xl md:text-6xl border border-white/5 relative group">
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">🔍</span>
                </div>
                <div className="space-y-4 px-6">
                    <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Zero Resonance</h3>
                    <p className="text-white/40 font-medium max-w-sm text-base leading-relaxed mx-auto italic">Our neural filters couldn't find any synchronicity with your current parameters.</p>
                </div>
                <button 
                  onClick={() => setCategory([])}
                  className="px-12 py-5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-gray-100"
                >
                  Reset Parameters
                </button>
              </motion.div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AllCourses;



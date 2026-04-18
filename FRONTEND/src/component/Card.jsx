import React from 'react';
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Card({ thumbnail, title, category, price, id, reviews }) {
  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAvgReview(reviews);
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-full sm:max-w-[360px] bg-white/[0.02] backdrop-blur-2xl rounded-[32px] overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer shadow-2xl group relative'
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-[80px] rounded-full group-hover:bg-white/10 transition-colors duration-500" />
      
      <div className="relative overflow-hidden h-56">
        <img 
          src={thumbnail} 
          alt={title} 
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out' 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent opacity-80" />
        
        {/* Category Tag */}
        <div className="absolute top-5 left-5">
          <span className='px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-lg'>
            {category}
          </span>
        </div>
      </div>

      <div className='p-8 space-y-6 relative'>
        <h2 className='text-2xl font-black text-white tracking-tighter leading-[1.1] line-clamp-2 min-h-[3.5rem] group-hover:text-blue-400 transition-colors duration-300'>
          {title}
        </h2>

        <div className='flex items-center justify-between border-t border-white/5 pt-6'>
          <div className="flex flex-col gap-1">
            <span className='text-[9px] text-white/30 uppercase font-black tracking-[0.3em]'>Investment</span>
            <span className='text-2xl font-black text-white tracking-tighter'>₹{price}</span>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <span className='text-[9px] text-white/30 uppercase font-black tracking-[0.3em]'>Expertise</span>
            <div className='flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10'>
              <FaStar className='text-yellow-500 text-xs mb-0.5' />
              <span className='text-xs font-black text-white'>{avgRating}</span>
            </div>
          </div>
        </div>
        
        <div className="relative group/btn">
            <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity rounded-2xl" />
            <button className="w-full relative py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-gray-100 transition-all duration-300 active:scale-[0.97]">
              Engage Curriculum
            </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Card;

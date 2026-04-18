import React from 'react'
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { motion } from 'framer-motion'

function Logos() {
  const categories = [
    { icon: <MdCastForEducation />, label: "20k+ Online Courses" },
    { icon: <SiOpenaccess />, label: "Lifetime Access" },
    { icon: <FaSackDollar />, label: "Value For Money" },
    { icon: <BiSupport />, label: "Lifetime Support" },
    { icon: <FaUsers />, label: "Community Support" },
  ];

  return (
    <div className='w-full py-12 px-6 flex items-center justify-center flex-wrap gap-4 md:gap-8'>
      {categories.map((item, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className='flex items-center justify-center gap-3 px-6 py-4 rounded-[24px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-all group'
        >
          <div className='text-3xl text-white/70 group-hover:scale-110 transition-transform duration-300'>
            {item.icon}
          </div>
          <span className='text-sm font-bold text-white/60 tracking-tight group-hover:text-white transition-colors'>
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

export default Logos
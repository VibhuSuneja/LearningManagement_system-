import React, { use } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6"
import { useNavigate } from 'react-router-dom';
function EditCourse() {
  const navigate = useNavigate()
  return (
    <div className='max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md'>
            {/* top bar */}
      <div className='flex items-center justify-center gap-[20px] md:justify-between flex-col md:flex-row mb-6 relative '>
      <FaArrowLeftLong className='top-[20%] md:top-[20%] absolute left-[0] md:left-[2%] w-[22px] h-[22px] cursor-pointer'  onClick={()=>navigate("/courses")}/>
        <h2 className='text-2xl font-semibold md:pl-[60px]'>
          Add Detailed Information Regarding the Course
        </h2>
        <div className='space-x-2 space-y-2'>
          <button className='bg-black text-white px-4 py-2 
          rounded-md '>Go to Lecture page  </button>
          </div>

      </div>

      {/* form details  */}
      <div className='bg-gray-50 p-6 rounded-md'>
        <h2 className='text-lg font-medium mb-4'>Basic Course Information</h2>
        <div className='space-x-2 space-y-2 '>
        <button className='bg-green-100 text-green-600 px-4 py-2 rounded-md border-1'>Click to Publish</button>
        <button className='bg-red-600 text-white px-4 py-2 rounded-md '>Remove Course</button>
        </div>

      </div>
    </div>
  )
}

export default EditCourse
import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
function CreateCourses() {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10'>
      <div className='max-w-xl w-[600px] mx-auto p-6 bg-white shadow-md rounded-md mt-10 relative'>
        <FaArrowLeftLong className='top-[8%] absolute left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/courses")}/>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Create Course</h2>

        <form action="space-y-5"><div>
          <label htmlFor="title" className='block text-sm font-medium text-gray-700 mb-1'>Course Title</label>
          <input type="text" id='title' placeholder='Enter course title' className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[black]'/>

          </div>
          </form>
      </div>

    </div>
  )
}

export default CreateCourses
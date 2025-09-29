import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
function Courses() {
    const navigate = useNavigate();
  return (
    <div className='flex min-h-screen bg-gray-100'>


        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3'>

        <div className='flex items-center justify-center gap-3'>
        <FaArrowLeftLong className='w-[22px] h-[22px] cursor-pointer' onClick={() => navigate("/dashboard")} />
        <h1 className="text-2xl font-semibold">All  Created Courses</h1>
        </div>
        <button className='bg-[black] text-white px-4 py-2 rounded hover:bg-gray-500'>Create Course</button>
        </div>

        {/* for Large Screen Table  */}
        <div>

        </div>




        {/* for Small Screen Table  */}
        <div>

        </div>
    </div>
  )
}

export default Courses
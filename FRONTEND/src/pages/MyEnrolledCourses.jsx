import React  from 'react'

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoVideocamOutline } from "react-icons/io5";

function MyEnrolledCourse() {
  const navigate = useNavigate()

  const { userData } = useSelector((state) => state.user);

     
   
 

  return (
    <div className="min-h-screen w-full px-4 py-9 bg-gray-50">
      

      <FaArrowLeftLong  className='absolute top-[3%] md:top-[6%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>
      <h1 className="text-3xl text-center font-bold text-gray-800 mb-6  ">
        My Enrolled Courses
      </h1>

      {userData.enrolledCourses.length === 0 ? (
        <p className="text-gray-500 text-center w-full">You haven’t enrolled in any course yet.</p>
      ) : (
        <div className="flex items-center justify-center flex-wrap gap-[30px]">
          {userData.enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border "
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{course?.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{course?.category}</p>
                <p className="text-sm text-gray-700">{course?.level}</p>
                <div className="flex flex-col gap-2 mt-[15px]">
                  <button className='w-full py-[10px] bg-black text-white rounded-[10px] text-[15px] font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2' onClick={()=>navigate(`/viewlecture/${course._id}`)}>
                    Watch Now
                  </button>
                  <button className='w-full py-[10px] bg-red-600 text-white rounded-[10px] font-bold text-[15px] hover:bg-red-700 transition-all flex items-center justify-center gap-2' onClick={()=>navigate(`/live/${course._id}`)}>
                    <IoVideocamOutline size={18} /> Live Sessions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyEnrolledCourse

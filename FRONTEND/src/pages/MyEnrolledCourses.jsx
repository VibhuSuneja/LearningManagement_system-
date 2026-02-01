import React  from 'react'

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoVideocamOutline } from "react-icons/io5";
import useGetCurrentUser from '../customHooks/getCurrentUser';
import axios from 'axios';
import { serverUrl } from '../App';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
 
function MyEnrolledCourse() {
  const navigate = useNavigate()
  useGetCurrentUser();
 
  const { userData } = useSelector((state) => state.user);
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverallProgress();
  }, []);

  const fetchOverallProgress = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/progress/my-progress`, {
        withCredentials: true
      });
      setProgressData(response.data.progressRecords);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching project:", error);
      setLoading(false);
    }
  };

  const getCourseProgress = (courseId) => {
    const record = progressData.find(p => p.course._id === courseId || p.course === courseId);
    return record ? record.completionPercentage : 0;
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex justify-center items-center'>
        <ClipLoader size={50} color='#000' />
      </div>
    );
  }

     
   
 

  return (
    <div className="min-h-screen w-full px-4 py-9 bg-gray-50">
      

      <FaArrowLeftLong  className='absolute top-[3%] md:top-[6%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>
      <h1 className="text-3xl text-center font-bold text-gray-800 mb-2">
        My Enrolled Courses
      </h1>
      <p className="text-center text-gray-500 mb-8 font-medium">Continue where you left off</p>

      {/* Stats Summary */}
      {stats && (
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Enrolled', value: stats.totalCourses, color: 'blue' },
            { label: 'Completed', value: stats.completedCourses, color: 'green' },
            { label: 'In Progress', value: stats.inProgressCourses, color: 'yellow' },
            { label: 'Average', value: `${stats.averageCompletion}%`, color: 'indigo' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
              <p className="text-sm font-semibold text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-black text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

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
                <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{course?.title}</h2>
                <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">{course?.category}</p>
                
                {/* Progress Bar */}
                <div className="mt-4 mb-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-gray-500">Course Progress</span>
                    <span className="text-[11px] font-bold text-blue-600">{getCourseProgress(course._id)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getCourseProgress(course._id)}%` }}
                    ></div>
                  </div>
                </div>
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

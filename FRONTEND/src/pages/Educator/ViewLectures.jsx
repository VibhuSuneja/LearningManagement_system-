import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import QuizList from '../../component/QuizList';

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const {userData} = useSelector((state) => state.user)
  const selectedCourse = courseData?.find((course) => course._id === courseId);
    const[creatorData,setCreatorData] =useState(null)
  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null
  );
  const [activeTab, setActiveTab] = useState('lectures'); // 'lectures' or 'quizzes'
  const navigate = useNavigate()
  const courseCreator = userData?._id === selectedCourse?.creator ? userData : null;


    useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            serverUrl + "/api/course/creator",
            { userId: selectedCourse.creator._id },
            { withCredentials: true }
          );
          setCreatorData(result.data);
          console.log(result.data);
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };
    handleCreator();
  }, [selectedCourse]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
     
      {/* Left - Video & Course Info */}
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        {/* Course Details */}
        <div className="mb-6" >
           
          <h2 className="text-2xl font-bold flex items-center justify-start gap-[20px]  text-gray-800"><FaArrowLeftLong  className=' text-black w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>{selectedCourse?.title}</h2>
          
          <div className="mt-2 flex gap-4 text-sm text-gray-500 font-medium">
            <span>Category: {selectedCourse?.category}</span>
            <span>Level: {selectedCourse?.level}</span>
          </div>
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300">
          {selectedLecture?.videoUrl ? (
            <video
              src={selectedLecture.videoUrl}
              controls
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Select a lecture to start watching
            </div>
          )}
        </div>

        {/* Selected Lecture Info */}
        <div className="mt-2">
          <h2 className="text-lg font-semibold text-gray-800">{selectedLecture?.lectureTitle}</h2>
          
        </div>
      </div>

      {/* Right - Tabs: Lectures & Quizzes + Creator Info */}
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit">
        
        {/* Tabs */}
        <div className='flex gap-2 mb-4 border-b border-gray-200'>
          <button
            onClick={() => setActiveTab('lectures')}
            className={`px-4 py-2 font-semibold border-b-2 transition-all ${
              activeTab === 'lectures'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Lectures
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2 font-semibold border-b-2 transition-all ${
              activeTab === 'quizzes'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Quizzes
          </button>
        </div>

        {/* Lectures Tab Content */}
        {activeTab === 'lectures' && (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">All Lectures</h2>
            <div className="flex flex-col gap-3 mb-6">
              {selectedCourse?.lectures?.length > 0 ? (
                selectedCourse.lectures.map((lecture, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLecture(lecture)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition text-left ${
                      selectedLecture?._id === lecture._id
                        ? 'bg-gray-200 border-gray-500'
                        : 'hover:bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{lecture.lectureTitle}</h4>
                      
                    </div>
                    <FaPlayCircle className="text-black text-xl" />
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No lectures available.</p>
              )}
            </div>
          </>
        )}

        {/* Quizzes Tab Content */}
        {activeTab === 'quizzes' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Course Quizzes</h2>
            <QuizList courseId={courseId} />
          </div>
        )}

        {/* Creator Info */}
        {creatorData && (
  <div className="mt-4 border-t pt-4">
    <h3 className="text-md font-semibold text-gray-700 mb-3">Educator</h3>
    <div className="flex items-center gap-4">
      <img
        src={creatorData?.photoUrl || '/default-avatar.png'}
        alt="Instructor"
        className="w-14 h-14 rounded-full object-cover border"
      />
      <div>
        <h4 className="text-base font-medium text-gray-800">{creatorData.name}</h4>
        <p className="text-sm text-gray-600">
          {creatorData?.description || 'No bio available.'}
        </p>
        <p className="text-sm text-gray-600">{creatorData?.email}</p>
      </div>
    </div>
  </div>
        )}
      </div>
    </div>
  );
}

export default ViewLecture;

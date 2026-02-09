import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle, FaCheckCircle, FaRegCircle, FaDownload, FaComments, FaBook, FaChevronRight, FaSun, FaMoon } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../../App';
import QuizList from '../../component/QuizList';
import AssignmentList from '../../component/AssignmentList';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import CertificateDownload from '../../component/CertificateDownload';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

function ViewLecture() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);
  const selectedCourse = courseData?.find((course) => course._id === courseId);
  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null
  );
  const [lectureDurations, setLectureDurations] = useState({});
  const [activeTab, setActiveTab] = useState('lectures'); // 'lectures', 'quizzes', 'assignments', 'chat'
  const [progress, setProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [showResources, setShowResources] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProgress();
  }, [courseId]);

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/progress/course/${courseId}`, {
        withCredentials: true
      });
      setProgress(response.data.progress);
      setLoadingProgress(false);
    } catch (error) {
      console.error("Error fetching progress:", error);
      setLoadingProgress(false);
    }
  };

  const toggleLectureCompletion = async (lectureId) => {
    try {
      const isCompleted = progress?.completedLectures.some(cl => cl.lecture._id === lectureId || cl.lecture === lectureId);
      
      if (isCompleted) {
        const response = await axios.delete(
          `${serverUrl}/api/progress/course/${courseId}/lecture/${lectureId}/complete`,
          { withCredentials: true }
        );
        setProgress(response.data.progress);
        toast.info("Lecture marked as incomplete");
      } else {
        const response = await axios.post(
          `${serverUrl}/api/progress/course/${courseId}/lecture/${lectureId}/complete`,
          {},
          { withCredentials: true }
        );
        setProgress(response.data.progress);
        toast.success("Lecture marked as complete! 🎓");
      }
    } catch (error) {
      console.error("Error toggling completion:", error);
      toast.error("Failed to update progress");
    }
  };

  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        const userId = selectedCourse.creator._id || selectedCourse.creator;
        try {
          const result = await axios.post(
            serverUrl + "/api/course/creator",
            { userId },
            { withCredentials: true }
          );
          setCreatorData(result.data);
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };
    handleCreator();
  }, [selectedCourse]);

  if (loadingProgress) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-[#0F172A]' : 'bg-gray-50'}`}>
        <ClipLoader color="#6366F1" size={50} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0F172A] text-gray-100' : 'bg-white text-gray-900'} font-inter overflow-x-hidden`}>
      {/* Dynamic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden z-0">
        <div className={`absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] ${isDarkMode ? 'bg-[#6366F1]' : 'bg-indigo-200 opacity-40'}`}></div>
        <div className={`absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] ${isDarkMode ? 'bg-indigo-900' : 'bg-blue-100 opacity-30'}`}></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Header & Meta */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/")}
                className={`p-3 border rounded-full transition-all group ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-gray-100 hover:bg-gray-200 border-gray-200'}`}
              >
                <FaArrowLeftLong className={`${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`} />
              </button>
              <div>
                <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDarkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400' : 'text-gray-900'}`}>
                  {selectedCourse?.title}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-sm font-medium">
                  <span className={`px-2 py-0.5 rounded-md border ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                    {selectedCourse?.category}
                  </span>
                  <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{selectedCourse?.level}</span>
                </div>
              </div>
            </div>

            {/* Actions: Theme Toggle & Progress */}
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className={`p-3 rounded-2xl transition-all shadow-lg flex items-center justify-center border ${
                  isDarkMode 
                  ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' 
                  : 'bg-white border-gray-200 text-indigo-600 hover:bg-gray-50'
                }`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
              </button>

              {progress && (
                <div className={`flex items-center gap-4 backdrop-blur-md border p-2 pr-6 rounded-3xl shadow-xl transition-all ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'
                }`}>
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className={isDarkMode ? 'text-white/5' : 'text-gray-100'} />
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 20}
                        strokeDashoffset={2 * Math.PI * 20 * (1 - progress.completionPercentage / 100)}
                        className="text-indigo-500 transition-all duration-1000" 
                      />
                    </svg>
                    <span className={`absolute text-[10px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{Math.round(progress.completionPercentage)}%</span>
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Progress</p>
                    <p className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{progress.completedLectures.length}/{selectedCourse?.lectures?.length} Completed</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Achievement & Certification (Main Column) */}
          {Math.round(progress?.completionPercentage || 0) >= 100 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[32px] bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-900/30 rounded-full blur-2xl" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Course Accomplished
                  </div>
                  <h3 className="text-3xl font-black tracking-tight mb-2">You're Officially Certified!</h3>
                  <p className="text-indigo-100 text-sm max-w-md">
                    Outstanding work. You've mastered all modules and assessments in this course. Download your premium certificate to showcase your expertise.
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <CertificateDownload 
                    studentName={userData?.name}
                    courseTitle={selectedCourse?.title}
                    date={new Date(progress?.completedAt || Date.now()).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                    certificateId={`LMS-${(courseId || "").slice(-4)}-${(userData?._id || "").slice(-4)}`.toUpperCase()}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Cinematic Video Player Section */}
          <div className="relative group">
            <div className={`aspect-video rounded-3xl overflow-hidden border shadow-2xl backdrop-blur-sm relative transition-all ${
              isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-100 border-gray-200'
            }`}>
              {selectedLecture?.videoUrl ? (
                <video
                  src={selectedLecture.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  crossOrigin="anonymous"
                  onLoadedMetadata={(e) => {
                    const seconds = Math.floor(e.target.duration);
                    const h = Math.floor(seconds / 3600);
                    const m = Math.floor((seconds % 3600) / 60);
                    const s = seconds % 60;
                    const durationStr = h > 0 
                      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` 
                      : `${m}:${String(s).padStart(2, '0')}`;
                    
                    setLectureDurations(prev => ({
                      ...prev,
                      [selectedLecture._id]: durationStr
                    }));
                  }}
                />
              ) : (
                <div className={`flex flex-col items-center justify-center h-full gap-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center animate-pulse ${isDarkMode ? 'bg-white/5 text-white/20' : 'bg-gray-200 text-gray-300'}`}>
                    <FaPlayCircle size={40} />
                  </div>
                  <p className="text-lg font-medium">Select a lecture to begin your journey</p>
                </div>
              )}
            </div>
            <div className={`absolute -inset-4 rounded-[40px] blur-2xl -z-10 transition-all duration-500 ${
              isDarkMode 
              ? 'bg-indigo-500/10 group-hover:bg-indigo-500/20' 
              : 'bg-indigo-100/30 group-hover:bg-indigo-200/40'
            }`}></div>
          </div>

          {/* Lecture Info & Actions */}
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-center p-8 backdrop-blur-xl border rounded-3xl shadow-xl gap-6 transition-all ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'
          }`}>
            <div className="max-w-xl">
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedLecture?.lectureTitle}</h2>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Dive deep into this module. Complete the lecture to unlock associated materials and track your course mastery.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowResources(!showResources)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all border ${
                  isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-200' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <FaDownload /> <span className="hidden sm:inline">Resources</span>
              </button>
              
              {selectedLecture && (
                <button
                  onClick={() => toggleLectureCompletion(selectedLecture._id)}
                  className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg ${
                    progress?.completedLectures.some(cl => cl.lecture._id === selectedLecture._id || cl.lecture === selectedLecture._id)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                      : 'bg-[#6366F1] text-white hover:bg-indigo-600 shadow-indigo-500/20'
                  }`}
                >
                  {progress?.completedLectures.some(cl => cl.lecture._id === selectedLecture._id || cl.lecture === selectedLecture._id) ? (
                    <><FaCheckCircle /> Completed</>
                  ) : (
                    <>Mark as complete</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className={`backdrop-blur-md border rounded-3xl overflow-hidden shadow-xl transition-all ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'
          }`}>
            <div className={`flex border-b px-6 overflow-x-auto no-scrollbar ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              {['lectures', 'quizzes', 'assignments', 'chat'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-5 font-bold text-sm uppercase tracking-widest transition-all relative whitespace-nowrap ${
                    activeTab === tab 
                    ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-600') 
                    : (isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700')
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'lectures' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCourse?.lectures?.map((lecture, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedLecture(lecture)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                        selectedLecture?._id === lecture._id
                          ? (isDarkMode ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg' : 'bg-indigo-50 border-indigo-200 shadow-md')
                          : (isDarkMode ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-gray-50 border-gray-100 hover:border-gray-200')
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          selectedLecture?._id === lecture._id 
                          ? 'bg-indigo-500 text-white shadow-lg' 
                          : (isDarkMode ? 'bg-white/5 text-gray-500' : 'bg-white text-gray-400 border border-gray-100')
                        }`}>
                          {progress?.completedLectures.some(cl => cl.lecture._id === lecture._id || cl.lecture === lecture._id) ? (
                            <FaCheckCircle />
                          ) : (
                            <span className="text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
                          )}
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold transition-colors ${
                            selectedLecture?._id === lecture._id 
                            ? 'text-white-900' 
                            : (isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900')
                          }`}>
                            {lecture.lectureTitle}
                          </h4>
                          <p className={`text-[10px] uppercase tracking-tighter mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {lecture.duration || lectureDurations[lecture._id] || "Video Module"}
                          </p>
                        </div>
                      </div>
                      <FaChevronRight size={12} className={`${selectedLecture?._id === lecture._id ? 'text-indigo-500' : 'text-gray-400'}`}/>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'quizzes' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <QuizList courseId={courseId} isDarkMode={isDarkMode} />
                </div>
              )}

              {activeTab === 'assignments' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AssignmentList courseId={courseId} isDarkMode={isDarkMode} />
                </div>
              )}
              
              {activeTab === 'chat' && (
                <div className={`min-h-[300px] flex flex-col items-center justify-center text-center gap-4 rounded-3xl border border-dashed transition-all ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`p-4 rounded-full ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-500'}`}>
                    <FaComments size={30} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Live Discussion</h3>
                    <p className={`text-sm max-w-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Connect with other students and the educator in real-time.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/chat')}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Enable Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Sidebar */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6">
          {creatorData && (
            <div className={`backdrop-blur-xl border rounded-3xl p-6 shadow-xl relative overflow-hidden group transition-all ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'
            }`}>
              <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${isDarkMode ? 'text-white' : 'text-indigo-900'}`}>
                <FaBook size={80} />
              </div>
              <h3 className={`text-xs font-black uppercase tracking-widest mb-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Master Instructor</h3>
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <img
                    src={creatorData?.photoUrl || 'https://via.placeholder.com/150'}
                    alt="Instructor"
                    className="w-16 h-16 rounded-2xl object-cover border-2 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 rounded-full border-white dark:border-[#0F172A]"></div>
                </div>
                <div>
                  <h4 className={`text-lg font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{creatorData.name}</h4>
                  <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{creatorData?.email}</p>
                </div>
              </div>
              <p className={`mt-4 text-sm leading-relaxed italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                "{creatorData?.description || 'Learn from the best to become the best in your field.'}"
              </p>
              
              <button 
                onClick={() => navigate(`/profile/${creatorData._id || (selectedCourse.creator._id || selectedCourse.creator)}`)}
                className={`w-full mt-6 py-3 border rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
              }`}>
                View Profile
              </button>
            </div>
          )}

          <div className={`backdrop-blur-xl border rounded-3xl p-6 shadow-xl flex-1 flex flex-col transition-all ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'
          }`}>
            <h3 className={`text-xs font-black uppercase tracking-widest mb-6 flex justify-between items-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <span>Course Syllabus</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>{selectedCourse?.lectures?.length} {selectedCourse?.lectures?.length === 1 ? 'Module' : 'Modules'}</span>
            </h3>
            
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {selectedCourse?.lectures?.map((lecture, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedLecture(lecture)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer group flex items-start gap-4 ${
                    selectedLecture?._id === lecture._id
                      ? (isDarkMode ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-indigo-50 border-indigo-200')
                      : 'border-transparent hover:border-white/10 active:scale-95'
                  }`}
                >
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    selectedLecture?._id === lecture._id 
                    ? 'bg-indigo-500 text-white shadow-lg' 
                    : (isDarkMode ? 'bg-white/10 text-gray-500' : 'bg-gray-100 text-gray-400')
                  }`}>
                    {progress?.completedLectures.some(cl => cl.lecture._id === lecture._id || cl.lecture === lecture._id) ? (
                      <FaCheckCircle />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate transition-colors ${
                      selectedLecture?._id === lecture._id 
                      ? (isDarkMode ? 'text-white' : 'text-gray-900') 
                      : (isDarkMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-500 group-hover:text-gray-900')
                    }`}>
                      {lecture.lectureTitle}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`text-[10px] uppercase ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                         {lecture.duration || lectureDurations[lecture._id] || "Lecture"}
                       </span>
                       {selectedLecture?._id === lecture._id && <span className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resources Sliding Drawer */}
      <AnimatePresence>
        {showResources && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResources(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 h-full w-full max-w-md border-l z-[101] shadow-2xl p-8 flex flex-col transition-all ${
                isDarkMode ? 'bg-[#0F172A] border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className={`text-2xl font-black ${isDarkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500' : 'text-gray-900'}`}>Lecture Materials</h2>
                <button onClick={() => setShowResources(false)} className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto">
                {selectedCourse?.syllabusUrl ? (
                  <div 
                    onClick={() => window.open(selectedCourse.syllabusUrl, '_blank')}
                    className={`p-4 border rounded-2xl flex items-center justify-between group cursor-pointer transition-all ${
                      isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
                        <FaBook size={20} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Course_Syllabus.pdf</h4>
                        <p className="text-xs text-gray-500">Document • PDF</p>
                      </div>
                    </div>
                    <FaDownload className="text-gray-500 group-hover:text-indigo-500 transition-colors" />
                  </div>
                ) : (
                  <div className={`p-10 border-2 border-dashed rounded-3xl text-center flex flex-col items-center gap-4 ${
                    isDarkMode ? 'border-white/5 bg-white/2' : 'border-gray-100 bg-gray-50'
                  }`}>
                    <div className="p-4 bg-gray-500/10 rounded-full text-gray-500 opacity-50">
                      <FaBook size={30} />
                    </div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      No downloadable resources attached to this lecture yet.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-10 border-t border-white/10">
                <p className="text-xs text-center text-gray-600">
                  All materials are property of the course creator. Please respect copyright guidelines.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100, 100, 100, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.4); }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}

export default ViewLecture;

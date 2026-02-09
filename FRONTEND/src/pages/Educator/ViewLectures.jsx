import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle, FaCheckCircle, FaRegCircle, FaDownload, FaComments, FaBook, FaChevronRight } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../../App';
import QuizList from '../../component/QuizList';
import AssignmentList from '../../component/AssignmentList';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import CertificateDownload from '../../component/CertificateDownload';
import { motion, AnimatePresence } from 'framer-motion';

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);
  const selectedCourse = courseData?.find((course) => course._id === courseId);
  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null
  );
  const [activeTab, setActiveTab] = useState('lectures'); // 'lectures', 'quizzes', 'assignments', 'chat', 'resources'
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
        try {
          const result = await axios.post(
            serverUrl + "/api/course/creator",
            { userId: selectedCourse.creator._id || selectedCourse.creator },
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
      <div className="flex items-center justify-center min-h-screen bg-[#0F172A]">
        <ClipLoader color="#6366F1" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100 font-inter overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#6366F1] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-900 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Header & Meta */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/")}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
              >
                <FaArrowLeftLong className="text-gray-400 group-hover:text-white transition-colors" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
                  {selectedCourse?.title}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-400 font-medium">
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-md border border-indigo-500/20">{selectedCourse?.category}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>{selectedCourse?.level}</span>
                </div>
              </div>
            </div>

            {/* Progress Visualization */}
            {progress && (
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-2 pr-6 rounded-full shadow-xl">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" 
                      strokeDasharray={2 * Math.PI * 20}
                      strokeDashoffset={2 * Math.PI * 20 * (1 - progress.completionPercentage / 100)}
                      className="text-indigo-500 transition-all duration-1000" 
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold">{progress.completionPercentage}%</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-100">Progress</p>
                  <p className="text-[10px] text-gray-400">{progress.completedLectures.length}/{selectedCourse?.lectures?.length} Completed</p>
                </div>
              </div>
            )}
          </div>

          {/* Cinematic Video Player Section */}
          <div className="relative group">
            <div className="aspect-video bg-black/40 rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm relative">
              {selectedLecture?.videoUrl ? (
                <video
                  src={selectedLecture.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                    <FaPlayCircle size={40} className="text-white/20" />
                  </div>
                  <p className="text-lg font-medium">Select a lecture to begin your journey</p>
                </div>
              )}
              
              {/* Mid-lecture Quiz Overlay (Conditional Placeholder logic) */}
              <AnimatePresence>
                {/* Example trigger for quiz overlay can be added here */}
              </AnimatePresence>
            </div>
            
            {/* Glow effect behind player */}
            <div className="absolute -inset-4 bg-indigo-500/10 rounded-[40px] blur-2xl -z-10 group-hover:bg-indigo-500/20 transition-all duration-500"></div>
          </div>

          {/* Lecture Info & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-white mb-2">{selectedLecture?.lectureTitle}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Dive deep into this module. Complete the lecture to unlock associated materials and track your course mastery.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowResources(!showResources)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200"
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

          {/* Tabs Section - Modern Glassmorphism */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="flex border-b border-white/10 px-6 overflow-x-auto no-scrollbar">
              {['lectures', 'quizzes', 'assignments', 'chat'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-5 font-bold text-sm uppercase tracking-widest transition-all relative whitespace-nowrap ${
                    activeTab === tab ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
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
                          ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          selectedLecture?._id === lecture._id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-500'
                        }`}>
                          {progress?.completedLectures.some(cl => cl.lecture._id === lecture._id || cl.lecture === lecture._id) ? (
                            <FaCheckCircle />
                          ) : (
                            <span className="text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
                          )}
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold ${
                            selectedLecture?._id === lecture._id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                          }`}>
                            {lecture.lectureTitle}
                          </h4>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">Video Module • 12:45</p>
                        </div>
                      </div>
                      <FaChevronRight size={12} className={`${selectedLecture?._id === lecture._id ? 'text-indigo-500' : 'text-gray-600'}`}/>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'quizzes' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <QuizList courseId={courseId} isDarkMode={true} />
                </div>
              )}

              {activeTab === 'assignments' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AssignmentList courseId={courseId} isDarkMode={true} />
                </div>
              )}
              
              {activeTab === 'chat' && (
                <div className="min-h-[300px] flex flex-col items-center justify-center text-center gap-4 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <div className="p-4 bg-indigo-500/10 rounded-full text-indigo-400">
                    <FaComments size={30} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-100">Live Discussion</h3>
                    <p className="text-sm text-gray-500 max-w-xs mt-1">Connect with other students and the educator in real-time.</p>
                  </div>
                  <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all">
                    Enable Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Sidebar */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6">
          
          {/* Educator Card */}
          {creatorData && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FaBook size={80} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6">Master Instructor</h3>
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <img
                    src={creatorData?.photoUrl || 'https://via.placeholder.com/150'}
                    alt="Instructor"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-[#0F172A] rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white leading-tight">{creatorData.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{creatorData?.email}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-400 leading-relaxed italic">
                "{creatorData?.description || 'Learn from the best to become the best in your field.'}"
              </p>
              
              <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all">
                View Profile
              </button>
            </div>
          )}

          {/* Compact Playlist Sidebar */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6 flex justify-between items-center">
              <span>Course Syllabus</span>
              <span className="px-2 py-0.5 bg-white/5 rounded text-[10px]">{selectedCourse?.lectures?.length} Modules</span>
            </h3>
            
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {selectedCourse?.lectures?.map((lecture, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedLecture(lecture)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer group flex items-start gap-4 ${
                    selectedLecture?._id === lecture._id
                      ? 'bg-indigo-500/10 border-indigo-500/50'
                      : 'bg-white/5 border-transparent hover:border-white/10 active:scale-95'
                  }`}
                >
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    selectedLecture?._id === lecture._id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/10 text-gray-500'
                  }`}>
                    {progress?.completedLectures.some(cl => cl.lecture._id === lecture._id || cl.lecture === lecture._id) ? (
                      <FaCheckCircle />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate ${
                      selectedLecture?._id === lecture._id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                    }`}>
                      {lecture.lectureTitle}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] text-gray-600 uppercase">12m 45s</span>
                       {selectedLecture?._id === lecture._id && <span className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement Widget */}
            {progress?.completionPercentage === 100 && (
              <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl text-center shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <span className="text-xs font-black uppercase tracking-widest text-white/70">Course Completed</span>
                  <h4 className="text-xl font-black text-white mt-1 mb-4">You're Certified!</h4>
                  <CertificateDownload 
                      studentName={userData?.name}
                      courseTitle={selectedCourse?.title}
                      date={new Date(progress?.completedAt || Date.now()).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                      certificateId={`LMS-${courseId.substr(-4)}-${userData?._id?.substr(-4)}`.toUpperCase()}
                  />
                </div>
              </div>
            )}
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
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0F172A] border-l border-white/10 z-[101] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Lecture Materials</h2>
                <button onClick={() => setShowResources(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
                      <FaBook size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-100">Lecture_Slides.pdf</h4>
                      <p className="text-xs text-gray-500">Document • 4.2 MB</p>
                    </div>
                  </div>
                  <FaDownload className="text-gray-500 group-hover:text-indigo-500 transition-colors" />
                </div>
                
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
                      <FaBook size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-100">Starter_Code.zip</h4>
                      <p className="text-xs text-gray-500">Archive • 15.8 MB</p>
                    </div>
                  </div>
                  <FaDownload className="text-gray-500 group-hover:text-indigo-500 transition-colors" />
                </div>
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.2); }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}

export default ViewLecture;

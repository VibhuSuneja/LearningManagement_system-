import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong, FaStar, FaArrowRight } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { setSelectedCourse } from '../redux/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaLock, FaPlayCircle, FaComments, FaAward, FaCalendarAlt } from "react-icons/fa";
import { IoVideocamOutline } from "react-icons/io5";
import { serverUrl } from '../App';
import img from "../assets/empty.jpg"
import axios from 'axios';
import Card from '../component/Card';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useSocketContext } from '../context/SocketContext';
import Nav from '../component/Nav';
import Footer from '../component/Footer';
import CertificateDownload from '../component/CertificateDownload';
import { motion, AnimatePresence } from 'framer-motion';


function ViewCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courseData, selectedCourse } = useSelector(state => state.course);
  const { userData } = useSelector(state => state.user);
  const { socket } = useSocketContext();
  const dispatch = useDispatch();

  const [courseProgress, setCourseProgress] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (socket && courseId) {
      socket.emit("joinCourse", courseId);
      return () => socket.emit("leaveCourse", courseId);
    }
  }, [socket, courseId]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourses, setCreatorCourses] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating,setRating] = useState(0)
  const [comment,setComment] = useState("")
  const [loading,setLoading] = useState(false)
  const fetchCourseData = async () => {
    const course = courseData.find((c) => c._id === courseId);
    if (course) {
      dispatch(setSelectedCourse(course));
      console.log(selectedCourse);
    }
  };

  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const userId = selectedCourse.creator._id || selectedCourse.creator;
          const result = await axios.post(
            serverUrl + "/api/course/creator",
            { userId },
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

  // SEO & Social Sharing Optimization
  useEffect(() => {
    if (selectedCourse) {
      const title = `${selectedCourse.title} | LMS Academy`;
      const description = selectedCourse.description?.substring(0, 160) || "Advance your career with our professional courses.";
      const image = selectedCourse.thumbnail?.url || selectedCourse.image || "";
      const url = window.location.href;

      document.title = title;

      // Update Meta Tags for SEO & Social Sharing
      const updateMeta = (name, content, attr = 'name') => {
        let meta = document.querySelector(`meta[${attr}="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attr, name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      updateMeta('description', description);
      updateMeta('og:title', title, 'property');
      updateMeta('og:description', description, 'property');
      updateMeta('og:image', image, 'property');
      updateMeta('og:url', url, 'property');
      updateMeta('og:type', 'website', 'property');
      updateMeta('twitter:card', 'summary_large_image');
      updateMeta('twitter:title', title);
      updateMeta('twitter:description', description);
      updateMeta('twitter:image', image);
    }
  }, [selectedCourse]);

  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some(c =>
      c && (typeof c === 'string' ? c : (c._id || c)).toString() === courseId?.toString()
    );
    if (verify) {
      setIsEnrolled(true);
    }
  };

  const fetchProgress = async () => {
    if (!userData || !isEnrolled) return;
    try {
      const { data } = await axios.get(`${serverUrl}/api/progress/course/${courseId}`, {
        withCredentials: true
      });
      setCourseProgress(data.progress);
      if (data.progress.completionPercentage === 100) {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  };

  useEffect(() => {
    fetchCourseData();
    checkEnrollment();
  }, [courseData, courseId, userData]);

  useEffect(() => {
    if (isEnrolled) {
      fetchProgress();
    }
  }, [isEnrolled, courseId]);

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const creatorCourse = courseData.filter(
        (course) => course && (course.creator?._id || course.creator)?.toString() === creatorData._id && course._id !== courseId
      );
      setCreatorCourses(creatorCourse);
    }
  }, [creatorData, courseData, courseId]);

  const handleEnroll = async (userId, courseId) => {
    // 1. Check if Razorpay is loaded (Mobile browsers sometimes block this)
    if (!window.Razorpay) {
      toast.error("Payment system failed to load. Please disable ad-blockers and try again.");
      return;
    }

    try {
      console.log(`[Enrollment] Creating order for course: ${courseId}`);
      const orderData = await axios.post(
        serverUrl + "/api/order/razorpay-order",
        { userId, courseId },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: 'INR',
        name: "V-LMS PREMIUM",
        description: "Course Enrollment",
        order_id: orderData.data.id,
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
        },
        theme: {
          color: "#000000" // Premium black theme for mobile
        },
        handler: async function (response) {
          try {
            console.log("[Enrollment] Payment authorized, verifying...");
            const verifyPayment = await axios.post(
              serverUrl + "/api/order/verify-payment",
              { ...response, courseId, userId },
              { withCredentials: true }
            );
            setIsEnrolled(true);
            toast.success("Enrollment Successful!");
          } catch (error) {
            console.error("Payment Verification Error:", error);
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: function() {
              toast.info("Payment cancelled.");
          }
        }
      };

      // 2. Extra hint for testers
      toast.info("Use 'success@razorpay' as the email for testing!", { autoClose: 3000 });

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Enrollment Request Failed:", error);
      
      // Specifically handle the "Network Error" often seen on mobile
      if (error.message === "Network Error") {
        toast.error("Connection failed. The server might be waking up or your mobile data is blocking the request. Please try again in a few seconds.");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong while enrolling");
      }
    }
  };

    const handleReview = async () => {
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/review/createreview", { rating, comment, courseId }, { withCredentials: true });
      toast.success("Review Added");
      setLoading(false);
      setRating(0);
      setComment("");
      // Refresh course data to show new review
      fetchCourseData();
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong while submitting review");
    }
  };

  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAvgReview(selectedCourse?.reviews);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='min-h-screen bg-black font-sans selection:bg-white selection:text-black'
    >
      <Nav />
      <div className='pt-[100px] pb-20 px-4 md:px-8 max-w-7xl mx-auto'>
        
        {/* Back Button & Header */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4 mb-8"
        >
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-white hover:text-black transition-all active:scale-90"
          >
            <FaArrowLeftLong />
          </button>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Course Blueprint</h1>
        </motion.div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[30px] md:rounded-[50px] p-6 md:p-12 relative overflow-hidden'
        >
          {/* Decorative Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          {/* Top Section: Media & Primary Info */}
          <div className='flex flex-col lg:flex-row gap-8 lg:gap-16 relative z-10'>

            {/* Thumbnail / Video Preview Area */}
            <div className="w-full lg:w-3/5 space-y-6">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="relative group overflow-hidden rounded-[30px] border border-white/10 shadow-2xl bg-black"
              >
                {selectedCourse?.thumbnail ? (
                  <img
                    src={selectedCourse?.thumbnail}
                    alt="Course Thumbnail"
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-[2s] opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <img
                    src={img}
                    alt="Course Placeholder"
                    className="w-full aspect-video object-cover opacity-40"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                {!isEnrolled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-20 h-20 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 cursor-pointer shadow-2xl group"
                    >
                      <FaPlayCircle className="text-white text-4xl group-hover:text-emerald-400 transition-colors" />
                    </motion.div>
                  </div>
                )}
              </motion.div>

              {/* Rating & Social Proof */}
              <div className="flex flex-wrap items-center justify-between gap-6 py-6 px-8 bg-white/[0.02] rounded-[30px] border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <FaStar key={i} className={i <= Math.round(avgRating) ? "text-amber-400 text-sm" : "text-white/10 text-sm"} />
                    ))}
                  </div>
                  <span className="text-2xl font-black text-white">{avgRating}</span>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">({selectedCourse?.reviews?.length || 0} Learners)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Legacy:</span>
                  <span className="text-[10px] font-black text-white bg-white/10 px-4 py-2 rounded-xl uppercase tracking-widest">{selectedCourse?.category}</span>
                </div>
              </div>
            </div>

            {/* Course Meta & Call to Action */}
            <div className="flex-1 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.5em] block">Propelling Innovation</span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight md:leading-[0.9] tracking-tighter uppercase">{selectedCourse?.title}</h1>
                </div>
                <p className="text-lg text-white/60 font-medium leading-relaxed italic border-l-2 border-white/10 pl-6">{selectedCourse?.subTitle}</p>
              </div>

              <div className="space-y-8">
                <div className="flex items-baseline gap-4">
                  <span className='text-6xl font-black text-white tracking-tighter'>₹{selectedCourse?.price}</span>
                  {selectedCourse?.price < 599 && (
                    <span className='text-xl font-bold text-white/20 line-through decoration-red-500/50'>₹599</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <FaAward size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Premium Access</span>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <FaCalendarAlt size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Lifetime Updates</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {!isEnrolled && userData?._id !== (selectedCourse?.creator?._id || selectedCourse?.creator) ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className='flex-1 bg-white text-black px-8 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)] transition-all'
                      onClick={() => handleEnroll(userData?._id, courseId)}
                    >
                      Enroll in Academy
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='flex-1 bg-emerald-500 text-white px-8 py-6 rounded-2xl transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/20' 
                        onClick={() => navigate(`/viewlecture/${courseId}`)}
                      >
                        <FaPlayCircle size={18} /> Resume Journey
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='flex-1 bg-white/5 border border-white/10 text-white px-8 py-6 rounded-2xl transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10' 
                        onClick={() => navigate(`/forum?courseId=${courseId}`)}
                      >
                        <FaComments size={18} /> Discussion
                      </motion.button>
                    </>
                  )}
                </div>
                
                {isEnrolled && isCompleted && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="pt-4"
                  >
                    <CertificateDownload 
                      studentName={userData?.name}
                      courseTitle={selectedCourse?.title}
                      date={new Date(courseProgress?.completedAt || Date.now()).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                      certificateId={`LMS-${courseId.substr(-4)}-${userData?._id?.substr(-4)}`.toUpperCase()}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-24 md:mt-32 pt-16 border-t border-white/5">
            
            <div className="lg:col-span-8 space-y-16">
              <section>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                  <div>
                    <h2 className='text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-4'>Structural Path</h2>
                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Course Curriculum</h3>
                  </div>
                  <span className="text-[10px] font-black text-white/30 bg-white/5 px-6 py-3 rounded-full uppercase tracking-widest border border-white/5 self-start">
                    {selectedCourse?.lectures?.length} Modules
                  </span>
                </div>
                
                <div className="space-y-4">
                  {selectedCourse?.lectures?.map((lecture, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className={`group flex items-center justify-between p-6 md:p-8 rounded-[30px] border transition-all ${
                        lecture.isPreviewFree || isEnrolled 
                          ? "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04] cursor-pointer" 
                          : "bg-black/40 border-white/5 opacity-40 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (lecture.isPreviewFree || isEnrolled) setSelectedLecture(lecture);
                      }}
                    >
                      <div className="flex items-center gap-6 md:gap-8">
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[20px] flex items-center justify-center transition-all group-hover:rotate-6 ${lecture.isPreviewFree || isEnrolled ? "bg-white text-black shadow-2xl" : "bg-white/5 text-white/20"}`}>
                          {lecture.isPreviewFree || isEnrolled ? <FaPlayCircle size={24} /> : <FaLock size={20} />}
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">Module {index + 1}</p>
                          <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{lecture?.lectureTitle}</h4>
                          {lecture.isPreviewFree && !isEnrolled && <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg font-black uppercase tracking-[0.2em] mt-3 inline-block">Free Sample</span>}
                        </div>
                      </div>
                      {(lecture.isPreviewFree || isEnrolled) && <FaArrowRight className="text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all" />}
                    </motion.div>
                  ))}
                </div>

                <AnimatePresence>
                  {selectedLecture && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 50 }}
                      className="mt-12 p-6 md:p-8 bg-black/90 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] truncate max-w-xs">{selectedLecture.lectureTitle}</h3>
                        </div>
                        <button onClick={() => setSelectedLecture(null)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white hover:bg-white hover:text-black transition-all">✕</button>
                      </div>
                      <div className='aspect-video w-full rounded-[30px] overflow-hidden bg-black shadow-inner border border-white/5'>
                        <video
                          className='w-full h-full object-contain'
                          src={selectedLecture?.videoUrl}
                          controls
                          autoPlay
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Reviews Section */}
              <section className="pt-8">
                  <h2 className='text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-12'>Community Resonance</h2>
                  <div className='bg-white/[0.02] backdrop-blur-2xl rounded-[40px] p-8 md:p-12 border border-white/5'>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="w-full md:w-auto flex flex-col items-center gap-4 bg-white/5 p-8 rounded-3xl border border-white/5">
                        <span className="text-5xl font-black text-white">{avgRating}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <FaStar key={i} className={i <= Math.round(avgRating) ? "text-amber-400 text-sm" : "text-white/10 text-sm"} />
                          ))}
                        </div>
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{selectedCourse?.reviews?.length || 0} Reviews</span>
                      </div>
                      
                      <div className="flex-1 w-full space-y-6">
                        <div className='flex items-center gap-4'>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar 
                              key={star} 
                              onClick={()=>setRating(star)} 
                              className={`w-10 h-10 cursor-pointer transition-all hover:scale-110 ${star <= rating ? "text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]" : "text-white/5 hover:text-white/20"}`}
                            />
                          ))}
                        </div>
                        <textarea
                          onChange={(e)=>setComment(e.target.value)}
                          value={comment}
                          className='w-full bg-black/40 border border-white/5 rounded-[25px] p-8 text-sm text-white focus:ring-1 focus:ring-white/20 focus:border-transparent outline-none transition-all placeholder:text-white/10 resize-none'
                          placeholder='Share your experience with the world...'
                          rows={4}
                        />
                        <button 
                          className='bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 active:scale-95 disabled:opacity-20 transition-all flex items-center justify-center min-w-[220px] shadow-2xl ml-auto' 
                          disabled={loading || !rating} 
                          onClick={handleReview}
                        >
                          {loading ? <ClipLoader size={18} color='black'/> : "Broadcast Review"}
                        </button>
                      </div>
                    </div>
                  </div>
              </section>
            </div>

            {/* Instructor Profile */}
            <div className="lg:col-span-4">
              <div className='bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[40px] p-10 lg:sticky lg:top-32 h-fit'>
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-10 text-center">Master Instructor</h3>
                <div className='flex flex-col items-center text-center space-y-6 mb-10'>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative group p-1.5 bg-white/5 rounded-[45px] border border-white/10"
                  >
                    <img
                      src={creatorData?.photoUrl || img}
                      alt={creatorData?.name}
                      className='w-32 h-32 rounded-[38px] object-cover group-hover:scale-105 transition-transform duration-700'
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-black rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"></div>
                  </motion.div>
                  <div>
                    <h4 className='text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2'>{creatorData?.name}</h4>
                    <p className='text-[10px] font-black text-white/30 uppercase tracking-[0.2em]'>{creatorData?.email}</p>
                  </div>
                </div>
                <p className='text-sm text-white/60 font-medium leading-relaxed text-center mb-10 px-4'>
                  {creatorData?.description || "A world-class mentor dedicated to pushing the boundaries of digital education and technological excellence."}
                </p>
                <button 
                  onClick={() => navigate(`/profile/${creatorData?._id || selectedCourse?.creator?._id}`)}
                  className="w-full py-5 bg-white/5 text-white/80 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 border border-white/5 transition-all shadow-xl"
                >
                  Explore Portfolio
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* More Courses Section */}
        {creatorCourses?.length > 0 && (
          <div className="pt-24 mt-24 md:pt-32 md:mt-32 border-t border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16">
              <div>
                <h2 className='text-[10px] font-black text-white/40 uppercase tracking-[0.6em] mb-5'>Deepening Expertise</h2>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter">More from this Author</h3>
              </div>
              <button className="text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-4 self-start">
                SEE ARCHIVE <FaArrowRight className="text-white/20" />
              </button>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10'>
              {creatorCourses.map((course, index) => (
                <Card
                  key={index}
                  thumbnail={course.thumbnail}
                  title={course.title}
                  id={course._id}
                  price={course.price}
                  category={course.category}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </motion.div>
  );
}

export default ViewCourse;

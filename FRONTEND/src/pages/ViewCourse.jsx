import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong, FaStar } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { setSelectedCourse } from '../redux/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaLock, FaPlayCircle, FaComments } from "react-icons/fa";
import { IoVideocamOutline } from "react-icons/io5";
import { serverUrl } from '../App';
import img from "../assets/empty.jpg"
import axios from 'axios';
import Card from '../component/Card';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useSocketContext } from '../context/SocketContext';

function ViewCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courseData, selectedCourse } = useSelector(state => state.course);
  const { userData } = useSelector(state => state.user);
  const { socket } = useSocketContext();
  const dispatch = useDispatch();

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

  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some(c =>
      (typeof c === 'string' ? c : c._id).toString() === courseId?.toString()
    );
    if (verify) {
      setIsEnrolled(true);
    }
  };

  useEffect(() => {
    fetchCourseData();
    checkEnrollment();
  }, [courseData, courseId, userData]);

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const creatorCourse = courseData.filter(
        (course) => course.creator?._id.toString() === creatorData._id && course._id !== courseId
      );
      setCreatorCourses(creatorCourse);
    }
  }, [creatorData, courseData, courseId]);

  const handleEnroll = async (userId, courseId) => {
    try {
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
        description: "FOR TESTING: Use success@razorpay as email",
        order_id: orderData.data.id,
        prefill: {
          name: userData.name,
          email: userData.email,
        },
        notes: {
            "instruction": "USE 'success@razorpay' for testing"
        },
        handler: async function (response) {
          try {
            const verifyPayment = await axios.post(
              serverUrl + "/api/order/verify-payment",
              { ...response, courseId, userId },
              { withCredentials: true }
            );
            setIsEnrolled(true);
            toast.success("Enrollment Successful! Welcome to the course.");
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        modal: {
            ondismiss: function() {
                toast.info("Enrollment cancelled. Use 'success@razorpay' to enroll for free in test mode.");
            }
        }
      };

      toast.info("Pro Tip: Use 'success@razorpay' in the payment field for free testing!", {
        position: "top-center",
        autoClose: 5000,
      });

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while enrolling");
    }
  };

    const handleReview = async () => {
      setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/review/createreview" , {rating , comment , courseId} , {withCredentials:true})
      toast.success("Review Added")
      setLoading(false)
      console.log(result.data)
      setRating(0)
      setComment("")

    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.response.data.message)
      setRating(0)
      setComment("")
    }
  }

  const calculateAvgReview = (reviews) =>{
      if(!reviews || reviews.length  === 0 ){
        return 0
      }
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1); // rounded to 1 decimal
  };

const avgRating = calculateAvgReview(selectedCourse?.reviews)



  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative'>

        {/* Top Section */}
        <div className='flex flex-col md:flex-row gap-6'>

          {/* Thumbnail */}
          <div className="w-full md:w-1/2">
            <FaArrowLeftLong
              className='text-[black] w-[22px] h-[22px] cursor-pointer mb-3'
              onClick={() => navigate("/")}
            />
            {selectedCourse?.thumbnail ? (
              <img
                src={selectedCourse?.thumbnail}
                alt="Course Thumbnail"
                className="rounded-xl w-full object-cover"
              />
            ) : (
              <img
                src={img}
                alt="Course Thumbnail"
                className="rounded-xl w-full object-cover"
              />
            )}
          </div>

          {/* Course Info */}
          <div className="flex-1 space-y-2 mt-[20px]">
            <h1 className="text-2xl font-bold">{selectedCourse?.title}</h1>
            <p className="text-gray-600">{selectedCourse?.subTitle}</p>

            {/* Rating */}
            <div className="font-medium">
              <div className="flex items-center gap-2 text-yellow-500">
                <FaStar />
                <span>{avgRating}</span>
                <span className="text-gray-600">(1,200 Reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div>
              <span className='text-xl font-semibold text-black'>₹{selectedCourse?.price}</span>{" "}
              <span className='line-through text-sm text-gray-400'>₹599</span>
            </div>

            {/* Highlights */}
            <ul className="text-sm text-gray-700 space-y-1 pt-2">
              <li>✅ 10+ hours of video content</li>
              <li>✅ Lifetime access to course materials</li>
            </ul>

            {/* Enroll / Watch / Live */}
            <div className="flex gap-4">
              {!isEnrolled && userData?._id !== selectedCourse?.creator?._id ? (
                <button
                  className='bg-black text-white px-6 py-2 rounded hover:bg-gray-700 mt-3 cursor-pointer transition-all'
                  onClick={() => handleEnroll(userData._id, courseId)}
                >
                  Enroll Now
                </button>
              ) : (
                <>
                  <button
                    className='bg-green-100 text-green-500 px-6 py-2 hover:bg-green-200 rounded mt-3 cursor-pointer transition-all flex items-center gap-2 font-semibold' 
                    onClick={() => navigate(`/viewlecture/${courseId}`)}
                  >
                    <FaPlayCircle /> Watch Now
                  </button>
                  <button
                    className='bg-blue-100 text-blue-500 px-6 py-2 hover:bg-blue-200 rounded mt-3 cursor-pointer transition-all flex items-center gap-2 font-semibold' 
                    onClick={() => navigate(`/forum?courseId=${courseId}`)}
                  >
                    <FaComments /> Course Community
                  </button>
                </>
              )}
            </div>

            {/* What You'll Learn */}
            <div>
              <h2 className='text-xl font-semibold mb-2'>What You'll Learn</h2>
              <ul className='list-disc pl-6 text-gray-700 space-y-1'>
                <li>Learn {selectedCourse?.category} from Beginning</li>
              </ul>
            </div>

            {/* Who This Course is For */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Who This Course is For</h2>
              <p className="text-gray-700">
                Beginners, aspiring developers, and professionals looking to upgrade skills.
              </p>
            </div>

            {/* Curriculum Section */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
                <h2 className='text-xl font-bold mb-1 text-gray-800'>Course Curriculum</h2>
                <p className='text-sm text-gray-500 mb-4'>
                  {selectedCourse?.lectures?.length} Lectures
                </p>

                <div className='flex flex-col gap-3'>
                  {selectedCourse?.lectures?.map((lecture, index) => (
                    <button
                      key={index}
                      disabled={!lecture.isPreviewFree}
                      onClick={() => {
                        if (lecture.isPreviewFree) {
                          setSelectedLecture(lecture);
                        }
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                        lecture.isPreviewFree
                          ? `hover:bg-gray-100 cursor-pointer border-gray-300 ${
                              selectedLecture?.lectureTitle === lecture?.lectureTitle
                                ? "bg-gray-100 border-gray-400"
                                : ""
                            }`
                          : "cursor-not-allowed opacity-60 border-gray-200"
                      }`}
                    >
                      <span className='text-lg text-gray-700'>
                        {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                      </span>
                      <span className='text-sm font-medium text-gray-800'>
                        {lecture?.lectureTitle}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className='bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200'>
                <div className='aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center'>
                  {selectedLecture?.videoUrl ? (
                    <video
                      className='w-full h-full object-cover'
                      src={selectedLecture?.videoUrl}
                      controls
                    />
                  ) : (
                    <span className='text-white text-sm'>
                      Select a Preview Lecture to Watch
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Review Section */}
            <div className='mt-8 border-t pt-6'>
              <h2 className='text-xl font-semibold mb-2'>Write a Review</h2>
              <div className='mb-4'>
                <div className='flex gap-1 mb-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} onClick={()=>setRating(star)} className={star <= rating ? "fill-amber-300" : "fill-gray-300"}/>
                  ))}
                </div>
                <textarea
                onChange={(e)=>setComment(e.target.value)}
                  value={ comment}
                  className='w-full border border-gray-300 rounded-lg p-2'
                  placeholder='Write your review here...'
                  rows={3}
                />
                <button className='bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800' disabled={loading} onClick={handleReview}>
                  {loading? <ClipLoader size={30} color='white'/>:"Submit Review"}
                </button>
              </div>
            </div>

            {/* Creator Info */}
            <div className='flex items-center gap-4 pt-4 border-t'>
              {creatorData?.photoUrl ? (
                <img
                  src={creatorData?.photoUrl}
                  alt=""
                  className='border-1 border-gray-200 w-16 h-16 rounded-full object-cover'
                />
              ) : (
                <img
                  src={img}
                  alt=""
                  className='w-16 h-16 rounded-full object-cover border-1 border-gray-200'
                />
              )}

              <div>
                <h2 className='text-lg font-semibold'>{creatorData?.name}</h2>
                <p className='md:text-sm text-gray-600 text-[10px]'>{creatorData?.description}</p>
                <p className="md:text-sm text-gray-600 text-[10px]">{creatorData?.email}</p>
              </div>
            </div>

            {/* Other Courses */}
            <div>
              <p className='text-xl font-semibold mb-2'>
                Other Published Courses by the Educator -
              </p>
            </div>

            <div className='w-full transition-all duration-300 py-[20px] flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px]'>
              {creatorCourses?.map((course, index) => (
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
        </div>
      </div>
    </div>
  );
}

export default ViewCourse;

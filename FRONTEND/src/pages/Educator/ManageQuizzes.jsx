import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaClock, FaTrophy, FaEdit, FaTrash, FaPlus, FaUsers, FaRobot } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function ManageQuizzes() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, quizId: null, quizTitle: '' });

  useEffect(() => {
    fetchQuizzes();
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, {
        withCredentials: true
      });
      setCourseName(response.data.title);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/quiz/course/${courseId}`,
        { withCredentials: true }
      );
      setQuizzes(response.data.quizzes || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch quizzes');
      setLoading(false);
    }
  };

  const handleDelete = async (quizId) => {
    try {
      await axios.delete(`${serverUrl}/api/quiz/${quizId}`, {
        withCredentials: true
      });
      toast.success('Quiz deleted successfully');
      setDeleteModal({ show: false, quizId: null, quizTitle: '' });
      fetchQuizzes(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete quiz');
    }
  };

  const openDeleteModal = (quizId, quizTitle) => {
    setDeleteModal({ show: true, quizId, quizTitle });
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex justify-center items-center'>
        <ClipLoader size={50} color='#000' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      {/* Header */}
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center gap-4 mb-6'>
          <FaArrowLeftLong 
            className='w-6 h-6 cursor-pointer hover:text-gray-700' 
            onClick={() => navigate('/courses')}
          />
          <div className='flex-1'>
            <h1 className='text-3xl font-bold text-gray-800'>Manage Quizzes</h1>
            <p className='text-gray-600 mt-1'>{courseName}</p>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => navigate(`/create-quiz/${courseId}`)}
              className='bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2 font-semibold'
            >
              <FaPlus /> Create Quiz
            </button>
            <button
              onClick={() => navigate(`/create-quiz/${courseId}`, { state: { autoOpenAI: true } })}
              className='bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 font-semibold shadow-md'
            >
              <FaRobot /> Generate with AI
            </button>
          </div>
        </div>

        {/* Quiz List */}
        {quizzes.length === 0 ? (
          <div className='bg-white rounded-2xl shadow-md p-12 text-center'>
            <div className='text-gray-400 mb-4'>
              <FaTrophy className='w-16 h-16 mx-auto' />
            </div>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>No Quizzes Yet</h3>
            <p className='text-gray-500 mb-6'>Create your first quiz to test your students' knowledge</p>
            <button
              onClick={() => navigate(`/create-quiz/${courseId}`)}
              className='bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all inline-flex items-center gap-2 font-semibold'
            >
              <FaPlus /> Create Your First Quiz
            </button>
          </div>
        ) : (
          <div className='space-y-4'>
            {quizzes.map((quiz) => (
              <div 
                key={quiz._id}
                className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-200'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>
                      {quiz.title}
                    </h3>
                    
                    {quiz.description && (
                      <p className='text-gray-600 mb-4'>{quiz.description}</p>
                    )}
                    
                    <div className='flex flex-wrap gap-4 text-sm'>
                      <div className='flex items-center gap-2 text-gray-600'>
                        <FaClock className='text-blue-600' />
                        <span>{quiz.duration} minutes</span>
                      </div>
                      
                      <div className='flex items-center gap-2 text-gray-600'>
                        <FaTrophy className='text-yellow-600' />
                        <span>Pass: {quiz.passingScore}%</span>
                      </div>
                      
                      <div className='text-gray-600'>
                        <span className='font-semibold'>{quiz.questions?.length || 0}</span> questions
                      </div>
                      
                      {quiz.attempts > 0 && (
                        <div className='text-gray-600'>
                          <span className='font-semibold'>{quiz.attempts}</span> max attempts
                        </div>
                      )}
                      
                      <div className='flex items-center gap-2 text-gray-600'>
                        <FaUsers className='text-green-600' />
                        <span>{quiz.studentAttempts?.length || 0} student attempts</span>
                      </div>
                    </div>

                    {/* Quiz Stats */}
                    {quiz.studentAttempts && quiz.studentAttempts.length > 0 && (
                      <div className='mt-4 pt-4 border-t border-gray-200'>
                        <p className='text-sm text-gray-600'>
                          <span className='font-semibold'>Average Score: </span>
                          {Math.round(
                            quiz.studentAttempts.reduce((sum, att) => sum + att.score, 0) / 
                            quiz.studentAttempts.length
                          )}%
                          <span className='ml-4 text-green-600 font-semibold'>
                            {quiz.studentAttempts.filter(att => att.passed).length} passed
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className='ml-4 flex gap-2'>
                    <button
                      onClick={() => navigate(`/take-quiz/${quiz._id}`)}
                      className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold'
                      title='Preview Quiz'
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => openDeleteModal(quiz._id, quiz.title)}
                      className='p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all'
                      title='Delete Quiz'
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn'>
            <div className='text-center mb-6'>
              <div className='mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4'>
                <FaTrash className='text-red-600 text-2xl' />
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-2'>Delete Quiz?</h3>
              <p className='text-gray-600'>
                Are you sure you want to delete <span className='font-semibold'>"{deleteModal.quizTitle}"</span>?
              </p>
              <p className='text-sm text-red-600 mt-2'>
                This action cannot be undone. All student attempts will be lost.
              </p>
            </div>
            
            <div className='flex gap-3'>
              <button
                onClick={() => setDeleteModal({ show: false, quizId: null, quizTitle: '' })}
                className='flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-semibold'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.quizId)}
                className='flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageQuizzes;

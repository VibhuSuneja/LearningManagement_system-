import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaClock, FaTrophy, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function QuizList({ courseId }) {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({});

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/quiz/course/${courseId}`,
        { withCredentials: true }
      );
      
      setQuizzes(response.data.quizzes || []);
      
      // Fetch results for each quiz
      for (const quiz of response.data.quizzes || []) {
        fetchQuizResults(quiz._id);
      }
      
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchQuizResults = async (quizId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/quiz/${quizId}/results`,
        { withCredentials: true }
      );
      
      if (response.data.attempts && response.data.attempts.length > 0) {
        const bestAttempt = response.data.attempts.reduce((best, current) => 
          current.score > best.score ? current : best
        );
        setResults(prev => ({
          ...prev,
          [quizId]: bestAttempt
        }));
      }
    } catch (error) {
      // Quiz not attempted yet
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <ClipLoader size={30} color='#000' />
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className='bg-gray-50 rounded-lg p-6 text-center text-gray-600'>
        No quizzes available for this course yet.
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {quizzes.map((quiz) => {
        const result = results[quiz._id];
        const hasPassed = result && result.passed;
        
        return (
          <div 
            key={quiz._id}
            className='bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all'
          >
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    {quiz.title}
                  </h3>
                  {hasPassed && (
                    <span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1'>
                      <FaCheck size={10} /> Passed
                    </span>
                  )}
                </div>
                
                {quiz.description && (
                  <p className='text-sm text-gray-600 mb-3'>{quiz.description}</p>
                )}
                
                <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                  <div className='flex items-center gap-1'>
                    <FaClock className='text-blue-600' />
                    <span>{quiz.duration} minutes</span>
                  </div>
                  
                  <div className='flex items-center gap-1'>
                    <FaTrophy className='text-yellow-600' />
                    <span>Pass: {quiz.passingScore}%</span>
                  </div>
                  
                  <div>
                    <span>{quiz.questions?.length || 0} questions</span>
                  </div>
                  
                  {quiz.attempts > 0 && (
                    <div>
                      <span>{quiz.attempts} attempts</span>
                    </div>
                  )}
                </div>

                {result && (
                  <div className='mt-3 pt-3 border-t border-gray-200'>
                    <p className='text-sm'>
                      <span className='text-gray-600'>Best Score: </span>
                      <span className={`font-semibold ${
                        result.passed ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {result.score}%
                      </span>
                      <span className='text-gray-500 ml-2'>
                        ({result.attemptNumber} of {quiz.attempts || '∞'} attempts used)
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate(`/take-quiz/${quiz._id}`)}
                className='ml-4 bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2 font-semibold whitespace-nowrap'
              >
                <FaPlay size={12} />
                {result ? 'Retake' : 'Start Quiz'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default QuizList;

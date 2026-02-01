import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [canAttempt, setCanAttempt] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);

  // Fetch quiz details
  useEffect(() => {
    fetchQuizDetails();
  }, [quizId]);

  const fetchQuizDetails = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/quiz/${quizId}`,
        { withCredentials: true }
      );
      
      setQuiz(response.data.quiz);
      setCanAttempt(response.data.canAttempt);
      setAttemptCount(response.data.attemptCount);
      
      if (response.data.quiz.duration) {
        setTimeLeft(response.data.quiz.duration * 60); // Convert to seconds
      }
      
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to load quiz');
      setLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitQuiz(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex.toString()
    });
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    // Convert answers object to array format expected by backend
    const answersArray = quiz.questions.map((q, index) => ({
      questionId: q._id,
      selectedAnswer: answers[q._id] || null
    }));

    // Check if all questions are answered
    const unanswered = answersArray.filter(a => a.selectedAnswer === null);
    if (unanswered.length > 0 && timeLeft > 0) {
      const confirm = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
       `${serverUrl}/api/quiz/${quizId}/submit`,
        { answers: answersArray },
        { withCredentials: true }
      );

      setResults(response.data);
      setShowResults(true);
      toast.success(`Quiz submitted! Score: ${response.data.score}%`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <ClipLoader size={50} color='#000' />
      </div>
    );
  }

  if (!canAttempt) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 text-center'>
          <FaTimesCircle className='text-red-500 text-6xl mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>No Attempts Left</h2>
          <p className='text-gray-600 mb-6'>
            You have used all {quiz.attempts} attempts for this quiz.
          </p>
          <button
            onClick={() => navigate(`/quiz-results/${quizId}`)}
            className='bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all'
          >
            View Previous Results
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8'>
          <div className='text-center mb-8'>
            {results.passed ? (
              <FaCheckCircle className='text-green-500 text-6xl mx-auto mb-4' />
            ) : (
              <FaTimesCircle className='text-red-500 text-6xl mx-auto mb-4' />
            )}
            
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>
              {results.passed ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}
            </h2>
            
            <div className='text-5xl font-bold mb-2' style={{
              color: results.passed ? '#10b981' : '#ef4444'
            }}>
              {results.score}%
            </div>
            
            <p className='text-gray-600 text-lg'>
              {results.earnedPoints} / {results.totalPoints} points
            </p>
            
            <p className='text-gray-500 mt-2'>
              Passing score: {quiz.passingScore}%
            </p>
          </div>

          {/* Question Review */}
          <div className='border-t pt-6'>
            <h3 className='text-xl font-semibold mb-4'>Question Review</h3>
            <div className='space-y-4'>
              {quiz.questions.map((question, index) => {
                const studentAnswer = results.gradedAnswers.find(
                  a => a.questionId === question._id
                );
                
                return (
                  <div key={question._id} className={`border rounded-lg p-4 ${
                    studentAnswer?.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className='flex items-start justify-between mb-2'>
                      <h4 className='font-medium text-gray-800'>
                        {index + 1}. {question.questionText}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        studentAnswer?.isCorrect 
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {studentAnswer?.isCorrect ? '✓ Correct' : '✗ Wrong'}
                      </span>
                    </div>

                    <div className='space-y-2 mt-3'>
                      {question.options.map((option, optIdx) => {
                        const isStudentAnswer = studentAnswer?.selectedAnswer === optIdx.toString();
                        const isCorrectAnswer = option.isCorrect;
                        
                        return (
                          <div key={optIdx} className={`p-2 rounded ${
                            isCorrectAnswer 
                              ? 'bg-green-100 border border-green-300'
                              : isStudentAnswer
                              ? 'bg-red-100 border border-red-300'
                              : 'bg-white border-gray-200'
                          }`}>
                            <span className='font-medium'>
                              {isCorrectAnswer && '✓ '}
                              {isStudentAnswer && !isCorrectAnswer && '✗ '}
                              {option.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className='mt-3 pt-3 border-t border-gray-300'>
                        <p className='text-sm text-gray-700'>
                          <span className='font-semibold'>Explanation:</span> {question.explanation}
                        </p>
                      </div>
                    )}

                    <div className='mt-2 text-sm text-gray-600'>
                      Points: {studentAnswer?.pointsEarned || 0} / {question.points}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='mt-8 flex gap-4'>
            <button
              onClick={() => navigate(-1)}
              className='flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all'
            >
              Back to Course
            </button>
            
            {attemptCount < quiz.attempts && (
              <button
                onClick={() => window.location.reload()}
                className='flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all'
              >
                Try Again ({quiz.attempts - attemptCount} attempts left)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='max-w-4xl mx-auto'>
        
        {/* Header */}
        <div className='bg-white shadow-lg rounded-xl p-4 md:p-6 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <FaArrowLeft 
                className='text-gray-600 cursor-pointer hover:text-black' 
                onClick={() => {
                  if (window.confirm('Are you sure you want to leave? Your progress will be lost.')) {
                    navigate(-1);
                  }
                }}
              />
              <div>
                <h1 className='text-xl md:text-2xl font-bold text-gray-800'>{quiz.title}</h1>
                <p className='text-sm text-gray-600'>{quiz.description}</p>
              </div>
            </div>
            
            {timeLeft !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <FaClock />
                <span className='font-mono font-bold text-lg'>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div 
              className='bg-black h-2 rounded-full transition-all duration-300'
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className='flex justify-between items-center mt-2 text-sm text-gray-600'>
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{answeredCount} / {quiz.questions.length} answered</span>
          </div>
        </div>

        {/* Question Card */}
        <div className='bg-white shadow-lg rounded-xl p-6 md:p-8'>
          <h2 className='text-xl md:text-2xl font-semibold text-gray-800 mb-6'>
            {currentQuestion + 1}. {currentQ.questionText}
          </h2>

          <div className='space-y-3'>
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQ._id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[currentQ._id] === index.toString()
                    ? 'border-black bg-gray-100'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQ._id] === index.toString()
                      ? 'border-black bg-black'
                      : 'border-gray-400'
                  }`}>
                    {answers[currentQ._id] === index.toString() && (
                      <div className='w-3 h-3 bg-white rounded-full' />
                    )}
                  </div>
                  <span className='font-medium text-gray-800'>{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className='flex gap-4 mt-8'>
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className='px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Previous
            </button>
            
            <div className='flex-1' />

            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className='px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all'
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className='px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50'
              >
                {submitting ? <ClipLoader size={20} color='white' /> : 'Submit Quiz'}
              </button>
            )}
          </div>

          {/* Question Navigator */}
          <div className='mt-8 pt-6 border-t border-gray-200'>
            <h3 className='text-sm font-semibold text-gray-700 mb-3'>Quick Navigation</h3>
            <div className='flex flex-wrap gap-2'>
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    currentQuestion === index
                      ? 'bg-black text-white'
                      : answers[quiz.questions[index]._id]
                      ? 'bg-gray-300 text-gray-800'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;

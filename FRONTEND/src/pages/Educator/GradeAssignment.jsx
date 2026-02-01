import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeftLong, FaGraduationCap, FaRobot, FaCheckCircle, FaExclamationCircle, FaUser, FaFileAlt, FaLink, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function GradeAssignment() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [submissions, setSubmissions] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/assignment/submissions/${assignmentId}`, {
        withCredentials: true
      });
      setSubmissions(response.data.submissions);
      setAssignmentTitle(response.data.assignmentTitle);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch submissions");
      setLoading(false);
    }
  };

  const selectSubmission = (sub) => {
    setSelectedSubmission(sub);
    setGrade(sub.grade || '');
    setFeedback(sub.feedback || '');
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!grade) return toast.warning("Please provide a grade");
    
    setSubmittingGrade(true);
    try {
      await axios.post(`${serverUrl}/api/submission/grade/${selectedSubmission._id}`, {
        grade,
        feedback
      }, { withCredentials: true });
      
      toast.success("Submission graded successfully!");
      fetchSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit grade");
    } finally {
      setSubmittingGrade(false);
    }
  };

  const generateAIGrade = async () => {
    setGeneratingAI(true);
    try {
      const response = await axios.post(`${serverUrl}/api/ai-features/grade-submission/${selectedSubmission._id}`, {}, {
        withCredentials: true
      });
      
      toast.success("AI feedback generated!");
      // Pre-fill fields with AI suggestions
      setGrade(response.data.suggestedGrade);
      // We don't update feedback here, just show a notification or update state
      // Actually, let's refresh sub data to show the AI feedback field
      fetchSubmissions().then(() => {
          // Re-select with updated data
          const updated = submissions.find(s => s._id === selectedSubmission._id);
          if (updated) setSelectedSubmission(updated);
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "AI grading failed");
    } finally {
      setGeneratingAI(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-white flex justify-center items-center'>
        <ClipLoader size={50} color='#000' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <FaArrowLeftLong 
            className='w-6 h-6 cursor-pointer hover:text-gray-700 transition-all' 
            onClick={() => navigate(-1)}
          />
          <div>
            <h1 className='text-3xl font-black text-gray-800 tracking-tight'>Grade Submissions</h1>
            <p className='text-gray-500 font-medium'>{assignmentTitle}</p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Submissions List */}
          <div className='lg:col-span-4 space-y-4'>
            <h3 className='text-sm font-black text-gray-400 uppercase tracking-widest pl-2'>
              Students ({submissions.length})
            </h3>
            {submissions.length === 0 ? (
              <div className='bg-white rounded-3xl p-12 text-center border border-gray-100'>
                <FaExclamationCircle className='w-10 h-10 mx-auto text-gray-200 mb-4' />
                <p className='text-gray-500 font-medium'>No submissions yet</p>
              </div>
            ) : (
              submissions.map(sub => (
                <div 
                  key={sub._id}
                  onClick={() => selectSubmission(sub)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    selectedSubmission?._id === sub._id 
                      ? 'bg-black text-white border-black shadow-xl shadow-gray-200 -translate-y-1' 
                      : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <img src={sub.student?.photoUrl || '/avatar.png'} className='w-10 h-10 rounded-full border' />
                    <div className='flex-1 overflow-hidden'>
                      <p className='font-bold truncate'>{sub.student?.name}</p>
                      <p className={`text-[10px] font-bold uppercase truncate ${
                        selectedSubmission?._id === sub._id ? 'text-gray-400' : 'text-gray-400'
                      }`}>
                        Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {sub.status === 'graded' && (
                      <FaCheckCircle className='text-green-500' />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Grading Area */}
          <div className='lg:col-span-8'>
            {selectedSubmission ? (
              <div className='space-y-6'>
                {/* Submission Content */}
                <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
                  <div className='flex justify-between items-start mb-8'>
                    <div className='flex items-center gap-4'>
                      <img src={selectedSubmission.student?.photoUrl} className='w-14 h-14 rounded-2xl border' />
                      <div>
                        <h3 className='text-xl font-black text-gray-800'>{selectedSubmission.student?.name}</h3>
                        <p className='text-sm text-gray-500 font-medium'>{selectedSubmission.student?.email}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                       <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                         selectedSubmission.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                       }`}>
                         {selectedSubmission.status}
                       </span>
                    </div>
                  </div>

                  <div className='space-y-8'>
                    {/* Text Body */}
                    {selectedSubmission.submissionText && (
                      <div>
                        <h4 className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3'>Written Response</h4>
                        <div className='bg-gray-50 p-6 rounded-2xl text-gray-700 leading-relaxed font-medium whitespace-pre-wrap border border-gray-100'>
                          {selectedSubmission.submissionText}
                        </div>
                      </div>
                    )}

                    {/* Links & Files */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {selectedSubmission.githubLink && (
                          <div>
                            <h4 className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3'>Project URL</h4>
                            <a href={selectedSubmission.githubLink} target="_blank" className='flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl font-bold hover:bg-blue-100 transition-all'>
                              <FaLink /> View Shared Link
                            </a>
                          </div>
                        )}
                        {selectedSubmission.files?.length > 0 && (
                          <div>
                            <h4 className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3'>Uploaded Files</h4>
                            <div className='space-y-2'>
                              {selectedSubmission.files.map((file, idx) => (
                                <a key={idx} href={file.fileUrl} target="_blank" className='flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold hover:border-black transition-all'>
                                  <FaFileAlt className='text-gray-300' /> {file.fileName}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Grading Form */}
                <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
                  <div className='flex items-center justify-between mb-8'>
                    <h3 className='text-xl font-black text-gray-800 flex items-center gap-2'>
                      <FaGraduationCap /> Performance Review
                    </h3>
                    <button 
                      onClick={generateAIGrade}
                      disabled={generatingAI}
                      className='flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black hover:bg-indigo-100 transition-all'
                    >
                      {generatingAI ? <ClipLoader size={14} color='#4338ca' /> : <><FaRobot /> Get AI Analysis</>}
                    </button>
                  </div>

                  {selectedSubmission.aiGeneratedFeedback && (
                      <div className='mb-8 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100'>
                         <h4 className='text-xs font-black text-indigo-400 uppercase tracking-widest mb-3'>AI Suggestions</h4>
                         <p className='text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap font-medium'>{selectedSubmission.aiGeneratedFeedback}</p>
                      </div>
                  )}

                  <form onSubmit={handleGradeSubmit} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                      <div className='md:col-span-1'>
                        <label className='block text-xs font-black text-gray-400 uppercase mb-2'>Grade Point</label>
                        <input
                          type="number"
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          placeholder="Score"
                          className='w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-black outline-none font-bold text-center text-xl'
                        />
                      </div>
                      <div className='md:col-span-3'>
                        <label className='block text-xs font-black text-gray-400 uppercase mb-2'>Feedback for Student</label>
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="What did the student do well? What can be improved?"
                          rows={4}
                          className='w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-black outline-none font-medium'
                        />
                      </div>
                    </div>

                    <div className='flex justify-end pt-4'>
                      <button
                        type="submit"
                        disabled={submittingGrade}
                        className='bg-black text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-gray-200 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3'
                      >
                        {submittingGrade ? <ClipLoader size={20} color='#fff' /> : 'Confirm Final Grade'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className='h-[600px] bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-12'>
                <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6'>
                  <FaUser className='text-gray-200 text-3xl' />
                </div>
                <h3 className='text-xl font-black text-gray-800 mb-2'>Select a Student</h3>
                <p className='text-gray-500 max-w-xs'>Choose a submission from the list on the left to start reviewing their work and assigning grades.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradeAssignment;

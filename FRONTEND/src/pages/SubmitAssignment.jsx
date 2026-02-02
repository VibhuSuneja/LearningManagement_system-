import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaFileUpload, FaRegPaperPlane, FaClock, FaCheckCircle, FaUndo, FaLink, FaFileAlt, FaStar } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function SubmitAssignment() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    submissionText: '',
    githubLink: ''
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/assignment/${assignmentId}`, {
        withCredentials: true
      });
      setAssignment(response.data.assignment);
      setHasSubmitted(response.data.hasSubmitted);
      setSubmission(response.data.submission);
      if (response.data.hasSubmitted && response.data.submission) {
        setFormData({
          submissionText: response.data.submission.submissionText || '',
          githubLink: response.data.submission.githubLink || ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch assignment details");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.submissionText && files.length === 0) {
      return toast.warning("Please provide a text response or upload a file");
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('submissionText', formData.submissionText);
      data.append('githubLink', formData.githubLink);
      
      files.forEach(file => {
        data.append('files', file);
      });

      await axios.post(`${serverUrl}/api/submission/submit/${assignmentId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      toast.success("Assignment submitted successfully! 🚀");
      fetchAssignment(); // Refresh state
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-white flex justify-center items-center'>
        <ClipLoader size={50} color='#000' />
      </div>
    );
  }

  const isPastDue = new Date(assignment?.dueDate) < new Date();

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <FaArrowLeftLong 
            className='w-6 h-6 cursor-pointer hover:text-gray-700 transition-all' 
            onClick={() => navigate(-1)}
          />
          <div>
            <h1 className='text-3xl font-black text-gray-800 tracking-tight'>Assignment Submission</h1>
            <p className='text-gray-500 font-medium'>{assignment?.title}</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Details Column */}
          <div className='md:col-span-2 space-y-6'>
            {/* Task Card */}
            <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold'>
                  T
                </div>
                <div>
                  <h3 className='font-black text-gray-800 uppercase tracking-wider text-xs'>Final Task</h3>
                  <p className='text-xl font-bold text-gray-900'>{assignment?.title}</p>
                </div>
              </div>

              <div className='prose prose-sm max-w-none text-gray-600 font-medium mb-8'>
                {assignment?.description}
              </div>

              {assignment?.instructions && (
                <div className='bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8'>
                  <h4 className='font-bold text-gray-800 mb-2 flex items-center gap-2'>
                    <FaFileAlt className='text-blue-500' /> Instructions
                  </h4>
                  <p className='text-sm text-gray-600 leading-relaxed'>{assignment?.instructions}</p>
                </div>
              )}

              {/* Attachments */}
              {assignment?.attachments?.length > 0 && (
                <div className='space-y-3'>
                  <h4 className='text-xs font-black text-gray-400 uppercase tracking-widest'>Resource Files</h4>
                  <div className='flex flex-wrap gap-3'>
                    {assignment.attachments.map((file, idx) => (
                      <a 
                        key={idx} 
                        href={file.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className='flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-black transition-all'
                      >
                        <FaFileAlt className='text-gray-400' />
                        <span className='text-sm font-bold text-gray-700'>{file.fileName}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Feedback / Grading (if submitted) */}
            {hasSubmitted && submission?.status === 'graded' && (
              <div className='bg-green-50 p-8 rounded-3xl border border-green-100'>
                <div className='flex justify-between items-start mb-6'>
                  <div className='flex items-center gap-3'>
                    <FaCheckCircle className='text-green-500 text-2xl' />
                    <h3 className='text-xl font-black text-green-900'>Graded</h3>
                  </div>
                  <div className='text-center'>
                    <p className='text-[10px] font-black uppercase text-green-700 opacity-60'>Final Score</p>
                    <p className='text-3xl font-black text-green-700'>{submission.grade}/{assignment.maxPoints}</p>
                  </div>
                </div>
                {submission.feedback && (
                  <div className='bg-white p-6 rounded-2xl shadow-sm'>
                    <h4 className='font-bold text-gray-800 mb-2'>Instructor Feedback</h4>
                    <p className='text-sm text-gray-600 italic whitespace-pre-wrap'>{submission.feedback}</p>
                  </div>
                )}
                {submission.aiGeneratedFeedback && (
                    <div className='mt-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100'>
                         <h4 className='font-bold text-blue-800 mb-2'>AI Analysis</h4>
                         <p className='text-sm text-blue-700 whitespace-pre-wrap'>{submission.aiGeneratedFeedback}</p>
                    </div>
                )}
              </div>
            )}

            {/* Submission Form (only if not graded) */}
            {!hasSubmitted || submission?.status !== 'graded' ? (
              <form onSubmit={handleSubmit} className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6'>
                 <h3 className='text-xl font-black text-gray-800 mb-6'>
                   {hasSubmitted ? 'Update Your Submission' : 'Submit Your Work'}
                 </h3>

                 <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-bold text-gray-700 mb-2'>Text Response</label>
                      <textarea
                        name="submissionText"
                        rows={10}
                        value={formData.submissionText}
                        onChange={handleInputChange}
                        placeholder="Write your answer or summary here..."
                        className='w-full px-5 py-4 rounded-3xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all font-medium text-gray-700'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-bold text-gray-700 mb-2'>Project Link (Optional)</label>
                      <div className='relative'>
                        <input
                          type="url"
                          name="githubLink"
                          value={formData.githubLink}
                          onChange={handleInputChange}
                          placeholder="https://github.com/your-username/repo"
                          className='w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all'
                        />
                        <FaLink className='absolute left-5 top-5 text-gray-300' />
                      </div>
                    </div>

                    <div>
                        <label className='block text-sm font-bold text-gray-700 mb-2'>Upload Files</label>
                        <div className='border-2 border-dashed border-gray-100 rounded-3xl p-10 text-center hover:bg-gray-50 transition-all cursor-pointer relative'>
                            <input
                              type="file"
                              multiple
                              onChange={(e) => setFiles([...e.target.files])}
                              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                            />
                            <FaFileUpload className='w-10 h-10 mx-auto text-gray-200 mb-4' />
                            <p className='text-sm font-bold text-gray-500'>Drop files or click to upload</p>
                        </div>
                        {files.length > 0 && (
                            <div className='mt-4 flex flex-wrap gap-2'>
                                {files.map((file, i) => (
                                    <div key={i} className='bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-2'>
                                        <FaFileAlt /> {file.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 </div>

                 <button
                  type="submit"
                  disabled={submitting || (isPastDue && !hasSubmitted)}
                  className='w-full bg-black text-white py-5 rounded-3xl font-black text-lg hover:bg-gray-800 hover:-translate-y-1 active:scale-95 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3'
                >
                  {submitting ? (
                    <ClipLoader size={24} color='#fff' />
                  ) : (
                    <>
                      {hasSubmitted ? <><FaUndo /> Update Submission</> : <><FaRegPaperPlane /> Submit Now</>}
                    </>
                  )}
                </button>
              </form>
            ) : null}
          </div>

          {/* Sidebar Column */}
          <div className='space-y-6'>
            <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100'>
              <div className='flex items-center gap-3 mb-6'>
                <FaClock className='text-orange-500' />
                <h4 className='font-bold text-gray-800'>Timeline</h4>
              </div>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm font-medium text-gray-400'>Due Date</span>
                  <span className='text-sm font-black text-gray-700'>{new Date(assignment?.dueDate).toLocaleDateString()}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm font-medium text-gray-400'>Status</span>
                  <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${
                    hasSubmitted ? 'bg-green-100 text-green-600' : isPastDue ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {hasSubmitted ? 'Submitted' : isPastDue ? 'Overdue' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100'>
               <div className='flex items-center gap-3 mb-6'>
                <FaStar className='text-yellow-500' />
                <h4 className='font-bold text-gray-800'>Grading</h4>
              </div>
              <div className='space-y-2'>
                 <p className='text-sm font-medium text-gray-500'>Maximum points possible for this task:</p>
                 <p className='text-3xl font-black text-gray-800'>{assignment?.maxPoints}</p>
              </div>
            </div>

            <div className='bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100'>
              <h4 className='font-black text-base mb-4 tracking-tight uppercase'>Secure Submission</h4>
              <p className='text-sm text-indigo-100 font-medium leading-relaxed opacity-80'>
                All submissions are encrypted and run through our automated AI check. You can update your submission as many times as you like before the final grade is posted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitAssignment;

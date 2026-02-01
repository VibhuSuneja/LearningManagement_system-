import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeftLong, FaCloudUploadAlt, FaCalendarAlt, FaStar, FaInfoCircle, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useSelector } from 'react-redux';

function CreateAssignment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lectureId: '',
    dueDate: '',
    maxPoints: 100,
    instructions: '',
    allowedFileTypes: 'pdf,doc,docx,zip,txt',
    maxFileSize: 10 // MB
  });
  
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, {
        withCredentials: true
      });
      setCourse(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch course details");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      data.append('courseId', courseId);
      
      files.forEach(file => {
        data.append('attachments', file);
      });

      await axios.post(`${serverUrl}/api/assignment/create`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      toast.success("Assignment created successfully! 📝");
      navigate(`/viewlecture/${courseId}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create assignment");
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
            <h1 className='text-3xl font-black text-gray-800 tracking-tight'>Create Assignment</h1>
            <p className='text-gray-500 font-medium'>{course?.title}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Left Column: Essential Info */}
            <div className='md:col-span-2 space-y-6'>
              <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-200'>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-bold text-gray-700 mb-1.5'>Assignment Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Final Project Proposal"
                      className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all'
                    />
                  </div>
                  
                  <div>
                    <label className='block text-sm font-bold text-gray-700 mb-1.5'>Description & Context</label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the objective and requirements of this assignment..."
                      className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-bold text-gray-700 mb-1.5'>Special Instructions</label>
                    <textarea
                      name="instructions"
                      rows={3}
                      value={formData.instructions}
                      onChange={handleInputChange}
                      placeholder="Formatting requirements, submission guidelines, etc."
                      className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none'
                    />
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-200'>
                <label className='block text-sm font-bold text-gray-700 mb-4'>Reference Materials (Optional)</label>
                <div className='border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-black transition-all cursor-pointer relative'>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                  />
                  <FaCloudUploadAlt className='w-12 h-12 mx-auto text-gray-300 mb-3' />
                  <p className='text-sm font-bold text-gray-600'>Click or drag files to upload</p>
                  <p className='text-xs text-gray-400 mt-1'>PDF, Images, DOCX allowed</p>
                </div>
                {files.length > 0 && (
                  <div className='mt-4 flex flex-wrap gap-2'>
                    {files.map((file, idx) => (
                      <div key={idx} className='bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600 flex items-center gap-2'>
                        <FaFileAlt /> {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Settings */}
            <div className='space-y-6'>
              <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-200'>
                <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                  <FaCalendarAlt className='text-black' /> Deadline & Grading
                </h3>
                
                <div className='space-y-4'>
                  <div>
                    <label className='block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1'>Due Date</label>
                    <input
                      type="datetime-local"
                      name="dueDate"
                      required
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none font-bold text-sm'
                    />
                  </div>

                  <div>
                    <label className='block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1'>Max Points</label>
                    <div className='relative'>
                      <input
                        type="number"
                        name="maxPoints"
                        value={formData.maxPoints}
                        onChange={handleInputChange}
                        className='w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none font-bold text-sm'
                      />
                      <FaStar className='absolute left-3.5 top-3.5 text-yellow-500 text-xs' />
                    </div>
                  </div>

                  <div>
                    <label className='block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1'>Related Lecture</label>
                    <select
                      name="lectureId"
                      value={formData.lectureId}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none font-bold text-sm'
                    >
                      <option value="">General Assignment</option>
                      {course?.lectures?.map(lec => (
                        <option key={lec._id} value={lec._id}>{lec.lectureTitle}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className='bg-black p-6 rounded-2xl shadow-xl text-white'>
                <h3 className='font-bold mb-4 flex items-center gap-2 text-sm'>
                  <FaInfoCircle className='text-blue-400' /> Submission Rules
                </h3>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-[10px] font-bold text-gray-400 uppercase mb-1'>Allowed Types</label>
                    <input
                      type="text"
                      name="allowedFileTypes"
                      value={formData.allowedFileTypes}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-blue-500 outline-none text-xs font-mono'
                    />
                  </div>
                  <div>
                    <label className='block text-[10px] font-bold text-gray-400 uppercase mb-1'>Max Size (MB)</label>
                    <input
                      type="number"
                      name="maxFileSize"
                      value={formData.maxFileSize}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-blue-500 outline-none text-xs'
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className='w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3'
              >
                {submitting ? (
                  <>
                    <ClipLoader size={20} color='#fff' /> Creating...
                  </>
                ) : 'Publish Assignment'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAssignment;

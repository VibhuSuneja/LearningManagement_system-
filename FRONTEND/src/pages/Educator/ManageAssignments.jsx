import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaUsers, FaFileAlt, FaCalendarAlt, FaStar, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function ManageAssignments() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, assignmentId: null, assignmentTitle: '' });

  useEffect(() => {
    fetchAssignments();
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

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/assignment/course/${courseId}`,
        { withCredentials: true }
      );
      setAssignments(response.data.assignments || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch assignments');
      setLoading(false);
    }
  };

  const handleDelete = async (assignmentId) => {
    try {
      await axios.delete(`${serverUrl}/api/assignment/${assignmentId}`, {
        withCredentials: true
      });
      toast.success('Assignment deleted successfully');
      setDeleteModal({ show: false, assignmentId: null, assignmentTitle: '' });
      fetchAssignments(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete assignment');
    }
  };

  const openDeleteModal = (assignmentId, assignmentTitle) => {
    setDeleteModal({ show: true, assignmentId, assignmentTitle });
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
            <h1 className='text-3xl font-black text-gray-800 tracking-tight'>Manage Assignments</h1>
            <p className='text-gray-500 font-medium'>{courseName}</p>
          </div>
          <button
            onClick={() => navigate(`/create-assignment/${courseId}`)}
            className='bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2 font-bold shadow-lg shadow-gray-200'
          >
            <FaPlus /> Create Assignment
          </button>
        </div>

        {/* Assignment List */}
        {assignments.length === 0 ? (
          <div className='bg-white rounded-[32px] shadow-sm p-12 text-center border border-gray-100'>
            <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6'>
              <FaFileAlt className='w-10 h-10 text-gray-300' />
            </div>
            <h3 className='text-xl font-black text-gray-800 mb-2'>No Assignments Yet</h3>
            <p className='text-gray-500 mb-8 max-w-sm mx-auto'>Create tasks and projects to challenge your students and track their growth.</p>
            <button
              onClick={() => navigate(`/create-assignment/${courseId}`)}
              className='bg-black text-white px-8 py-3.5 rounded-2xl hover:bg-gray-800 transition-all inline-flex items-center gap-2 font-black tracking-tight shadow-xl shadow-gray-200'
            >
              <FaPlus /> Create Your First Assignment
            </button>
          </div>
        ) : (
          <div className='space-y-4'>
            {assignments.map((assignment) => (
              <div 
                key={assignment._id}
                className='bg-white rounded-[24px] shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 group'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                       <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          new Date(assignment.dueDate) < new Date() ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                       }`}>
                          {new Date(assignment.dueDate) < new Date() ? 'Expired' : 'Live'}
                       </span>
                       {assignment.lecture && (
                          <span className='text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-50 text-blue-500'>
                             {assignment.lecture.lectureTitle}
                          </span>
                       )}
                    </div>
                    
                    <h3 className='text-xl font-black text-gray-800 mb-1 group-hover:text-blue-600 transition-colors'>
                      {assignment.title}
                    </h3>
                    
                    <p className='text-sm text-gray-500 mb-4 line-clamp-2 font-medium bg-gray-50 p-3 rounded-xl border border-gray-50'>
                      {assignment.description}
                    </p>
                    
                    <div className='flex flex-wrap gap-6 mt-4'>
                      <div className='flex flex-col'>
                         <span className='text-[10px] font-black uppercase text-gray-400 mb-1'>Deadline</span>
                         <div className='flex items-center gap-2 text-gray-700 font-bold'>
                            <FaCalendarAlt className='text-gray-300' />
                            <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                         </div>
                      </div>
                      
                      <div className='flex flex-col'>
                         <span className='text-[10px] font-black uppercase text-gray-400 mb-1'>Points</span>
                         <div className='flex items-center gap-2 text-gray-700 font-bold'>
                            <FaStar className='text-yellow-400' />
                            <span>{assignment.maxPoints}</span>
                         </div>
                      </div>
                      
                      <div className='flex flex-col'>
                         <span className='text-[10px] font-black uppercase text-gray-400 mb-1'>Submissions</span>
                         <div className='flex items-center gap-2 text-gray-700 font-bold'>
                            <FaUsers className='text-blue-400' />
                            <span>{assignment.submissionCount || 0} Attempts</span>
                         </div>
                      </div>

                      <div className='flex flex-col'>
                         <span className='text-[10px] font-black uppercase text-gray-400 mb-1'>Grading</span>
                         <div className='flex items-center gap-2 text-green-600 font-bold'>
                            <FaCheckCircle className='text-green-400' />
                            <span>{assignment.gradedCount || 0} Reviewed</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-col gap-2'>
                    <button
                      onClick={() => navigate(`/grade-assignment/${assignment._id}`)}
                      className='px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all text-xs font-black shadow-lg shadow-gray-100'
                    >
                      Grade Submissions
                    </button>
                    <div className='flex gap-2'>
                        <button
                          onClick={() => navigate(`/create-assignment/${courseId}?edit=${assignment._id}`)}
                          className='flex-1 p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center border border-gray-100'
                          title='Edit'
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openDeleteModal(assignment._id, assignment.title)}
                          className='flex-1 p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center border border-red-50'
                          title='Delete'
                        >
                          <FaTrash />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 animate-fadeIn border border-gray-100'>
            <div className='text-center mb-8'>
              <div className='mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6'>
                <FaTrash className='text-red-500 text-2xl' />
              </div>
              <h3 className='text-2xl font-black text-gray-800 mb-2 tracking-tight'>Delete Assignment?</h3>
              <p className='text-gray-500 font-medium'>
                Are you sure you want to delete <span className='text-gray-800 font-bold'>"{deleteModal.assignmentTitle}"</span>?
              </p>
              <div className='mt-4 p-4 bg-red-50 rounded-2xl text-red-600 text-xs font-bold leading-relaxed'>
                WARNING: This will permanently remove all student submissions and grades associated with this assignment.
              </div>
            </div>
            
            <div className='flex gap-3'>
              <button
                onClick={() => setDeleteModal({ show: false, assignmentId: null, assignmentTitle: '' })}
                className='flex-1 px-4 py-3.5 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-all font-black uppercase tracking-widest text-[10px]'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.assignmentId)}
                className='flex-1 px-4 py-3.5 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-100'
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAssignments;

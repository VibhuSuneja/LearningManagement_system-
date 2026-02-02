import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaCalendarAlt, FaStar, FaCheckCircle, FaClock, FaArrowRight, FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { useSelector } from 'react-redux';

function AssignmentList({ courseId }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/assignment/course/${courseId}`, {
        withCredentials: true
      });
      setAssignments(response.data.assignments || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <ClipLoader size={30} color="#000" />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <FaFileAlt className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">No assignments yet</h3>
          <p className="text-sm text-gray-500">Stay tuned for upcoming tasks</p>
        </div>
        {userData?.role === 'educator' && (
          <button 
            onClick={() => navigate(`/create-assignment/${courseId}`)}
            className='w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl font-black text-gray-400 hover:border-black hover:text-black transition-all flex items-center justify-center gap-3'
          >
            <FaGraduationCap /> Create Your First Assignment
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div 
          key={assignment._id}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                  isOverdue(assignment.dueDate) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {isOverdue(assignment.dueDate) ? 'Overdue' : 'Active'}
                </span>
                {assignment.lecture && (
                    <span className='text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-blue-100 text-blue-600'>
                        {assignment.lecture.lectureTitle}
                    </span>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                {assignment.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {assignment.description}
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <FaCalendarAlt className="text-gray-300" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <FaStar className="text-yellow-500" />
                  <span>{assignment.maxPoints} Points</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {userData?.role === 'educator' ? (
                <button
                  onClick={() => navigate(`/grade-assignment/${assignment._id}`)}
                  className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  Submissions <FaArrowRight />
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/submit-assignment/${assignment._id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  Open Task <FaArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {userData?.role === 'educator' && (
        <button 
          onClick={() => navigate(`/create-assignment/${courseId}`)}
          className='w-full py-4 mt-2 border-2 border-dashed border-gray-200 rounded-2xl font-black text-gray-400 hover:border-black hover:text-black transition-all flex items-center justify-center gap-3'
        >
          <FaGraduationCap /> Create New Assignment
        </button>
      )}
    </div>
  );
}

export default AssignmentList;

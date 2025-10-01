import React from 'react'
import { FaArrowLeft } from "react-icons/fa6"
import { useParams , useNavigate} from 'react-router-dom'
function EditLectures() {
    const {courseId, lectureId}= useParams()
    const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>

        <div className='w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6'>

            {/* header */}
                    <div className="flex items-center gap-2 mb-2">
          <FaArrowLeft className="text-gray-600 cursor-pointer" onClick={()=>navigate(`/createlecture/${courseId}`)} />
          <h2 className="text-xl font-semibold text-gray-800">Update Your Course Lecture</h2>
        </div>
        </div>
    </div>
  )
}

export default EditLectures
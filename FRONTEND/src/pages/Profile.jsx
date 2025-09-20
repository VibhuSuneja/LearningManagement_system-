import { useSelector } from "react-redux"

function Profile() {
  const {userData}=useSelector(state=>state.user)
  return <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center ">
  <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative" >
    <div className="flex flex-col items-center text-center">
  {userData?.photoUrl ? <img src={userData?.photoUrl} className="w-24 h-24 rounded-full object-cover border-4 border-[black]" alt=""/>:
<div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black  border-white cursor-pointer'>
         {userData?.name.slice(0,1).toUpperCase()}
          </div>}
          <h2  className="text-2xl font-bold mt-4 text-gray-800">{userData?.name}</h2>
           <p className="text-sm text-gray-500">{userData.role}</p>
  </div>


<div className="mt-6 space-y-4">
  <div className="text-sm flex items-center justify-start gap-1"> 
    <span className="font-semibold text-gray-700">Email:</span>
    <span>{userData.email}</span>
  </div>
    <div className="text-sm flex items-center justify-start gap-1">
    <span className="font-semibold text-gray-700">Bio:</span>
    <span>{userData.description}</span>
  </div>
    <div className="text-sm flex items-center justify-start gap-1">
    <span className="font-semibold text-gray-700">Enrolled Courses:</span>
    <span>{userData.enrolledCourses.length}</span>
  </div>
</div>
  </div>

  </div>
}

export default Profile

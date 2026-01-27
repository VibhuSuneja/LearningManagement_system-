import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeftLong } from "react-icons/fa6";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center ">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative">
        <FaArrowLeftLong className='absolute top-[8%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            {userData?.photoUrl ? (
              <img
                src={userData?.photoUrl}
                className="w-24 h-24 rounded-full object-cover border-4 border-black"
                alt=""
              />
            ) : (
              <div className="w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black border-white cursor-pointer">
                {userData?.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded-full border-2 border-white shadow-sm">
                LVL {userData?.level || 1}
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            {userData?.name}
          </h2>
          <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">{userData.role}</p>
          
          {/* XP Progress Bar */}
          <div className="w-full mt-4">
            <div className="flex justify-between text-[10px] font-black mb-1">
                <span>XP: {userData?.points || 0}</span>
                <span>NEXT LEVEL: {((userData?.level || 1) * 500)}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                    className="bg-black h-full transition-all duration-500" 
                    style={{ width: `${((userData?.points % 500) / 500) * 100}%` }}
                ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-sm flex items-center justify-start gap-1">
            <span className="font-semibold text-gray-700">Email:</span>
            <span>{userData.email}</span>
          </div>
          
          <div className="text-sm flex flex-col items-start gap-2">
            <span className="font-semibold text-gray-700">Achievements:</span>
            <div className="flex flex-wrap gap-2">
                {userData?.badges?.length > 0 ? (
                    userData.badges.map((badge, index) => (
                        <div key={index} title={badge.description} className="flex flex-col items-center bg-gray-50 p-2 rounded-xl border border-gray-100 hover:scale-105 transition-transform cursor-help">
                            <span className="text-xl">{badge.icon}</span>
                            <span className="text-[8px] font-bold uppercase">{badge.name}</span>
                        </div>
                    ))
                ) : (
                    <span className="text-xs text-gray-400 italic">No badges earned yet. Enroll in a course to start!</span>
                )}
            </div>
          </div>

          <div className="text-sm flex items-center justify-start gap-1">
            <span className="font-semibold text-gray-700">
              Enrolled Courses:
            </span>
            <span>{userData.enrolledCourses.length}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-5 py-2 rounded bg-[black] text-white active:bg-[#4b4b4b] cursor-pointer transition" onClick={()=>navigate("/editprofile")}>
            Edit Profile
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default Profile;

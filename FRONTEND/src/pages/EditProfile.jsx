import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";
function EditProfile() {
    const navigate=useNavigate();
    const {userData} =useSelector((state)=>state.user);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
                    <FaArrowLeftLong  className='absolute top-[5%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/profile")}/>
                        <form action="" className='space-y-5'>
           <div className="flex flex-col items-center text-center">
          {userData.photoUrl ? <img
            src={userData?.photoUrl}
            alt=""
            className="w-24 h-24 rounded-full object-cover border-4 border-[black]"
          /> : <div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black  border-white cursor-pointer'>
         {userData?.name.slice(0,1).toUpperCase()}
          </div>}
          </div>
                        </form>
        </div>
    </div>
  )
}

export default EditProfile
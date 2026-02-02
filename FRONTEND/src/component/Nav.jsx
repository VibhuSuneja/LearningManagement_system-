import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import { IoPersonCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import NotificationTray from "./NotificationTray";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiTireIronCross } from "react-icons/gi";
import { FaFire } from "react-icons/fa";

function Nav() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [showHam, setShowHam] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      dispatch(setUserData(null));
      console.log(result.data);
      toast.success("Logout successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div>
      <div className="w-[100%] h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-[#00000047] z-10">
        {/* LOGO */}
        <div className="lg:w-[20%] w-[40%] lg:pl-[50px]">
          <img
            src={logo}
            alt="logo"
            className="w-[60px] rounded-[5px] border-2 border-white"
          />
        </div>

        {/* DESKTOP NAV */}
        <div className="w-[45%] lg:flex items-center justify-end gap-5 hidden">
          {userData && (
            <div 
              title="Daily Learning Streak"
              className="flex items-center gap-1.5 bg-black/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 group hover:scale-110 transition-all cursor-default"
            >
              <FaFire className={`text-xl ${userData.streak > 0 ? "text-orange-500 animate-pulse" : "text-gray-400 opacity-50"}`} />
              <span className="font-black text-white text-sm">{userData.streak || 0}</span>
            </div>
          )}
          {userData && <NotificationTray />}
          {!userData ? (
            <IoPersonCircle
              className="w-[50px] h-[50px] fill-black cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            />
          ) : (
            <>
              {userData.photoUrl && userData.photoUrl !== "" ? (
                <img
                  src={userData.photoUrl}
                  className="w-[50px] h-[50px] rounded-full border-2 border-white cursor-pointer"
                  alt="user avatar"
                  onClick={() => setShow((prev) => !prev)}
                />
              ) : (
                <div
                  className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer"
                  onClick={() => setShow((prev) => !prev)}
                >
                  {userData?.name ? userData.name.slice(0, 1).toUpperCase() : "U"}
                </div>
              )}
            </>
          )}

          {userData?.role === "educator" && (
            <div
              className="px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white bg-[black] text-black rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </div>
          )}

          {!userData ? (
            <span
              className="px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] font-light cursor-pointer bg-[#000000d5]"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          ) : (
            <span
              className="px-[20px] py-[10px] bg-white text-black rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer"
              onClick={handleLogout}
            >
              LogOut
            </span>
          )}

          {show && userData && (
            <div className="absolute top-[110%] right-[15%] flex flex-col items-center justify-center gap-2 text-[16px] rounded-md bg-white px-[15px] py-[10px] border-[2px] border-black hover:border-white hover:text-white hover:bg-black cursor-pointer">
              <span
                className="bg-[black] text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600"
                onClick={() => navigate("/profile")}
              >
                My Profile
              </span>
              <span
                className="bg-[black] text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600"
                onClick={() => navigate("/leaderboard")}
              >
                Leaderboard
              </span>
              <span
                className="bg-[black] text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600"
                onClick={() => navigate("/forum")}
              >
                Community Forum
              </span>
              <span
                className="bg-[black] text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600"
                onClick={() => navigate("/mycourses")}
              >
                My Courses
              </span>
              <span
                className="bg-[black] text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600"
                onClick={() => navigate("/chat")}
              >
                Messages
              </span>
            </div>
          )}
        </div>

        {/* MOBILE NAV */}
        <RxHamburgerMenu
          className="w-[35px] h-[35px] lg:hidden text-white fill-black cursor-pointer"
          onClick={() => setShowHam((prev) => !prev)}
        />

        <div
          className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000000d6] flex items-center justify-center flex-col gap-5 z-10 lg:hidden ${
            showHam
              ? "translate-x-[0%] transition duration-600"
              : "translate-x-[-100%] transition duration-600"
          }`}
        >
          <GiTireIronCross
            className="w-[35px] h-[35px] fill-white absolute top-5 right-[4%]"
            onClick={() => setShowHam((prev) => !prev)}
          />

          {!userData ? (
            <IoPersonCircle className="w-[50px] h-[50px] fill-black cursor-pointer" />
          ) : (
            <>
              {userData.photoUrl ? (
                <img
                  src={userData.photoUrl}
                  className="w-[50px] h-[50px] rounded-full border-2 bg-black border-white cursor-pointer"
                  alt="user avatar"
                />
              ) : (
                <div className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer">
                  {userData?.name ? userData.name.slice(0, 1).toUpperCase() : "U"}
                </div>
              )}

              <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-2xl border border-white/20 mb-2">
                <FaFire className={`text-2xl ${userData.streak > 0 ? "text-orange-500 animate-pulse" : "text-gray-400 opacity-50"}`} />
                <span className="font-black text-white text-xl">{userData.streak || 0} DAY STREAK</span>
              </div>

              <div
                className="w-[200px] h-[65px] border-2 border-white text-white bg-[black] flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                My Profile
              </div>

              <div
                className="w-[200px] h-[65px] border-2 border-white text-white bg-[black] flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer"
                onClick={() => navigate("/leaderboard")}
              >
                Leaderboard
              </div>
              
              <div
                className="w-[200px] h-[65px] border-2 border-white text-white bg-[black] flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer"
                onClick={() => navigate("/forum")}
              >
                Community Forum
              </div>

              <div
                className="w-[200px] h-[65px] border-2 border-white text-white bg-[black] flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer"
                onClick={() => navigate("/mycourses")}
              >
                My Courses
              </div>

               <div
                className="w-[200px] h-[65px] border-2 border-white text-white bg-[black] flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer"
                onClick={() => navigate("/chat")}
              >
                Messages
              </div>

              {userData?.role === "educator" && (
                <div
                  className="w-[200px] h-[65px] border-2 border-white text-white bg-black flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </div>
              )}
            </>
          )}

          {!userData ? (
            <span
              className="w-[200px] h-[65px] border-2 border-white text-white bg-black flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          ) : (
            <span
              className="w-[200px] h-[65px] border-2 border-white text-white bg-black flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer"
              onClick={handleLogout}
            >
              LogOut
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;

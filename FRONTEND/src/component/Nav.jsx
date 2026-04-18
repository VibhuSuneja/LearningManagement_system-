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
    <div className="relative">
      <div className="w-full h-[70px] fixed top-0 px-4 md:px-10 py-3 flex items-center justify-between bg-black/40 backdrop-blur-md z-[100] border-b border-white/10">
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="logo"
            className="w-[45px] h-[45px] rounded-xl border border-white/20 group-hover:scale-110 transition-transform"
          />
          <span className="text-white font-black text-xl tracking-tighter hidden sm:block">V-LMS</span>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center justify-end gap-6 flex-1">
          {userData && (
            <div 
              title="Daily Learning Streak"
              className="flex items-center gap-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 group hover:border-orange-500/50 transition-all cursor-default"
            >
              <FaFire className={`text-xl ${userData.streak > 0 ? "text-orange-500 animate-pulse" : "text-gray-400 opacity-50"}`} />
              <span className="font-black text-white text-sm">{userData.streak || 0}</span>
            </div>
          )}
          
          {userData && <NotificationTray />}

          <div className="flex items-center gap-4 border-l border-white/10 pl-6 h-8">
            {!userData ? (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate("/login")}
              >
                <IoPersonCircle className="w-10 h-10 text-white" />
                <span className="text-white font-bold text-sm">Login</span>
              </div>
            ) : (
              <div className="relative group/user">
                <div 
                  className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/20 cursor-pointer hover:border-white transition-all shadow-lg"
                  onClick={() => setShow((prev) => !prev)}
                >
                  {userData.photoUrl ? (
                    <img src={userData.photoUrl} className="w-full h-full object-cover" alt="avatar" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black text-white flex items-center justify-center font-bold">
                      {userData?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Desktop Dropdown */}
                {show && (
                  <div className="absolute top-[120%] right-0 w-[240px] bg-black/90 backdrop-blur-2xl rounded-[24px] border border-white/20 p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    {[
                      { label: "My Profile", path: "/profile" },
                      { label: "Leaderboard", path: "/leaderboard" },
                      { label: "Community Forum", path: "/forum" },
                      { label: "My Courses", path: "/mycourses" },
                      { label: "Messages", path: "/chat" },
                      { label: "About Us", path: "/about" },
                    ].map((item) => (
                      <button
                        key={item.path}
                        onClick={() => { navigate(item.path); setShow(false); }}
                        className="w-full text-left px-5 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all text-sm font-bold tracking-tight"
                      >
                        {item.label}
                      </button>
                    ))}
                    {userData?.role === "educator" && (
                      <button
                        onClick={() => { navigate("/dashboard"); setShow(false); }}
                        className="w-full text-left px-5 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all text-sm font-black mt-2"
                      >
                        Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-all text-sm font-bold mt-1"
                    >
                      LogOut
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex lg:hidden items-center gap-4">
          {userData && <NotificationTray />}
          <button 
            onClick={() => setShowHam(!showHam)}
            className="p-2 bg-white/10 rounded-xl border border-white/20 text-white"
          >
            {showHam ? <GiTireIronCross size={24} /> : <RxHamburgerMenu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`fixed inset-0 top-[70px] w-full h-[calc(100vh-70px)] bg-black/95 backdrop-blur-2xl z-[90] lg:hidden transition-all duration-500 ease-in-out ${
            showHam ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <div className="flex flex-col h-full p-8 space-y-4 overflow-y-auto pb-20">
            {userData && (
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-[24px] border border-white/10 mb-2">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20">
                  {userData.photoUrl ? (
                    <img src={userData.photoUrl} className="w-full h-full object-cover" alt="avatar" />
                  ) : (
                    <div className="w-full h-full bg-black text-white flex items-center justify-center text-2xl font-black">
                      {userData?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-black text-lg leading-none">{userData.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-orange-500 text-xs font-black uppercase tracking-widest">
                    <FaFire /> {userData.streak || 0} day streak
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "My Profile", path: "/profile" },
                { label: "Leaderboard", path: "/leaderboard" },
                { label: "Community Forum", path: "/forum" },
                { label: "My Courses", path: "/mycourses" },
                { label: "Messages", path: "/chat" },
                { label: "About Us", path: "/about" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setShowHam(false); }}
                  className="w-full py-4 px-6 bg-white/5 border border-white/10 text-white rounded-[20px] text-lg font-bold text-left hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                  {item.label}
                </button>
              ))}
              
              {userData?.role === "educator" && (
                <button
                  onClick={() => { navigate("/dashboard"); setShowHam(false); }}
                  className="w-full py-5 px-6 bg-white text-black rounded-[20px] text-lg font-black text-left active:scale-[0.98] transition-all"
                >
                  Educator Dashboard
                </button>
              )}

              {!userData ? (
                <button
                  onClick={() => { navigate("/login"); setShowHam(false); }}
                  className="w-full py-5 px-6 bg-blue-600 text-white rounded-[20px] text-lg font-black text-center active:scale-[0.98] transition-all mt-4"
                >
                  Getting Started
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full py-5 px-6 bg-red-600/20 border border-red-600/30 text-red-500 rounded-[20px] text-lg font-bold text-center active:scale-[0.98] transition-all mt-4"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;

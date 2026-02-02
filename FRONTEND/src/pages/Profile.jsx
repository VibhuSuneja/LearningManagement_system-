import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaUserPlus, FaUserCheck, FaEnvelope, FaLink, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

function Profile() {
  const { userId: paramId } = useParams();
  const { userData: loggedInUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = !paramId || paramId === loggedInUser?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (isOwnProfile) {
        setProfileUser(loggedInUser);
        setLoading(false);
      } else {
        try {
          const res = await axios.get(`${serverUrl}/api/user/${paramId}`, { withCredentials: true });
          setProfileUser(res.data);
          setIsFollowing(res.data.followers?.includes(loggedInUser?._id));
        } catch (err) {
          toast.error("User not found");
          navigate("/");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [paramId, loggedInUser, isOwnProfile]);

  const handleFollow = async () => {
    try {
        const res = await axios.post(`${serverUrl}/api/forum/user/${paramId}/follow`, {}, { withCredentials: true });
        setIsFollowing(res.data.isFollowing);
        // Optimistic update for followers count
        setProfileUser(prev => ({
            ...prev,
            followers: res.data.isFollowing 
                ? [...(prev.followers || []), loggedInUser._id]
                : (prev.followers || []).filter(id => id !== loggedInUser._id)
        }));
        toast.info(res.data.isFollowing ? "Successfully followed!" : "Unfollowed");
    } catch (err) {
        toast.error("Error following user");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black">LOADING PROFILE...</div>;
  if (!profileUser) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-4 py-10 flex items-center justify-center font-sans">
      <div className="bg-white shadow-2xl rounded-[40px] p-10 max-w-2xl w-full relative border border-gray-100">
        <FaArrowLeftLong className='absolute top-10 left-10 w-6 h-6 cursor-pointer hover:-translate-x-2 transition-transform' onClick={()=>navigate("/")}/>
        
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            {profileUser?.photoUrl ? (
              <img
                src={profileUser?.photoUrl}
                className="w-32 h-32 rounded-full object-cover border-[6px] border-black shadow-2xl"
                alt=""
              />
            ) : (
              <div className="w-32 h-32 rounded-full text-white flex items-center justify-center text-[40px] border-[6px] bg-black border-white shadow-2xl font-black">
                {profileUser?.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black text-xs font-black px-4 py-1.5 rounded-full border-4 border-white shadow-lg">
                LVL {profileUser?.level || 1}
            </div>
          </div>

          <h2 className="text-3xl font-black text-black uppercase tracking-tight">
            {profileUser?.name}
          </h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mt-1 mb-4">{profileUser.role}</p>
          
          <div className="flex gap-8 mb-8">
            <div className="flex flex-col">
                <span className="text-xl font-black">{profileUser.followers?.length || 0}</span>
                <span className="text-[10px] font-black text-gray-400 uppercase">Followers</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-black">{profileUser.following?.length || 0}</span>
                <span className="text-[10px] font-black text-gray-400 uppercase">Following</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-black">{profileUser.points || 0}</span>
                <span className="text-[10px] font-black text-gray-400 uppercase">XP Points</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-black text-orange-500">{profileUser.streak || 0} 🔥</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Current Streak</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-black text-blue-500">{profileUser.maxStreak || 0} 🏆</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Max Streak</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full max-w-md bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div className="flex justify-between text-[10px] font-black mb-2 text-gray-400">
                <span>XP PROGRESS</span>
                <span>{profileUser?.points % 500} / 500 TO LVL {(profileUser?.level || 1) + 1}</span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
                <div 
                    className="bg-black h-full transition-all duration-1000" 
                    style={{ width: `${((profileUser?.points % 500) / 500) * 100}%` }}
                ></div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">About User</h4>
              <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  {profileUser.bio || "No bio available."}
              </p>
              
              <div className="flex gap-4 pt-2">
                  {profileUser.socialLinks?.twitter && <a href={profileUser.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors"><FaTwitter /></a>}
                  {profileUser.socialLinks?.linkedin && <a href={profileUser.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors"><FaLinkedin /></a>}
                  {profileUser.socialLinks?.github && <a href={profileUser.socialLinks.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors"><FaGithub /></a>}
              </div>
          </div>

          <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {profileUser?.badges?.length > 0 ? (
                    profileUser.badges.map((badge, index) => (
                        <div key={index} title={badge.description} className="flex flex-col items-center bg-black text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform cursor-help">
                            <span className="text-2xl">{badge.icon}</span>
                            <span className="text-[7px] font-black uppercase mt-1 tracking-tighter">{badge.name}</span>
                        </div>
                    ))
                ) : (
                    <span className="text-xs text-gray-300 italic font-medium">No achievements unlocked yet.</span>
                )}
              </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          {isOwnProfile ? (
            <div className="flex flex-col w-full gap-3">
              <button 
                  className="w-full bg-black text-white font-black py-4 rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-sm tracking-widest uppercase" 
                  onClick={()=>navigate("/editprofile")}
              >
                Configure Profile
              </button>
              <button 
                  className="w-full bg-indigo-50 text-indigo-700 border-2 border-indigo-100 font-black py-3 rounded-2xl hover:bg-indigo-100 transition-all text-xs tracking-widest uppercase flex items-center justify-center gap-2" 
                  onClick={() => window.startAppTour && window.startAppTour()}
              >
                Retake Platform Tour
              </button>
            </div>
          ) : (
            <>
                <button 
                    onClick={handleFollow}
                    className={`flex-1 font-black py-4 rounded-2xl shadow-xl transition-all text-sm uppercase flex items-center justify-center gap-2 ${isFollowing ? 'bg-gray-100 text-gray-500' : 'bg-black text-white'}`}
                >
                    {isFollowing ? <><FaUserCheck /> Following</> : <><FaUserPlus /> Follow</>}
                </button>
                <button 
                    onClick={() => navigate(`/chat`)}
                    className="flex-1 bg-white border-2 border-black text-black font-black py-4 rounded-2xl shadow-md hover:bg-gray-50 transition-all text-sm uppercase flex items-center justify-center gap-2"
                >
                    <FaEnvelope /> Message
                </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

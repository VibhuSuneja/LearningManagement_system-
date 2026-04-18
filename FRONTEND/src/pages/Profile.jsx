import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaUserPlus, FaUserCheck, FaEnvelope, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import Nav from "../component/Nav";
import Footer from "../component/Footer";

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#000]">
      <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse" />
          <div className="w-16 h-16 border-4 border-white/5 border-t-white rounded-full animate-spin relative z-10"></div>
      </div>
    </div>
  );

  if (!profileUser) return null;

  return (
    <div className="min-h-screen bg-[#000] font-['Inter'] selection:bg-white selection:text-black overflow-x-hidden">
      <Nav />
      
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      <main className="pt-[100px] md:pt-[120px] pb-24 px-4 md:px-12 lg:px-24 max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
          
          {/* Left Column: Personnel Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-4 space-y-8 w-full"
          >
            <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-[40px] md:rounded-[48px] p-8 md:p-12 text-center relative overflow-hidden group shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)]">
              {/* Decorative Elements */}
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-1000"></div>
              
              <div className="relative mb-8 md:mb-10 inline-block">
                <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
                {profileUser?.photoUrl ? (
                  <img
                    src={profileUser?.photoUrl}
                    className="w-40 h-40 md:w-56 md:h-56 rounded-[50px] md:rounded-[60px] object-cover border-8 border-white/5 shadow-2xl relative z-10 hover:scale-[1.02] transition-transform duration-700"
                    alt={profileUser?.name}
                  />
                ) : (
                  <div className="w-40 h-40 md:w-56 md:h-56 rounded-[50px] md:rounded-[60px] text-white flex items-center justify-center text-6xl md:text-7xl bg-gradient-to-br from-white/10 to-white/5 border-8 border-white/5 shadow-2xl font-black relative z-10 font-['Outfit']">
                    {profileUser?.name ? profileUser.name.slice(0, 1).toUpperCase() : "U"}
                  </div>
                )}
                <div className="absolute -bottom-3 right-3 md:-bottom-4 md:right-4 bg-white text-black text-[9px] md:text-[10px] font-black px-4 md:px-6 py-1.5 md:py-2 rounded-full border-[4px] md:border-[6px] border-[#000] shadow-2xl z-20 tracking-widest uppercase">
                    Echelon {profileUser?.level || 1}
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none font-['Outfit']">
                    {profileUser?.name || "User"}
                </h2>
                <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[8.5px] text-blue-400 uppercase tracking-[0.4em] font-black">
                    {profileUser?.role}
                </div>
                
                <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto italic font-medium pt-4">
                    "{profileUser.bio || "Synchronizing identity... No telemetry available for this individual."}"
                </p>
              </div>

              <div className="flex justify-center gap-4 md:gap-5 mt-8 md:mt-10 relative z-10">
                  {profileUser.socialLinks?.twitter && <a href={profileUser.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-[15px] md:rounded-[18px] bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 hover:-translate-y-1"><FaTwitter size={16} /></a>}
                  {profileUser.socialLinks?.linkedin && <a href={profileUser.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-[15px] md:rounded-[18px] bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 hover:-translate-y-1"><FaLinkedin size={16} /></a>}
                  {profileUser.socialLinks?.github && <a href={profileUser.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-[15px] md:rounded-[18px] bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 hover:-translate-y-1"><FaGithub size={16} /></a>}
              </div>
              
              <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-6 relative z-10">
                <div className="text-center space-y-1">
                    <span className="block text-2xl md:text-3xl font-black text-white tracking-tighter">{profileUser.followers?.length || 0}</span>
                    <span className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Followers</span>
                </div>
                <div className="text-center space-y-1">
                    <span className="block text-2xl md:text-3xl font-black text-white tracking-tighter">{profileUser.following?.length || 0}</span>
                    <span className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Following</span>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 relative z-10">
                {isOwnProfile ? (
                  <button 
                    onClick={() => navigate("/editprofile")}
                    className="w-full bg-white text-black font-black py-4 md:py-5 rounded-[20px] md:rounded-[24px] shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] md:text-[11px] tracking-[0.4em] uppercase"
                  >
                    Edit Neural ID
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button 
                      onClick={handleFollow}
                      className={`flex-1 font-black py-4 md:py-5 rounded-[20px] md:rounded-[24px] shadow-2xl transition-all text-[10px] md:text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 border ${isFollowing ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-white text-black border-transparent hover:bg-gray-100'}`}
                    >
                      {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                      {isFollowing ? "Connected" : "Connect"}
                    </button>
                    <button 
                      onClick={() => navigate(`/chat`)}
                      className="w-14 h-14 md:w-16 md:h-16 bg-white/[0.02] border border-white/10 text-white rounded-[20px] md:rounded-[24px] flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all active:scale-90"
                    >
                      <FaEnvelope size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Telemetry & Progress */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-8 space-y-10 md:space-y-12 w-full"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {[
                { label: 'Neural Experience', value: profileUser.points || 0, color: 'blue', suffix: 'XP' },
                { label: 'Active Sequence', value: profileUser.streak || 0, color: 'orange', suffix: '🔥' },
                { label: 'Peak Resonance', value: profileUser.maxStreak || 0, color: 'indigo', suffix: '🏆' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/[0.01] backdrop-blur-3xl border border-white/5 p-8 md:p-10 rounded-[30px] md:rounded-[35px] flex flex-col items-center justify-center text-center relative group overflow-hidden">
                  <div className={`absolute inset-0 bg-${stat.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tighter relative mb-2">
                    {stat.value}<span className="text-lg md:text-xl ml-2 font-black">{stat.suffix}</span>
                  </span>
                  <span className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-[0.4em] relative">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* XP Advancement Card */}
            <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[40px] md:rounded-[48px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-white/10 transition-all duration-1000" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-10 mb-8 md:mb-10 relative z-10">
                    <div className="space-y-3 md:space-y-4">
                        <span className="text-[9px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.6em] block">Development Sync</span>
                        <h4 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none font-['Outfit']">Level {profileUser?.level || 1} Elite</h4>
                        <p className="text-white/40 text-xs md:text-sm font-medium">Navigating towards the next synaptic milestone.</p>
                    </div>
                    <div className="text-right bg-white/5 px-5 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-white/10 self-end md:self-auto">
                        <span className="text-xl md:text-2xl font-black text-white tracking-tighter block">{profileUser?.points % 500} <span className="text-xs text-white/40 font-bold ml-1">/ 500 XP</span></span>
                    </div>
                </div>
                
                <div className="relative z-10 space-y-4">
                    <div className="w-full bg-white/5 h-3.5 md:h-4 rounded-full overflow-hidden shadow-inner p-1 border border-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${((profileUser?.points % 500) / 500) * 100}%` }}
                            transition={{ duration: 2, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
                            className="bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-600 h-full rounded-full shadow-[0_0_30px_rgba(59,130,246,0.3)] relative"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                    </div>
                    <div className="flex justify-between items-center text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">
                        <span>Level {(profileUser?.level || 1)}</span>
                        <span>Level {(profileUser?.level || 1) + 1}</span>
                    </div>
                </div>
            </div>

            {/* Neural Badges Section */}
            <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[40px] md:rounded-[48px] relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 md:mb-12">
                   <h4 className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Neural Achievement Badges</h4>
                   <div className="h-[1px] flex-1 bg-white/10 mx-6 md:mx-8 hidden sm:block" />
                </div>
                
                <div className="flex flex-wrap gap-4 md:gap-6 justify-center sm:justify-start">
                    {profileUser?.badges?.length > 0 ? (
                        profileUser.badges.map((badge, index) => (
                            <motion.div 
                                key={index} 
                                whileHover={{ scale: 1.05, y: -5 }}
                                title={badge?.description} 
                                className="w-20 h-28 md:w-24 md:h-32 flex flex-col items-center justify-center bg-white/[0.02] border border-white/10 rounded-[20px] md:rounded-[24px] shadow-xl cursor-help transition-all group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-3xl md:text-4xl mb-2 md:mb-3 relative z-10 group-hover:scale-110 transition-transform">{badge?.icon}</span>
                                <span className="text-[7px] md:text-[8px] font-black uppercase text-center text-white/40 tracking-widest px-2 relative z-10 group-hover:text-white transition-colors">{badge?.name}</span>
                            </motion.div>
                        ))
                    ) : (
                        <div className="w-full py-12 md:py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/5 rounded-[32px] group">
                             <div className="w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] bg-white/5 flex items-center justify-center text-white/10 mb-4 md:mb-6 text-2xl md:text-3xl font-black group-hover:bg-white/10 transition-colors">?</div>
                             <p className="text-[10px] md:text-[11px] text-white/20 font-black uppercase tracking-[0.4em]">Awaiting Achievement Signal</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Security & Access (Own Profile) */}
            {isOwnProfile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
                  <button 
                    onClick={() => navigate("/privacy-center")}
                    className="group bg-white/[0.01] border border-white/5 p-8 md:p-10 rounded-[35px] md:rounded-[40px] text-left hover:bg-white/[0.03] transition-all active:scale-[0.98] relative overflow-hidden shadow-2xl"
                  >
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-[15px] md:rounded-[18px] bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-indigo-500/10">🛡️</div>
                    <h5 className="font-black text-white uppercase text-[12px] md:text-sm tracking-[0.2em] mb-2 font-['Outfit']">Privacy Nexus</h5>
                    <p className="text-[9px] text-white/30 uppercase font-black tracking-widest leading-relaxed">Manage your neural data footprints and security protocols.</p>
                  </button>
                  <button 
                    onClick={() => navigate("/billing")}
                    className="group bg-white/[0.01] border border-white/5 p-8 md:p-10 rounded-[35px] md:rounded-[40px] text-left hover:bg-white/[0.03] transition-all active:scale-[0.98] relative overflow-hidden shadow-2xl"
                  >
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-[15px] md:rounded-[18px] bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-emerald-500/10">💳</div>
                    <h5 className="font-black text-white uppercase text-[12px] md:text-sm tracking-[0.2em] mb-2 font-['Outfit']">Fiscal Registry</h5>
                    <p className="text-[9px] text-white/30 uppercase font-black tracking-widest leading-relaxed">View developmental investments and transaction telemetry.</p>
                  </button>
              </div>
            )}
          </motion.div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Profile;


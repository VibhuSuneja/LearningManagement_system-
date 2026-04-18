import React, { useState, useEffect } from "react";
import { FaArrowLeftLong, FaPlus, FaChevronRight } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../App";
import { setLectureData } from "../../redux/lectureSlice";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "../../component/Nav";
import Footer from "../../component/Footer";

function CreateLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const dispatch = useDispatch();
  const { lectureData } = useSelector((state) => state.lecture);

  const handleCreateLecture = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Please enter a lecture title");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true }
      );
      dispatch(setLectureData([...(lectureData || []), result.data.lecture]));
      toast.success("Node Synchronized Successfully");
      setLectureTitle("");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Channel activation failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCourseLecture = async () => {
      try {
        const result = await axios.get(
          serverUrl + `/api/course/getcourselecture/${courseId}`,
          { withCredentials: true }
        );
        dispatch(setLectureData(result.data.lectures));
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to fetch neural pathways");
      } finally {
        setInitialLoading(false);
      }
    };
    getCourseLecture();
  }, [courseId, dispatch]);

  if (initialLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <ClipLoader color="white" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <Nav />

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/[0.03] blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
          <div className="space-y-4">
            <button 
              onClick={() => navigate(`/editcourse/${courseId}`)}
              className="flex items-center gap-3 text-white/30 hover:text-white transition-all group"
            >
              <FaArrowLeftLong className="group-hover:-translate-x-2 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node Configuration</span>
            </button>
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Pathway Expansion</h2>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                Add<br />
                <span className="text-white/20">Lecture</span>
              </h1>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 ml-1">Archive Size</p>
            <div className="px-8 py-4 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-black leading-none">{lectureData?.length || 0}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Active Nodes</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="text-2xl font-black leading-none text-white/40">--</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Live Sync</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Creation Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[48px] p-8 md:p-12 space-y-12"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tighter">Genesis Module</h3>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Enter metadata for new node</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Lecture Signature</label>
                <input
                  type="text"
                  placeholder="e.g. Architectural Foundations"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none focus:ring-1 focus:ring-white/10 transition-all font-medium placeholder:text-white/5"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateLecture}
                disabled={loading}
                className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] shadow-[0_20px_40px_rgba(255,255,255,0.05)] hover:bg-gray-200 transition-all flex justify-center items-center gap-3 disabled:opacity-20"
              >
                {loading ? <ClipLoader size={18} color="black" /> : (
                  <>
                    Deploy Node
                    <FaPlus size={10} />
                  </>
                )}
              </motion.button>
            </div>

            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-3">
              <div className="flex items-center gap-3 text-white/30">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <span className="text-[9px] font-black uppercase tracking-widest">Protocol Tip</span>
              </div>
              <p className="text-[10px] font-medium text-white/20 leading-relaxed uppercase tracking-wider">
                Each lecture node can support independent visual assets and interactive components. Title should be descriptive.
              </p>
            </div>
          </motion.div>

          {/* List Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-8 px-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Operational Modules</h2>
              <div className="h-px flex-1 mx-8 bg-white/5" />
            </div>

            <AnimatePresence mode="popLayout">
              {lectureData && lectureData.length > 0 ? (
                <div className="space-y-4">
                  {lectureData.map((lecture, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={lecture._id || index}
                      className="group bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-3xl p-6 flex items-center justify-between hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer"
                      onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black group-hover:bg-white group-hover:text-black transition-all">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-black uppercase tracking-tight group-hover:tracking-widest transition-all duration-500">
                            {lecture.lectureTitle}
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Status: Active Node</span>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">ID: {(lecture._id || "").slice(-6).toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-white transition-colors">
                          <FaEdit size={14} />
                        </div>
                        <FaChevronRight className="text-white/10 group-hover:translate-x-1 group-hover:text-white transition-all" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/[0.01] border border-dashed border-white/10 rounded-[40px] p-20 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <FaPlus className="text-white/10 text-3xl" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-[0.2em] text-white/20">Neural Void</h3>
                    <p className="text-white/10 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto">
                      No lecture nodes detected in this pathway. Initialize your first module above.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CreateLecture;

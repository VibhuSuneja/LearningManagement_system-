import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaArrowLeftLong, FaPlus, FaTrash, FaRobot, FaCheck, FaChevronDown, FaBrain, FaWandMagicSparkles, FaArrowLeft } from 'react-icons/fa6';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../../component/Nav';
import Footer from '../../component/Footer';

function CreateQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (location.state?.autoOpenAI) {
      setShowAiModal(true);
    }
  }, [location]);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [passingScore, setPassingScore] = useState(60);
  const [attempts, setAttempts] = useState(3);
  const [questions, setQuestions] = useState([{
    questionText: '',
    questionType: 'multiple-choice',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    points: 1,
    explanation: ''
  }]);
  
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [lectureContent, setLectureContent] = useState('');
  const [aiNumQuestions, setAiNumQuestions] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState('medium');

  const addQuestion = () => {
    setQuestions([...questions, {
      questionText: '',
      questionType: 'multiple-choice',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      points: 1,
      explanation: ''
    }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex][field] = value;
    if (field === 'isCorrect' && value === true) {
      newQuestions[questionIndex].options.forEach((opt, idx) => {
        if (idx !== optionIndex) opt.isCorrect = false;
      });
    }
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
  };

  const handleCreateQuiz = async () => {
    if (!title.trim()) {
      toast.error('Quiz title is required');
      return;
    }
    if (questions.length === 0) {
      toast.error('Add at least one question');
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        toast.error(`Question ${i + 1} text is required`);
        return;
      }
      if (q.options.length < 2) {
        toast.error(`Question ${i + 1} must have at least 2 options`);
        return;
      }
      if (!q.options.some(opt => opt.isCorrect)) {
        toast.error(`Question ${i + 1} must have a correct answer`);
        return;
      }
    }

    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/quiz/create`,
        { title, description, courseId, questions, duration, passingScore, attempts },
        { withCredentials: true }
      );
      toast.success('Cognitive Module Deployed');
      navigate(`/courses`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Deployment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!lectureContent.trim()) {
      toast.error('Synthesis source required');
      return;
    }
    setAiLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/ai-features/generate-quiz`,
        { courseId, lectureContent, numQuestions: aiNumQuestions, difficulty: aiDifficulty, questionTypes: ['multiple-choice', 'true-false'] },
        { withCredentials: true }
      );
      toast.success('AI Synthesis Complete');
      setShowAiModal(false);
      navigate(`/courses`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Synthesis failed');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans'>
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/[0.03] blur-[150px] rounded-full" />
        <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-blue-600/[0.02] blur-[100px] rounded-full" />
      </div>

      <Nav />

      <main className="relative pt-32 pb-24 px-4 md:px-10 max-w-7xl mx-auto">
        
        {/* Navigation & AI Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="space-y-8">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate("/courses")}
              className="group flex items-center gap-3 text-white/40 hover:text-white transition-all duration-300"
            >
              <div className="p-2.5 rounded-full border border-white/5 bg-white/[0.02] group-hover:bg-white/[0.05] group-hover:border-white/10 transition-all duration-300">
                <FaArrowLeft className="text-xs" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Education Hub</span>
            </motion.button>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-blue-500/50" />
                <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.5em]">Cognitive Evaluation Layer</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85]">
                Construct<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Quiz Module</span>
              </h1>
            </motion.div>
          </div>
          
          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAiModal(true)}
            className="relative group overflow-hidden px-10 py-5 rounded-[2rem] bg-white/[0.02] border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-4 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <FaRobot className="text-purple-400 group-hover:animate-bounce" />
            <span className="relative z-10">AI Synthesis Protocol</span>
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_purple] group-hover:animate-pulse" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Workspace */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Structural Parameters */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-10 md:p-14 rounded-[3rem] bg-[#0A0A0A] border border-white/5 overflow-hidden group hover:border-white/10 transition-all duration-700"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Core Configuration</h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Module Designation</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all duration-300 font-medium placeholder:text-white/10"
                      placeholder="e.g. Systemic Core Integration Assessment"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Objective Context</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] px-8 py-6 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all duration-300 h-32 resize-none font-medium placeholder:text-white/10"
                      placeholder="Define the evaluation scope and expected outcomes..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Temporal Limit (Min)</label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-blue-500/50 text-center font-black"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Competency Threshold %</label>
                      <input
                        type="number"
                        value={passingScore}
                        onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-blue-500/50 text-center font-black"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Attempt Iterations</label>
                      <input
                        type="number"
                        value={attempts}
                        onChange={(e) => setAttempts(parseInt(e.target.value) || 0)}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-blue-500/50 text-center font-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Questions Sequence */}
            <div className="space-y-8">
              <div className="flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <div className="h-px w-8 bg-white/10" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Evaluation Scodes</h3>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addQuestion}
                  className="flex items-center gap-3 px-6 py-3 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-white transition-all duration-300"
                >
                  <FaPlus size={10} />
                  Append Node
                </motion.button>
              </div>

              <div className="space-y-8">
                {questions.map((question, qIndex) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    key={qIndex} 
                    className="relative group bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-8 md:p-12 hover:border-white/10 transition-all duration-500"
                  >
                    <div className="absolute top-0 left-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white/5 text-8xl font-black italic">0{qIndex + 1}</span>
                    </div>

                    <div className="relative z-10 space-y-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="px-5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-blue-400">
                            Scode Cluster {qIndex + 1}
                          </span>
                        </div>
                        {questions.length > 1 && (
                          <button 
                            onClick={() => removeQuestion(qIndex)} 
                            className="p-3 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all duration-300"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Instructional Query</label>
                          <input
                            type="text"
                            value={question.questionText}
                            onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium placeholder:text-white/5"
                            placeholder="Enter the critical query domain..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Logical Mechanism</label>
                            <div className="relative">
                              <select
                                value={question.questionType}
                                onChange={(e) => {
                                  updateQuestion(qIndex, 'questionType', e.target.value);
                                  if (e.target.value === 'true-false') {
                                    const newQuestions = [...questions];
                                    newQuestions[qIndex].options = [
                                      { text: 'True', isCorrect: false },
                                      { text: 'False', isCorrect: false }
                                    ];
                                    setQuestions(newQuestions);
                                  }
                                }}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-8 py-4 text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer font-bold"
                              >
                                <option value='multiple-choice' className="bg-[#0A0A0A]">Multi-Context Choice</option>
                                <option value='true-false' className="bg-[#0A0A0A]">Binary Logic (T/F)</option>
                              </select>
                              <FaChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none text-xs" />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Impact Magnitude (Pts)</label>
                            <input
                              type="number"
                              value={question.points}
                              onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 0)}
                              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-8 py-4 text-white text-center focus:outline-none focus:border-blue-500/50 font-black"
                            />
                          </div>
                        </div>

                        {/* Options Domain */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between ml-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Contextual Vectors</label>
                            {question.questionType !== 'true-false' && (
                              <button 
                                onClick={() => addOption(qIndex)} 
                                className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 hover:text-white transition-all duration-300"
                              >
                                + Inject Vector
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex gap-4 items-center group/opt">
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateOption(qIndex, oIndex, 'isCorrect', true)}
                                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
                                    option.isCorrect 
                                    ? "bg-green-500/20 border-green-500/40 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
                                    : "bg-white/[0.02] border-white/5 text-white/10 hover:border-white/20"
                                  }`}
                                >
                                  <FaCheck size={12} className={option.isCorrect ? "opacity-100 scale-110" : "opacity-0 scale-90"} />
                                </motion.button>
                                <div className="flex-1 relative">
                                  <input
                                    type="text"
                                    value={option.text}
                                    onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-8 py-4 text-sm font-medium focus:outline-none focus:border-white/20 transition-all disabled:opacity-40"
                                    placeholder={`Response Context ${oIndex + 1}`}
                                    disabled={question.questionType === 'true-false'}
                                  />
                                </div>
                                {question.questionType !== 'true-false' && question.options.length > 2 && (
                                  <button 
                                    onClick={() => removeOption(qIndex, oIndex)} 
                                    className="p-3 text-white/10 hover:text-red-500 opacity-0 group-hover/opt:opacity-100 transition-all"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="lg:col-span-4 space-y-8 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 rounded-[3rem] bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/10 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 pointer-events-none">
                <FaBrain className="text-white/[0.02] text-8xl" />
              </div>

              <div className="relative z-10 space-y-10">
                <div className="space-y-2">
                  <h2 className="text-xl font-black uppercase tracking-tighter italic">Persistence Hub</h2>
                  <div className="h-[1px] w-12 bg-blue-500/50" />
                </div>

                <div className="space-y-6">
                  <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Analysis Payload</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                        <span>Checkpoints</span>
                        <span className="text-white/60">{questions.length} Nodes</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                        <span>Total Magnitude</span>
                        <span className="text-white/60">{questions.reduce((acc, q) => acc + q.points, 0)} Pts</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                        <span>Min Threshold</span>
                        <span className="text-white/60">{Math.round((passingScore/100) * questions.reduce((acc, q) => acc + q.points, 0))} Pts</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateQuiz}
                      disabled={loading}
                      className="w-full relative group overflow-hidden rounded-[1.5rem] bg-white p-[1px] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
                      <div className="relative h-full w-full bg-black rounded-[1.4rem] py-6 flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-transparent">
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <ClipLoader size={16} color="white" />
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white">Committing...</span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-black tracking-[0.5em] uppercase text-white group-hover:scale-110 transition-transform duration-300">
                            Deploy Module
                          </span>
                        )}
                      </div>
                    </motion.button>
                    
                    <button 
                      onClick={() => navigate("/courses")}
                      className="w-full py-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                      Abort Sequence
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* AI Synthesis Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div className='fixed inset-0 z-[100] flex items-center justify-center p-6'>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiModal(false)}
              className='absolute inset-0 bg-black/90 backdrop-blur-3xl'
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className='relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-10 md:p-14 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]'
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <FaRobot size={200} className="rotate-12" />
              </div>
              
              <div className="relative z-10 space-y-12">
                <div className='flex items-center gap-8'>
                  <div className="p-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-[2rem] shadow-[0_0_40px_rgba(147,51,234,0.4)]">
                    <FaRobot size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">Neural Synthesis</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400/60 mt-2">Evaluation Logic Generation</p>
                  </div>
                </div>
                
                <div className='space-y-4'>
                  <label className='text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2'>Source Material Payload</label>
                  <textarea
                    value={lectureContent}
                    onChange={(e) => setLectureContent(e.target.value)}
                    className='w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 text-white focus:outline-none focus:border-purple-500/50 transition-all h-64 resize-none font-medium placeholder:text-white/5 scrollbar-hide'
                    placeholder='Input raw instructional data for vectorization...'
                  />
                </div>

                <div className='grid grid-cols-2 gap-8'>
                  <div className='space-y-3'>
                    <label className='text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2'>Node Quantity</label>
                    <input
                      type='number'
                      value={aiNumQuestions}
                      onChange={(e) => setAiNumQuestions(parseInt(e.target.value) || 0)}
                      min={1} max={20}
                      className='w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-white text-center font-black focus:border-purple-500/50 focus:outline-none'
                    />
                  </div>
                  <div className='space-y-3'>
                    <label className='text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2'>Complexity Tier</label>
                    <div className="relative">
                      <select
                        value={aiDifficulty}
                        onChange={(e) => setAiDifficulty(e.target.value)}
                        className='w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer'
                      >
                        <option value='easy' className="bg-[#0A0A0A]">Standard Protocol</option>
                        <option value='medium' className="bg-[#0A0A0A]">Adaptive Moderate</option>
                        <option value='hard' className="bg-[#0A0A0A]">Advanced heuristic</option>
                      </select>
                      <FaChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none text-xs" />
                    </div>
                  </div>
                </div>

                <div className='flex gap-4 pt-4'>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAiGenerate}
                    disabled={aiLoading}
                    className="flex-[2] relative group overflow-hidden rounded-[1.5rem] bg-white p-[1px] transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />
                    <div className="relative h-full w-full bg-black rounded-[1.4rem] py-6 flex items-center justify-center gap-4 transition-all duration-300 group-hover:bg-transparent">
                      {aiLoading ? (
                        <div className="flex items-center gap-3">
                          <ClipLoader size={16} color="white" />
                          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white">Synthesizing...</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-[11px] font-black tracking-[0.5em] uppercase text-white">Invoke Synthesis</span>
                          <FaWandMagicSparkles size={14} className="text-purple-400" />
                        </>
                      )}
                    </div>
                  </motion.button>

                  <button
                    onClick={() => setShowAiModal(false)}
                    className='flex-1 rounded-[1.5rem] bg-white/[0.02] border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all'
                  >
                    Abort
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default CreateQuiz;


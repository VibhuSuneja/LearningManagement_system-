import React from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AboutPage from "./pages/AboutPage";
import ForgetPassword from "./pages/ForgetPassword";
import EditProfile from "./pages/EditProfile";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import useGetCurrentUser from "./customHooks/getCurrentUser";
import useGetCreatorCourse from "./customHooks/getCreatorCourse";
import { Suspense, lazy } from "react";
// Heavy Routes Lazy Loaded
const Dashboard = lazy(() => import('./pages/Educator/Dashboard'));
const Courses = lazy(() => import('./pages/Educator/Courses'));
const CreateCourses = lazy(() => import('./pages/Educator/CreateCourses'));
const EditCourse = lazy(() => import("./pages/Educator/EditCourse"));
const AllCourses = lazy(() => import("./pages/AllCourses"));
const CreateLecture = lazy(() => import("./pages/Educator/CreateLecture"));
const EditLecture = lazy(() => import("./pages/Educator/EditLectures"));
const ViewCourse = lazy(() => import("./pages/ViewCourse"));
const ViewLectures = lazy(() => import("./pages/Educator/ViewLectures.jsx"));
const MyEnrolledCourses = lazy(() => import("./pages/MyEnrolledCourses.jsx"));
const SearchWithAi = lazy(() => import("./pages/SearchWithAi.jsx"));
const DanaDashboard = lazy(() => import('./pages/Educator/DanaProtocol.jsx'));
const Chat = lazy(() => import("./pages/Chat.jsx"));
const LiveSessions = lazy(() => import("./pages/LiveSessions.jsx"));
const Leaderboard = lazy(() => import("./pages/Leaderboard.jsx"));
const Forum = lazy(() => import("./pages/Forum.jsx"));
const ThreadView = lazy(() => import("./pages/ThreadView.jsx"));
const CreateQuiz = lazy(() => import("./pages/Educator/CreateQuiz"));
const TakeQuiz = lazy(() => import("./pages/TakeQuiz"));
const ManageQuizzes = lazy(() => import("./pages/Educator/ManageQuizzes"));
const CreateAssignment = lazy(() => import('./pages/Educator/CreateAssignment'));
const SubmitAssignment = lazy(() => import('./pages/SubmitAssignment'));
const GradeAssignment = lazy(() => import('./pages/Educator/GradeAssignment'));
const ManageAssignments = lazy(() => import('./pages/Educator/ManageAssignments'));
const BillingHistory = lazy(() => import("./pages/BillingHistory"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const PrivacyCenter = lazy(() => import("./pages/PrivacyCenter"));

import ScrollToTop from './component/ScrollToTop.jsx'
import getPublishedCourse from "./customHooks/getPublishedCourse.js";
import getAllReviews from "./customHooks/getAllReviews.js";
import Chatbot from "./component/Chatbot.jsx";
import { useSocketContext } from "./context/SocketContext";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import OnboardingTour from "./component/OnboardingTour";
import LevelUpCelebration from "./component/LevelUpCelebration";
import { AnimatePresence } from "framer-motion";

// Global Suspense Loader UI
const PageLoader = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center">
    <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
    <p className="mt-8 text-[10px] uppercase font-black tracking-[0.4em] text-white/50">Initializing Core...</p>
  </div>
);

export const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";
console.log("Using Server URL:", serverUrl);

// Axios Interceptor for Mobile Auth (Fallback for Cookie Blocking)
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  useGetCurrentUser();
  useGetCreatorCourse();
  getPublishedCourse();
  getAllReviews();

  const { socket } = useSocketContext();
  const { userData } = useSelector((state) => state.user);
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [showLevelUp, setShowLevelUp] = React.useState(false);
  const [newLevel, setNewLevel] = React.useState(1);

  React.useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
        console.log("[Socket] Connected to server:", socket.id);
    });

    // Note: 'userUpdated' is handled by getCurrentUser.js hook for auto-refetch

    socket.on("levelUp", ({ level, message }) => {
        setNewLevel(level);
        setShowLevelUp(true);
        
        // Still keep the toast for a brief summary if needed, or remove it.
        // Let's keep it but slightly modified.
        toast.success(message, {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
            icon: "⭐"
        });
    });

    socket.on("badgeUnlocked", ({ badgeName, message }) => {
        toast.info(message, {
            position: "top-right",
            autoClose: 5000,
            theme: "dark",
            icon: "🏆"
        });
    });

    socket.on("pointsAwarded", ({ message }) => {
        toast.success(message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            theme: "colored",
            icon: "⚡"
        });
    });

    socket.on("newNotification", (notification) => {
        // Only toast if it's NOT a message (messages are handled by chat)
        if (notification.type !== 'message') {
            toast.info(notification.content, {
                position: "top-right",
                autoClose: 4000,
            });
        }
    });

    socket.on("streakUpdated", (data) => {
        toast.info(data.message, {
            position: "bottom-center",
            autoClose: 5000,
            icon: "🔥",
            theme: "dark"
        });
    });

    return () => {
        socket.off("levelUp");
        socket.off("badgeUnlocked");
        socket.off("pointsAwarded");
        socket.off("streakUpdated");
        socket.off("newNotification");
    };
  }, [socket]);

  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      console.log('PWA Install Triggered');
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <ScrollToTop />
      <Chatbot />
      <OnboardingTour />
      
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpCelebration 
            level={newLevel} 
            onClose={() => setShowLevelUp(false)} 
          />
        )}
      </AnimatePresence>

      {deferredPrompt && (
        <button 
          onClick={handleInstallClick}
          className="fixed bottom-24 right-5 z-50 bg-black text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold animate-bounce border border-gray-700 hover:scale-105 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Install App
        </button>
      )}
      
      <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={userData ? <Profile /> : <Navigate to="/signup" />} />
        <Route path="/profile/:userId" element={userData ? <Profile /> : <Navigate to="/signup" />} />
        <Route path="/forget" element={!userData ? <ForgetPassword /> : <Navigate to="/signup" />} />
        <Route path="/editprofile" element={userData ? <EditProfile /> : <Navigate to="/signup" />} />
        <Route path="/dashboard" element={userData?.role === "educator" ? <Dashboard /> : <Navigate to="/signup" />} />
        <Route path="/allcourses" element={userData ? <AllCourses/> : <Navigate to="/signup" />} />
        <Route path="/courses" element={userData?.role === "educator" ? <Courses /> : <Navigate to="/signup" />} />
        <Route path="/createcourse" element={userData?.role === "educator" ? <CreateCourses /> : <Navigate to="/signup" />} />    
        <Route path="/editcourse/:courseId" element={userData?.role === "educator" ? <EditCourse /> : <Navigate to="/signup" />} />  
        <Route path="/createlecture/:courseId" element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to="/signup" />} />   
        <Route path="/editlecture/:courseId/:lectureId" element={userData?.role === "educator" ? <EditLecture /> : <Navigate to="/signup" />} />     
         <Route path="/viewcourse/:courseId" element={userData ? <ViewCourse /> : <Navigate to="/signup" />} />   
         <Route path="/viewlecture/:courseId" element={userData ? <ViewLectures /> : <Navigate to="/signup" />} /> 
          <Route path="/mycourses" element={userData ? <MyEnrolledCourses /> : <Navigate to="/signup" />} /> 
          <Route path="/search" element={userData ? <SearchWithAi /> : <Navigate to="/signup" />} /> 
          <Route path="/chat" element={userData ? <Chat /> : <Navigate to="/signup" />} /> 
          <Route path="/dana-protocol" element={userData?.role === "educator" ? <DanaDashboard /> : <Navigate to="/signup" />} />
          <Route path="/leaderboard" element={userData ? <Leaderboard /> : <Navigate to="/signup" />} /> 
          <Route path="/live/:courseId" element={userData ? <LiveSessions /> : <Navigate to="/signup" />} /> 
          <Route path="/forum" element={userData ? <Forum /> : <Navigate to="/signup" />} /> 
          <Route path="/forum/:id" element={userData ? <ThreadView /> : <Navigate to="/signup" />} />
          <Route path="/create-quiz/:courseId" element={userData?.role === "educator" ? <CreateQuiz /> : <Navigate to="/signup" />} />
          <Route path="/manage-quizzes/:courseId" element={userData?.role === "educator" ? <ManageQuizzes /> : <Navigate to="/signup" />} />
          <Route path="/take-quiz/:quizId" element={userData ? <TakeQuiz /> : <Navigate to="/signup" />} />
          <Route path="/create-assignment/:courseId" element={userData?.role === "educator" ? <CreateAssignment /> : <Navigate to="/signup" />} />
          <Route path="/submit-assignment/:assignmentId" element={userData ? <SubmitAssignment /> : <Navigate to="/signup" />} />
          <Route path="/grade-assignment/:assignmentId" element={userData?.role === "educator" ? <GradeAssignment /> : <Navigate to="/signup" />} />
          <Route path="/manage-assignments/:courseId" element={userData?.role === "educator" ? <ManageAssignments /> : <Navigate to="/signup" />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<Privacy />} /> 
          <Route path="/privacy-center" element={userData ? <PrivacyCenter /> : <Navigate to="/signup" />} />
          <Route path="/billing" element={userData ? <BillingHistory /> : <Navigate to="/signup" />} />
          <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
      </Routes>
      </Suspense>
    </>
  );
}

export default App;

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ForgetPassword from "./pages/ForgetPassword";
import EditProfile from "./pages/EditProfile";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import useGetCurrentUser from "./customHooks/getCurrentUser";
import useGetCreatorCourse from "./customHooks/getCreatorCourse";
import Dashboard from './pages/Educator/Dashboard';
import Courses from './pages/Educator/Courses';
import CreateCourses from './pages/Educator/CreateCourses';
// FIX: Added the import for the EditCourse component
import EditCourse from "./pages/Educator/EditCourse";
import getPublishedCourse from "./customHooks/getPublishedCourse";
import AllCourses from "./pages/AllCourses";
import CreateLecture from "./pages/Educator/CreateLecture";
import EditLecture from "./pages/Educator/EditLectures";
import ViewCourse from "./pages/ViewCourse";
import ScrollToTop from './component/ScrollToTop.jsx'
import ViewLectures from "./pages/Educator/ViewLectures.jsx";
import MyEnrolledCourses from "./pages/MyEnrolledCourses.jsx";
import getAllReviews from "./customHooks/getAllReviews.js";
import SearchWithAi from "./pages/SearchWithAi.jsx";
export const serverUrl = "http://localhost:8080";

function App() {
  useGetCurrentUser();
  useGetCreatorCourse();
  getPublishedCourse();
  getAllReviews();

  
  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={userData ? <Profile /> : <Navigate to="/signup" />} />
        <Route path="/forget" element={!userData ? <ForgetPassword /> : <Navigate to="/signup" />} />
        <Route path="/editprofile" element={userData ? <EditProfile /> : <Navigate to="/signup" />} />
        <Route path="/dashboard" element={userData?.role === "educator" ? <Dashboard /> : <Navigate to="/signup" />} />
        <Route path="/allcourses" element={userData?.role === "educator" ? <AllCourses/> : <Navigate to="/signup" />} />
        <Route path="/courses" element={userData?.role === "educator" ? <Courses /> : <Navigate to="/signup" />} />
        <Route path="/createcourse" element={userData?.role === "educator" ? <CreateCourses /> : <Navigate to="/signup" />} />    
        <Route path="/editcourse/:courseId" element={userData?.role === "educator" ? <EditCourse /> : <Navigate to="/signup" />} />  
        <Route path="/createlecture/:courseId" element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to="/signup" />} />   
        <Route path="/editlecture/:courseId/:lectureId" element={userData?.role === "educator" ? <EditLecture /> : <Navigate to="/signup" />} />     
         <Route path="/viewcourse/:courseId" element={userData ? <ViewCourse /> : <Navigate to="/signup" />} />   
         <Route path="/viewlecture/:courseId" element={userData ? <ViewLectures /> : <Navigate to="/signup" />} /> 
          <Route path="/mycourses" element={userData ? <MyEnrolledCourses /> : <Navigate to="/signup" />} /> 
          <Route path="/search" element={userData ? <SearchWithAi /> : <Navigate to="/signup" />} /> 
      </Routes>
    </>
  );
}

export default App;
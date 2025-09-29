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
import Dashboard from './pages/Educator/Dashboard'
import Courses from './pages/Educator/Courses'
import CreateCourses from './pages/Educator/CreateCourses'

// ✅ Correct: Use the environment variable for the server URL
// This is the URL for your local backend server
export const serverUrl = "http://localhost:8080";

function App() {
  useGetCurrentUser();
  useGetCreatorCourse();
  
  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={userData ? <Profile /> : <Navigate to="/signup" />} />
        <Route path="/forget" element={!userData ? <ForgetPassword /> : <Navigate to="/signup" />} />
        <Route path="/editprofile" element={userData ? <EditProfile /> : <Navigate to="/signup" />} />
        <Route path="/dashboard" element={userData ?.role === "educator" ? <Dashboard /> : <Navigate to="/signup" />} />
        <Route path="/courses" element={userData ?.role === "educator" ? <Courses /> : <Navigate to="/signup" />} />
        <Route path="/createcourse" element={userData ?.role === "educator" ? <CreateCourses /> : <Navigate to="/signup" />} />    

      </Routes>
    </>
  );
}

export default App;
import React, { useState } from "react";
import { Routes ,Route, Navigate } from 'react-router-dom' //we are getting this from our package that we have installed. now we can use routes, navigate to different page
import Home from './pages/Home' // importing for our home page
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import {ToastContainer} from "react-toastify"
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import ForgetPassword from "./pages/ForgetPassword";
export const serverUrl = "http://localhost:8080"
function App() {
  getCurrentUser()
  const {userData}= useSelector(state=>state.user)
  return (
    <>
    <ToastContainer />
    <Routes>

{/* we are providing path as / and we are providing an element as home page */}
<Route path='/' element={<Home/>}/> 
<Route path='/signup' element={!userData ? <SignUp/> : <Navigate to ={"/"}/>}/>
<Route path='/login' element={<Login/>}/> 
<Route path='/profile' element={userData?<Profile/>:<Navigate to ={"/signup"}/>}/> 
<Route path='/forget' element={userData?<ForgetPassword/>:<Navigate to ={"/signup"}/>}/>
         
    </Routes>
    
    </>
  )
}

export default App
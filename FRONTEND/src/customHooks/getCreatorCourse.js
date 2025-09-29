import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { setCreatorCourseData } from '../redux/courseSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const getCreatorCourse = () => {
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)
  return (
    useEffect(()=>{
    const creatorCourses = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses" , {withCredentials:true})
        
         await dispatch(setCreatorCourseData(result.data))

        
        console.log(result.data)
        
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
      }
      
    }
    creatorCourses()
  },[userData])
  )
}

export default getCreatorCourse
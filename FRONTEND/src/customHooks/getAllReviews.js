import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import {  setReviewData } from '../redux/reviewSlice'
import axios from 'axios'

const getAllReviews = () => {

   const dispatch = useDispatch()
  

  useEffect(()=>{
    const allReviews = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/review/getreview" , {withCredentials:true})
        console.log(result.data)
        dispatch(setReviewData(result.data))
        
      } catch (error) {
        console.log(error)
      }
    }
    allReviews()
  },[])
  
}

export default getAllReviews

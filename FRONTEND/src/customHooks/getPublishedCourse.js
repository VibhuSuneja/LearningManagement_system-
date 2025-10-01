import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setCourseData } from '../redux/courseSlice'

const usePublishedCourses = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const getCourseData = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/course/getpublishedcourses`,
          { withCredentials: true }
        )
        // Dispatch only the 'courses' array from the response
        dispatch(setCourseData(result.data.courses)) 
      } catch (error) {
        console.error(error)
      }
    }

    getCourseData()
  }, [dispatch])
}

export default usePublishedCourses
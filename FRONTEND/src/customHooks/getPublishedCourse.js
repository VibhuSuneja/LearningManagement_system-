import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setCourseData } from '../redux/courseSlice'
import { useSocketContext } from '../context/SocketContext'

const usePublishedCourses = () => {
  const dispatch = useDispatch()
  const { socket } = useSocketContext()

  const getCourseData = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/course/getpublishedcourses`,
        { withCredentials: true }
      )
      // Dispatch only the 'courses' array from the response
      dispatch(setCourseData(result.data.courses))
    } catch (error) {
      console.error('[Courses] ❌ Error fetching courses:', error)
    }
  }

  useEffect(() => {
    getCourseData()
  }, [])

  // Listen for profile updates via socket to refresh course data
  useEffect(() => {
    if (socket) {
      socket.on('profileUpdated', ({ userId, role }) => {
        // Refetch courses when any educator updates their profile
        if (role === 'educator') {
          getCourseData()
        }
      });

      return () => {
        socket.off('profileUpdated');
      };
    }
  }, [socket])
}

export default usePublishedCourses

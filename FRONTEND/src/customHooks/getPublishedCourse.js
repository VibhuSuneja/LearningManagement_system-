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
      console.log('[Courses] Fetching published courses...')
      const result = await axios.get(
        `${serverUrl}/api/course/getpublishedcourses`,
        { withCredentials: true }
      )
      // Dispatch only the 'courses' array from the response
      dispatch(setCourseData(result.data.courses))
      console.log('[Courses] ✅ Published courses updated')
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
      console.log('[Courses] Setting up profile update listener')
      
      socket.on('profileUpdated', ({ userId, role }) => {
        console.log(`[Courses] Profile updated for ${role} user: ${userId}, refetching courses`)
        // Refetch courses when any educator updates their profile
        if (role === 'educator') {
          getCourseData()
        }
      })

      return () => {
        socket.off('profileUpdated')
        console.log('[Courses] Removed profile update listener')
      }
    }
  }, [socket])
}

export default usePublishedCourses

import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { setCreatorCourseData } from '../redux/courseSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const getCreatorCourse = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        // Only fetch if user is logged in and is an educator
        if (!userData || userData.role !== 'educator') {
            return;
        }

        const creatorCourses = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true });
                await dispatch(setCreatorCourseData(result.data));
                console.log(result.data);
            } catch (error) {
                console.log(error);
                // Only show error if it's not a generic 401 (which we already handle by checking userData)
                if (error.response?.status !== 401) {
                    toast.error(error.response?.data?.message || "Failed to fetch creator courses");
                }
            }
        };

        creatorCourses();
    }, [userData, dispatch]);
};

export default getCreatorCourse
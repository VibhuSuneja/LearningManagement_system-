// FRONTEND/src/customHooks/getCurrentUser.js

import React, { useEffect } from 'react';
import { serverUrl } from '../App';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // FIX: Changed the endpoint to match the backend route
        const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;
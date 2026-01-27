// FRONTEND/src/customHooks/getCurrentUser.js

import React, { useEffect, useCallback } from 'react';
import { serverUrl } from '../App';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { useSocketContext } from '../context/SocketContext';

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  const { socket } = useSocketContext();

  const fetchUser = useCallback(async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on("userUpdated", () => {
      console.log("User updated event received, refetching...");
      fetchUser();
    });

    return () => {
      socket.off("userUpdated");
    };
  }, [socket, fetchUser]);
};

export default useGetCurrentUser;
import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { toast } from 'react-toastify';

/**
 * Hook to monitor user focus and report to educator (Proctoring)
 * @param {string} courseId 
 * @param {object} userData 
 * @param {boolean} active - whether proctoring is enabled
 */
const useIntegrityMonitor = (courseId, userData, active = true) => {
    const { socket } = useSocketContext();

    useEffect(() => {
        if (!active || !socket || !courseId || userData?.role !== 'student') return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                // User switched tab or minimized window
                socket.emit("integrityAlert", {
                    courseId,
                    userName: userData.name,
                    eventType: "Tab Switch / Inactive"
                });
                toast.warning("Focus tracking: Please stay on this tab to ensure full attendance credit.", {
                    position: "top-center",
                    autoClose: 3000
                });
            }
        };

        const handleBlur = () => {
            socket.emit("integrityAlert", {
                courseId,
                userName: userData.name,
                eventType: "Window Blur (Focused shifted elsewhere)"
            });
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, [active, socket, courseId, userData]);
};

export default useIntegrityMonitor;

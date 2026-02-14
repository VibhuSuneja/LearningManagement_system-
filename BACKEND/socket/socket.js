import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:4173", "http://localhost:4174", "https://learning-management-system-kappa-black.vercel.app", process.env.FRONTEND_URL],
		methods: ["GET", "POST"],
	},
});

export const getIO = () => {
    if (!io) {

    }
    return io;
};

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId?.toString()];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId;
	if (userId !== "undefined") {
		userSocketMap[userId] = socket.id;
		socket.join(userId); // Join a room specifically for this user

	}

	// Send current online users to all clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Room Management for targeted updates
    socket.on("joinCourse", (courseId) => {
        socket.join(`course_${courseId}`);

    });

    socket.on("leaveCourse", (courseId) => {
        socket.leave(`course_${courseId}`);

    });

    socket.on("integrityAlert", ({ courseId, userName, eventType }) => {
        // Send to everyone in the course room (Educator is the target)
        io.to(`course_${courseId}`).emit("proctorAlert", { 
            studentName: userName, 
            studentId: userId,
            eventType, 
            time: new Date().toLocaleTimeString() 
        });

    });

	socket.on("disconnect", () => {
		if (userId !== "undefined") {

			delete userSocketMap[userId];
		}
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };

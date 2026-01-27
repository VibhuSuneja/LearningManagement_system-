import express from "express";
import { 
	createLiveSession, 
	getLiveSessionsByCourse, 
	updateSessionStatus, 
	deleteLiveSession, 
	updateSessionDetails,
	participateInSession
} from "../controller/liveSessionController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, createLiveSession);
router.get("/course/:courseId", isAuthenticated, getLiveSessionsByCourse);
router.put("/status/:id", isAuthenticated, updateSessionStatus);
router.delete("/delete/:id", isAuthenticated, deleteLiveSession);
router.put("/details/:id", isAuthenticated, updateSessionDetails);
router.post("/participate/:id", isAuthenticated, participateInSession);

export default router;

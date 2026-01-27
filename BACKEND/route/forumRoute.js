import express from "express";
import { 
    createThread, 
    getAllThreads, 
    getThreadById, 
    toggleLikeThread, 
    addComment, 
    deleteThread,
    toggleFollowUser,
    togglePinThread,
    toggleLockThread
} from "../controller/forumController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/threads", isAuth, createThread);
router.get("/threads", isAuth, getAllThreads);
router.get("/threads/:id", isAuth, getThreadById);
router.post("/threads/:id/like", isAuth, toggleLikeThread);
router.post("/threads/:id/pin", isAuth, togglePinThread);
router.post("/threads/:id/lock", isAuth, toggleLockThread);
router.delete("/threads/:id", isAuth, deleteThread);

router.post("/threads/:threadId/comments", isAuth, addComment);

router.post("/user/:userId/follow", isAuth, toggleFollowUser);

export default router;

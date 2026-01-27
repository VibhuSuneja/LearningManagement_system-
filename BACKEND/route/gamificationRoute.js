import express from "express";
import { getLeaderboard } from "../controller/gamificationController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/leaderboard", isAuthenticated, getLeaderboard);

export default router;

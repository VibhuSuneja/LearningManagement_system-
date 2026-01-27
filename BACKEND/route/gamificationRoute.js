import express from "express";
import { getLeaderboard } from "../controller/gamificationController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/leaderboard", isAuth, getLeaderboard);

export default router;

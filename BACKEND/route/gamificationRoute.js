import express from "express";
import { getLeaderboard, testRoute } from "../controller/gamificationController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/test", testRoute);
router.get("/leaderboard", isAuth, getLeaderboard);

export default router;

import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getEducatorAnalytics } from "../controller/analyticsController.js";

const router = express.Router();

router.get("/educator", isAuth, getEducatorAnalytics);

export default router;

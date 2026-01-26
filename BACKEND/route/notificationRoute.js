import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controller/notificationController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/", isAuth, getNotifications);
router.put("/mark-all-read", isAuth, markAllAsRead);
router.put("/:id/read", isAuth, markAsRead);

export default router;

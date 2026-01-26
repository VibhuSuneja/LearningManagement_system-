import express from "express";
import { getMessages, sendMessage } from "../controller/messageController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/:id", isAuth, getMessages);
router.post(
	"/send/:id",
	isAuth,
	upload.fields([
		{ name: "image", maxCount: 1 },
		{ name: "audio", maxCount: 1 },
	]),
	sendMessage
);

export default router;

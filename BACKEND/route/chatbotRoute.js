import express from "express";
import { chatbotResponse } from "../controller/chatbotController.js";
import isAuth from "../middleware/isAuth.js";

const chatbotRouter = express.Router();

chatbotRouter.post("/chat", chatbotResponse);

export default chatbotRouter;

import express from "express";
import { searchWithAI } from "../controller/searchController.js";


const searchRouter = express.Router();

searchRouter.post("/search", searchWithAI);

export default searchRouter;

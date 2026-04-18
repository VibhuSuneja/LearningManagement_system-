import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getFinancialHighlights } from "../controller/danaController.js";

const router = express.Router();

router.get("/highlights", isAuth, getFinancialHighlights);

export default router;

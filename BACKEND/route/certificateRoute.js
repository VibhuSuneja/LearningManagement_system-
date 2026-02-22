import express from "express";
import { verifyCertificate } from "../controller/certificateController.js";

const certificateRouter = express.Router();

// PUBLIC route — no auth required (QR code scanners must be able to verify)
certificateRouter.get("/verify/:certificateId", verifyCertificate);

export default certificateRouter;

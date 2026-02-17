import express from "express";
import { exportUserData, deleteAccountHardened } from "../controller/privacyController.js";
import isAuth from "../middleware/isAuth.js";

const privacyRouter = express.Router();

// GDPR / DPDP Compliance Routes
privacyRouter.route("/export").get(isAuth, exportUserData);
privacyRouter.route("/delete-account").delete(isAuth, deleteAccountHardened);

export default privacyRouter;

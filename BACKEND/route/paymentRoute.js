import express from "express"
import { RazorpayOrder, verifyPayment, RazorpayWebhook } from "../controller/orderController.js";
import isAuth from "../middleware/isAuth.js";

const paymentRouter = express.Router()

paymentRouter.post("/razorpay-order", isAuth, RazorpayOrder);
paymentRouter.post("/verify-payment", isAuth, verifyPayment);
paymentRouter.post("/webhook", express.json(), RazorpayWebhook); 

export default paymentRouter;
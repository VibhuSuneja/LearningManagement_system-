import crypto from "crypto";
import Course from "../model/courseModel.js";
import razorpay from 'razorpay'
import User from "../model/UserModel.js";
import Invoice from "../model/InvoiceModel.js";
import dotenv from "dotenv"
dotenv.config()

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// --- BUSINESS LOGIC: DANA PROTOCOL ---
// This controller handles the core financial transactions, 
// ensuring legal compliance (GST) and cryptographic integrity.

export const RazorpayOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    const options = {
      amount: Math.round(course.price * 100), // in paisa, rounded to avoid float issues
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${courseId.toString().substring(0, 8)}`,
      notes: {
        courseId: courseId.toString(),
        userId: req.user._id.toString()
      }
    };

    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ message: `Failed to create secure transaction: ${error.message}` });
  }
};

import { createNotification } from "./notificationController.js";
import { awardPoints, checkBadges } from "./gamificationController.js";
import { io } from "../socket/socket.js";

export const verifyPayment = async (req, res) => {
  try {
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        courseId 
    } = req.body;
    
    const userId = req.user._id;

    // 1. SECURE SIGNATURE VERIFICATION (Phase 5 Hardening)
    // Prevents "Success Spoofing" where a user manually calls the endpoint
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
        return res.status(401).json({ 
            message: "Transaction Security Alert: Invalid Signature Detect",
            breach_recorded: true 
        });
    }

    // 2. Double Check with Razorpay API (Redundancy)
    const paymentInfo = await razorpayInstance.payments.fetch(razorpay_payment_id);
    if (paymentInfo.status !== 'captured' && paymentInfo.status !== 'authorized') {
        return res.status(400).json({ message: "Payment not captured by banking gateway" });
    }

    // 3. ENROLLMENT & BUSINESS PROCESS
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
      
      // GAMIFICATION
      await awardPoints(userId, 100, "Premium Course Access");
      await checkBadges(userId, "first_enrollment");
    }

    const course = await Course.findById(courseId).populate("lectures");
    if (!course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    // NOTIFICATIONS
    await createNotification(
      userId,
      course.creator, 
      "enrollment",
      `DANA PROTOCOL: Your access to "${course.title}" is now verified.`,
      courseId
    );

    await createNotification(
      course.creator,
      userId,
      "enrollment",
      `New Transmission: ${user.name} established connection with "${course.title}". Revenue recorded.`,
      courseId
    );

    // 4. INVOICE GENERATION (GST COMPLIANT)
    const gstRate = 0.18; // 18% GST standard for ed-tech service
    const price = course.price || 0;
    const gstAmount = price * (gstRate / (1 + gstRate)); // Inclusive GST calculation
    const subtotal = price - gstAmount;
    
    const invoiceNumber = `DANA-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    await Invoice.create({
      invoiceNumber,
      user: userId,
      course: courseId,
      razorpayOrderId: razorpay_order_id,
      amount: subtotal,
      gstAmount,
      totalAmount: price,
      billingDetails: {
        name: user.name,
        email: user.email,
        address: "Ecosystem Hub | Digital Provision"
      }
    });

    // 5. GLOBAL STATE SYNC
    io.emit("userUpdated", { userId });

    return res.status(200).json({ 
        message: "Payment cryptographically verified", 
        dana_id: invoiceNumber 
    });

  } catch (error) {
    console.error("Payment Verification Error:", error);
    return res.status(500).json({ message: `Cryptographic failure in DANA node: ${error.message}` });
  }
};

export const RazorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers["x-razorpay-signature"];

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (expectedSignature !== signature) {
            return res.status(403).json({ message: "Invalid webhook signature" });
        }

        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        if (event === "payment.captured") {
            const { courseId, userId } = payload.notes;
            
            // Logic to ensure enrollment if not already done by verifyPayment
            const user = await User.findById(userId);
            if (user && !user.enrolledCourses.includes(courseId)) {
                user.enrolledCourses.push(courseId);
                await user.save();

                const course = await Course.findById(courseId);
                if (course && !course.enrolledStudents.includes(userId)) {
                    course.enrolledStudents.push(userId);
                    await course.save();
                }

                // Emit update
                io.emit("userUpdated", { userId });
                console.log(`[Webhook] Enrollment synced for user ${userId} in course ${courseId}`);
            }
        }

        res.status(200).json({ status: "ok" });
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ message: "Webhook processing failed" });
    }
};



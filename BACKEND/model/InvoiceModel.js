import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    gstAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    billingDetails: {
        name: String,
        email: String,
        address: String
    },
    status: {
        type: String,
        enum: ["paid", "refunded"],
        default: "paid"
    }
}, { timestamps: true });

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
export default Invoice;

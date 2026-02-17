import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import Invoice from "../model/InvoiceModel.js";

const invoiceRouter = express.Router();

// Get all invoices for logged in user
invoiceRouter.get("/my-invoices", isAuth, async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user._id })
            .populate("course", "title price")
            .sort({ createdAt: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching invoices" });
    }
});

// Get single invoice details
invoiceRouter.get("/:id", isAuth, async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id })
            .populate("course", "title price");
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Error fetching invoice" });
    }
});

export default invoiceRouter;

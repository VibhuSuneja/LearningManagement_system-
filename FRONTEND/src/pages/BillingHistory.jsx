import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { FaFileInvoice, FaDownload, FaHistory, FaArrowLeft, FaShieldAlt, FaReceipt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DateTime } from "luxon";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "../component/Nav";

const BillingHistory = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/invoices/my-invoices`, { withCredentials: true });
                setInvoices(res.data);
            } catch (error) {
                toast.error("Failed to load billing history");
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const generateInvoicePDF = (invoice) => {
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 40, "F");
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("DANA PROTOCOL | TAX INVOICE", 105, 25, { align: "center" });
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.text("SECURE FINANCIAL DOCUMENT", 105, 33, { align: "center" });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text("LMS Digital Learning Hub", 20, 50);
        doc.text("Sector 62, Noida, UP, India", 20, 55);
        doc.text("GSTIN: 09AAACL1234A1Z5", 20, 60);

        // Invoice Info
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text(`Invoice No: ${invoice.invoiceNumber}`, 140, 50);
        doc.setFont(undefined, "normal");
        doc.text(`Date: ${DateTime.fromISO(invoice.createdAt).toLocaleString(DateTime.DATE_MED)}`, 140, 55);
        doc.text(`Order ID: ${invoice.razorpayOrderId}`, 140, 60);

        // Bill To
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text("BILL TO:", 20, 80);
        doc.setFont(undefined, "normal");
        doc.text(`${invoice.billingDetails.name}`, 20, 85);
        doc.text(`${invoice.billingDetails.email}`, 20, 90);

        // Table
        const tableData = [
            [
                invoice.course?.title || "Course Access",
                "1",
                `INR ${invoice.amount.toFixed(2)}`,
                `INR ${invoice.amount.toFixed(2)}`
            ]
        ];

        autoTable(doc, {
            startY: 100,
            head: [["Description", "Qty", "Unit Price", "Total"]],
            body: tableData,
            theme: "grid",
            headStyles: { fillColor: [20, 20, 20] },
            styles: { fontSize: 9 }
        });

        // Calculations
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.text(`Subtotal: INR ${invoice.amount.toFixed(2)}`, 130, finalY);
        doc.text(`GST (18%): INR ${invoice.gstAmount.toFixed(2)}`, 130, finalY + 7);
        
        doc.setFillColor(245, 245, 245);
        doc.rect(125, finalY + 10, 65, 12, "F");
        doc.setFont(undefined, "bold");
        doc.text(`TOTAL AMOUNT: INR ${invoice.totalAmount.toFixed(2)}`, 130, finalY + 18);

        // Footer
        doc.setFontSize(8);
        doc.setFont(undefined, "normal");
        doc.setTextColor(150, 150, 150);
        doc.text("This is a cryptographically secured computer-generated invoice.", 105, 280, { align: "center" });

        doc.save(`${invoice.invoiceNumber}.pdf`);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans pb-20">
            <Nav />
            
            <div className="max-w-5xl mx-auto px-4 pt-32 pb-12">
                {/* Hero Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
                >
                    <div>
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "60px" }}
                            className="h-1 bg-white mb-4"
                        />
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                            Dana <br />
                            <span className="text-white/20">Protocol</span>
                        </h1>
                        <p className="text-white/40 font-black text-[10px] md:text-xs uppercase tracking-[0.5em] mt-6 flex items-center gap-3">
                            <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                            Financial Ledger & Post-Tax Analytics
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[24px] flex flex-col items-end">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Total Integrity</span>
                            <div className="flex items-center gap-2 text-green-400">
                                <FaShieldAlt />
                                <span className="text-xs font-black uppercase tracking-widest">Encypted Payments</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Accessing Ledger...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {invoices.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white/[0.02] backdrop-blur-3xl p-16 rounded-[40px] text-center border border-white/5"
                                >
                                    <div className="w-20 h-20 bg-white/5 text-white/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                                        <FaHistory />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter">No transactions recorded</h3>
                                    <p className="text-white/30 text-xs mt-3 max-w-xs mx-auto uppercase leading-relaxed font-bold tracking-widest">
                                        Your financial footprint in the ecosystem will appear here.
                                    </p>
                                </motion.div>
                            ) : (
                                invoices.map((inv, idx) => (
                                    <motion.div 
                                        key={inv._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-3xl p-6 md:p-8 rounded-[30px] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-white/[0.03] text-white/60 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white/10 transition-colors border border-white/5">
                                                <FaReceipt />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-sm md:text-base uppercase tracking-tight group-hover:text-white transition-colors">
                                                    {inv.course?.title || "Digital Asset Access"}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">
                                                    <span className="px-2 py-1 bg-white/5 rounded-md">{DateTime.fromISO(inv.createdAt).toFormat("LLL dd, yyyy")}</span>
                                                    <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                                    <span>Ref: {inv.invoiceNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-8 justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                                            <div className="text-right">
                                                <div className="text-xl md:text-2xl font-black tracking-tighter italic">₹ {inv.totalAmount.toLocaleString()}</div>
                                                <div className="text-[10px] font-black text-green-500/80 uppercase tracking-widest mt-1">Status: Authenticated</div>
                                            </div>
                                            <motion.button 
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => generateInvoicePDF(inv)}
                                                className="h-14 w-14 bg-white text-black rounded-[20px] flex items-center justify-center shadow-2xl hover:bg-gray-200 transition-all group/btn active:rounded-[30px]"
                                            >
                                                <FaDownload className="group-hover/btn:translate-y-0.5 transition-transform" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Footer Insight */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-20 text-center p-12 bg-gradient-to-b from-white/[0.02] to-transparent rounded-[50px] border-t border-white/5"
                >
                    <p className="text-[10px] md:text-xs font-black text-white/20 uppercase tracking-[0.6em] max-w-xl mx-auto leading-loose">
                        All transactions are processed via Dana Protocol secure tunneling. GST transparency enabled by default for institutional clarity.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default BillingHistory;

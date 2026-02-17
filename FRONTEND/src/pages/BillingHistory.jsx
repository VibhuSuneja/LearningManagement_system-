import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { FaFileInvoice, FaDownload, FaHistory, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DateTime } from "luxon";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
        doc.setFontSize(22);
        doc.text("TAX INVOICE", 105, 20, { align: "center" });
        
        doc.setFontSize(10);
        doc.text("LMS Digital Learning Hub", 20, 40);
        doc.text("Sector 62, Noida, UP, India", 20, 45);
        doc.text("GSTIN: 09AAACL1234A1Z5", 20, 50);

        // Invoice Info
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Invoice No: ${invoice.invoiceNumber}`, 140, 40);
        doc.setFont(undefined, 'normal');
        doc.text(`Date: ${DateTime.fromISO(invoice.createdAt).toLocaleString(DateTime.DATE_MED)}`, 140, 45);
        doc.text(`Order ID: ${invoice.razorpayOrderId}`, 140, 50);

        // Bill To
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text("BILL TO:", 20, 70);
        doc.setFont(undefined, 'normal');
        doc.text(`${invoice.billingDetails.name}`, 20, 75);
        doc.text(`${invoice.billingDetails.email}`, 20, 80);

        // Table
        const tableData = [
            [
                invoice.course.title,
                "1",
                `INR ${invoice.amount.toFixed(2)}`,
                `INR ${invoice.amount.toFixed(2)}`
            ]
        ];

        autoTable(doc, {
            startY: 95,
            head: [['Description', 'Qty', 'Unit Price', 'Total']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0] }
        });

        // Calculations
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Subtotal: INR ${invoice.amount.toFixed(2)}`, 140, finalY);
        doc.text(`GST (18%): INR ${invoice.gstAmount.toFixed(2)}`, 140, finalY + 7);
        doc.setFont(undefined, 'bold');
        doc.text(`Total Amount: INR ${invoice.totalAmount.toFixed(2)}`, 140, finalY + 14);

        // Footer
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text("This is a computer-generated invoice and does not require a signature.", 105, 280, { align: "center" });

        doc.save(`${invoice.invoiceNumber}.pdf`);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] py-16 px-4 font-sans text-black">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate("/profile")}
                            className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                        >
                            <FaArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 italic">
                                BILLING <span className="text-gray-400">HISTORY</span>
                            </h1>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">
                                GST Compliant Payments & Tax Invoices
                            </p>
                        </div>
                    </div>
                    <div className="p-3 bg-black text-white rounded-2xl flex items-center gap-2 shadow-xl">
                        <FaShieldAlt className="text-green-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Secure Payments</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="bg-white p-12 rounded-[40px] text-center border border-gray-100 shadow-xl">
                        <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                            <FaHistory />
                        </div>
                        <h3 className="text-xl font-black uppercase">No invoices found</h3>
                        <p className="text-gray-400 text-sm mt-2">Courses you purchase will appear here for tax reimbursement.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {invoices.map((inv) => (
                            <div key={inv._id} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-lg hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                                        <FaFileInvoice />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm uppercase group-hover:text-indigo-600 transition-colors tracking-tight">
                                            {inv.course?.title || "Course Access"}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <span>{DateTime.fromISO(inv.createdAt).toLocaleString(DateTime.DATE_MED)}</span>
                                            <span>•</span>
                                            <span className="text-gray-300">ID: {inv.invoiceNumber}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-8 justify-between md:justify-end">
                                    <div className="text-right">
                                        <div className="text-lg font-black tracking-tighter italic">INR {inv.totalAmount.toFixed(2)}</div>
                                        <div className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Paid via Razorpay</div>
                                    </div>
                                    <button 
                                        onClick={() => generateInvoicePDF(inv)}
                                        className="h-12 w-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all"
                                        title="Download PDF"
                                    >
                                        <FaDownload />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center p-8 border-2 border-dashed border-gray-100 rounded-[40px]">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">
                        All payments are 100% secure and GST compliant
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BillingHistory;

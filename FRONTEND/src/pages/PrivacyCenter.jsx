import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaDownload, FaTrashAlt, FaShieldAlt, FaInfoCircle, FaFileDownload } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice"; // Assuming this is your logout/reset logic

const PrivacyCenter = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleExportData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/privacy/export`, { withCredentials: true });
            
            // Create a blob and download as JSON
            const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `LMS_UserData_${userData.name.replace(/\s+/g, '_')}.json`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            
            toast.success("Data export started successfully!");
        } catch (error) {
            toast.error("Failed to export data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const res = await axios.delete(`${serverUrl}/api/privacy/delete-account`, { withCredentials: true });
            toast.success(res.data.message);
            // Logout user from frontend
            localStorage.removeItem("token");
            dispatch(setUserData(null));
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Critical error during deletion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] py-16 px-4 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                    <button 
                        onClick={() => navigate("/profile")}
                        className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-black border border-gray-100"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-black flex items-center gap-3">
                            Privacy Center <FaShieldAlt className="text-green-500" />
                        </h1>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                            GDPR & DPDP (India) Compliance Dashboard
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Data Portability Section */}
                    <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex flex-col">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                            <FaFileDownload />
                        </div>
                        <h2 className="text-xl font-black mb-2 uppercase">Right to Portability</h2>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                            Under <b>GDPR Article 20</b> and <b>India DPDP Act</b>, you have the right to receive your personal data in a structured, commonly used, and machine-readable format.
                        </p>
                        <ul className="text-xs text-gray-400 space-y-3 mb-8 flex-grow">
                            <li className="flex items-start gap-2 italic">
                                <FaInfoCircle className="mt-0.5 text-indigo-400" />
                                Included: Profile details, academic records, forum posts & learning progress.
                            </li>
                        </ul>
                        <button 
                            disabled={loading}
                            onClick={handleExportData}
                            className="w-full bg-black text-white font-black py-4 rounded-3xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                        >
                            {loading ? "Processing..." : <><FaDownload /> Export My Data (JSON)</>}
                        </button>
                    </div>

                    {/* Right to be Forgotten Section */}
                    <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex flex-col">
                        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                            <FaTrashAlt />
                        </div>
                        <h2 className="text-xl font-black mb-2 uppercase">Right to Erasure</h2>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                            Under <b>GDPR Article 17</b>, you can request the deletion of your personal data. This "Right to be Forgotten" is a permanent action that cannot be undone.
                        </p>
                        <ul className="text-xs text-gray-400 space-y-3 mb-8 flex-grow font-medium">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 font-black">•</span>
                                All PII will be wiped from our secure database.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 font-black">•</span>
                                Course enrollments and certificates will be invalidated.
                            </li>
                        </ul>
                        <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full bg-red-50 text-red-600 border-2 border-red-100 font-black py-4 rounded-3xl flex items-center justify-center gap-3 hover:bg-red-100 transition-all uppercase tracking-widest text-xs"
                        >
                            <FaTrashAlt /> Delete My Account
                        </button>
                    </div>
                </div>

                {/* Privacy Policy Teaser */}
                <div className="mt-12 bg-black text-white p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                            <FaShieldAlt className="text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-black uppercase tracking-widest text-sm">Our Commitment</h3>
                            <p className="text-gray-400 text-xs mt-1">We don't sell your data. We use it only to enhance your AI learning experience.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate("/privacy")}
                        className="bg-white text-black font-black text-[10px] uppercase px-6 py-3 rounded-xl tracking-tighter hover:bg-gray-100 transition-colors"
                    >
                        View Full Privacy Policy
                    </button>
                </div>

                {/* Global Message */}
                <p className="text-center text-gray-300 text-[10px] font-bold uppercase tracking-[0.3em] mt-12">
                    Secured by Enterprise-Grade Encryption & AI Monitoring
                </p>
            </div>

            {/* Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl scale-in-center">
                        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                            <FaTrashAlt />
                        </div>
                        <h3 className="text-2xl font-black mb-4 uppercase">ARE YOU SURE?</h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            You are about to permanently delete your account and all associated learning history. This action <b>cannot be undone</b>.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleDeleteAccount}
                                disabled={loading}
                                className="w-full bg-red-600 text-white font-black py-4 rounded-3xl hover:bg-red-700 transition-all uppercase tracking-widest text-xs shadow-lg"
                            >
                                {loading ? "Permanently Deleting..." : "YES, DELETE EVERYTHING"}
                            </button>
                            <button 
                                onClick={() => setShowDeleteConfirm(false)}
                                className="w-full bg-gray-100 text-gray-500 font-black py-4 rounded-3xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
                            >
                                NO, KEEP MY DATA
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrivacyCenter;

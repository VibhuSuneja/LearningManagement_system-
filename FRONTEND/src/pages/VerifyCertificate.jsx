import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaShieldAlt, FaGraduationCap, FaCalendarAlt, FaUser, FaBook, FaCertificate } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

function VerifyCertificate() {
    const { certificateId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verify = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${serverUrl}/api/certificate/verify/${certificateId}`
                );
                setResult(response.data);
            } catch (err) {
                if (err.response?.data) {
                    setError(err.response.data.message);
                } else {
                    setError("Unable to connect to verification server. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (certificateId) {
            verify();
        }
    }, [certificateId]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            padding: "20px",
        }}>
            {/* Background decorations */}
            <div style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                pointerEvents: "none", overflow: "hidden", zIndex: 0,
            }}>
                <div style={{
                    position: "absolute", top: "-15%", right: "-15%",
                    width: "500px", height: "500px", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)",
                    filter: "blur(80px)",
                }} />
                <div style={{
                    position: "absolute", bottom: "-10%", left: "-10%",
                    width: "400px", height: "400px", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)",
                    filter: "blur(80px)",
                }} />
            </div>

            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "560px" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: "64px", height: "64px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                        marginBottom: "16px",
                        boxShadow: "0 8px 30px rgba(99,102,241,0.35)",
                    }}>
                        <FaShieldAlt size={28} color="#fff" />
                    </div>
                    <h1 style={{
                        fontSize: "28px", fontWeight: 800, color: "#fff",
                        margin: "0 0 8px", letterSpacing: "-0.5px",
                    }}>
                        Certificate Verification
                    </h1>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                        Virtual Courses LMS &bull; Official Credential Verification
                    </p>
                </div>

                {/* Main Card */}
                <div style={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "24px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: "40px 32px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}>
                    {/* Certificate ID badge */}
                    <div style={{
                        textAlign: "center", marginBottom: "28px",
                    }}>
                        <span style={{
                            display: "inline-block",
                            padding: "6px 18px",
                            borderRadius: "30px",
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.6)",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                        }}>
                            <FaCertificate style={{ marginRight: "6px", verticalAlign: "-1px" }} />
                            {certificateId}
                        </span>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <ClipLoader color="#6366F1" size={40} />
                            <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "16px", fontSize: "14px" }}>
                                Verifying certificate...
                            </p>
                        </div>
                    )}

                    {/* Error / Not Found */}
                    {!loading && error && (
                        <div style={{ textAlign: "center", padding: "30px 0" }}>
                            <div style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "72px", height: "72px", borderRadius: "50%",
                                background: "rgba(239,68,68,0.12)", marginBottom: "20px",
                            }}>
                                <FaTimesCircle size={36} color="#EF4444" />
                            </div>
                            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#EF4444", margin: "0 0 10px" }}>
                                Verification Failed
                            </h2>
                            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: 0, maxWidth: "360px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
                                {error}
                            </p>
                            <div style={{
                                marginTop: "20px", padding: "12px 16px",
                                background: "rgba(239,68,68,0.08)",
                                border: "1px solid rgba(239,68,68,0.15)",
                                borderRadius: "12px",
                                fontSize: "12px", color: "rgba(255,255,255,0.4)",
                            }}>
                                If you believe this is an error, please contact <strong style={{ color: "rgba(255,255,255,0.7)" }}>support@virtualcourses.com</strong>
                            </div>
                        </div>
                    )}

                    {/* Success — Verified */}
                    {!loading && result?.verified && (
                        <div>
                            {/* Green verified badge */}
                            <div style={{ textAlign: "center", marginBottom: "28px" }}>
                                <div style={{
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    width: "72px", height: "72px", borderRadius: "50%",
                                    background: "rgba(16,185,129,0.12)", marginBottom: "16px",
                                }}>
                                    <FaCheckCircle size={36} color="#10B981" />
                                </div>
                                <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#10B981", margin: "0 0 6px" }}>
                                    Certificate Verified ✓
                                </h2>
                                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
                                    This is an authentic credential issued by Virtual Courses LMS
                                </p>
                            </div>

                            {/* Certificate details */}
                            <div style={{
                                background: "rgba(255,255,255,0.03)",
                                borderRadius: "16px",
                                border: "1px solid rgba(255,255,255,0.06)",
                                overflow: "hidden",
                            }}>
                                {[
                                    { icon: <FaUser size={14} />, label: "Student Name", value: result.certificate.studentName },
                                    { icon: <FaBook size={14} />, label: "Course", value: result.certificate.courseTitle },
                                    { icon: <FaGraduationCap size={14} />, label: "Level", value: result.certificate.courseLevel || "All Levels" },
                                    { icon: <FaCalendarAlt size={14} />, label: "Date of Completion", value: formatDate(result.certificate.completedAt) },
                                    { icon: <FaShieldAlt size={14} />, label: "Lectures Completed", value: `${result.certificate.lecturesCompleted} modules` },
                                    { icon: <FaCertificate size={14} />, label: "Issued By", value: result.certificate.issuer },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "14px 20px",
                                        borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <span style={{ color: "#6366F1", opacity: 0.8 }}>{item.icon}</span>
                                            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{item.label}</span>
                                        </div>
                                        <span style={{ fontSize: "14px", color: "#fff", fontWeight: 600, textAlign: "right", maxWidth: "55%" }}>
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Authenticity footer */}
                            <div style={{
                                marginTop: "20px", padding: "14px 16px",
                                background: "rgba(16,185,129,0.06)",
                                border: "1px solid rgba(16,185,129,0.12)",
                                borderRadius: "12px",
                                textAlign: "center",
                            }}>
                                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>
                                    🔒 This certificate has been cryptographically verified by Virtual Courses LMS.
                                    <br />The credential is authentic and was issued upon successful course completion.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Back to Home */}
                <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "8px",
                            padding: "10px 24px", borderRadius: "14px",
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "13px", fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "#fff"; }}
                        onMouseOut={(e) => { e.target.style.background = "rgba(255,255,255,0.06)"; e.target.style.color = "rgba(255,255,255,0.6)"; }}
                    >
                        <FaArrowLeft size={12} />
                        Back to Virtual Courses
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyCertificate;

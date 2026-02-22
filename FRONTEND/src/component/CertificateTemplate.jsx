import React, { forwardRef } from "react";
import { FaGraduationCap, FaCheckCircle, FaGlobe, FaCertificate, FaAward } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

const CertificateTemplate = forwardRef(({ studentName, courseTitle, date, certificateId }, ref) => {
    // Professional Brand Colors (Standard Hex for html2canvas)
    const colors = {
        primary: "#0f172a",    // Deep Navy
        secondary: "#b45309",  // Rich Gold
        accent: "#d97706",     // Amber Gold
        bg: "#ffffff",         // Pure White
        text: "#1e293b",       // Slate Text
        muted: "#64748b",      // Gray Text
        border: "#e2e8f0"      // Light Border
    };

    return (
        <div 
            ref={ref}
            style={{ 
                width: "1123px",
                height: "794px",
                padding: "0",
                position: "relative",
                backgroundColor: colors.bg,
                fontFamily: "'Times New Roman', serif",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
            }}
        >
            {/* Outer Decorative Border */}
            <div style={{ position: "absolute", inset: "20px", border: `2px solid ${colors.secondary}`, opacity: 0.3 }} />
            <div style={{ position: "absolute", inset: "35px", border: `8px double ${colors.primary}` }} />
            
            {/* Corner Decorative Elements */}
            {[
                { top: "45px", left: "45px", rotate: 0 },
                { top: "45px", right: "45px", rotate: 90 },
                { bottom: "45px", left: "45px", rotate: -90 },
                { bottom: "45px", right: "45px", rotate: 180 }
            ].map((pos, i) => (
                <div key={i} style={{ 
                    position: "absolute", 
                    width: "120px", 
                    height: "120px",
                    top: pos.top,
                    left: pos.left,
                    right: pos.right,
                    bottom: pos.bottom,
                    borderTop: `4px solid ${colors.secondary}`,
                    borderLeft: `4px solid ${colors.secondary}`,
                    transform: `rotate(${pos.rotate}deg)`,
                    zIndex: 2
                }} />
            ))}

            {/* Background watermark */}
            <div style={{ 
                position: "absolute", 
                inset: "0", 
                opacity: 0.03, 
                backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.primary} 1px, transparent 0)`,
                backgroundSize: "24px 24px"
            }} />

            <div style={{ position: "relative", zIndex: 10, width: "85%", textAlign: "center" }}>
                {/* Header Section */}
                <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginBottom: "10px" }}>
                        <div style={{ height: "2px", width: "100px", backgroundColor: colors.secondary }} />
                        <FaGraduationCap size={40} color={colors.primary} />
                        <div style={{ height: "2px", width: "100px", backgroundColor: colors.secondary }} />
                    </div>
                    <h4 style={{ color: colors.secondary, letterSpacing: "6px", fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", margin: "0" }}>
                        Academic Achievement
                    </h4>
                </div>

                <h1 style={{ 
                    fontSize: "78px", 
                    color: colors.primary, 
                    margin: "10px 0", 
                    fontWeight: "900", 
                    letterSpacing: "4px",
                    fontFamily: "Georgia, serif"
                }}>
                    CERTIFICATE
                </h1>
                <h3 style={{ 
                    fontSize: "24px", 
                    color: colors.muted, 
                    fontWeight: "normal", 
                    letterSpacing: "8px", 
                    textTransform: "uppercase",
                    marginTop: "-15px"
                }}>
                    OF COMPLETION
                </h3>

                <div style={{ margin: "40px 0" }}>
                    <p style={{ fontSize: "20px", fontStyle: "italic", color: colors.muted }}>This is to certify that</p>
                    <h2 style={{ 
                        fontSize: "64px", 
                        color: colors.primary, 
                        margin: "10px 0", 
                        borderBottom: `2px solid ${colors.secondary}`,
                        display: "inline-block",
                        padding: "0 40px 10px",
                        fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif"
                    }}>
                        {studentName}
                    </h2>
                </div>

                <p style={{ fontSize: "18px", lineHeight: "1.6", color: colors.text, maxWidth: "700px", margin: "0 auto" }}>
                    Has demonstrated exceptional commitment and mastery in the course of study
                </p>
                <h2 style={{ 
                    fontSize: "32px", 
                    color: colors.primary, 
                    marginTop: "15px", 
                    fontWeight: "bold",
                    fontStyle: "italic" 
                }}>
                    {courseTitle}
                </h2>

                {/* Footer and Signatures */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px", marginTop: "60px", alignItems: "flex-end" }}>
                    {/* Date */}
                    <div style={{ textAlign: "center" }}>
                        <div style={{ borderBottom: `1px solid ${colors.muted}`, paddingBottom: "10px", marginBottom: "10px" }}>
                            <span style={{ fontSize: "20px", fontWeight: "bold", color: colors.primary }}>{date}</span>
                        </div>
                        <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: colors.muted }}>Date Issued</p>
                    </div>

                    {/* Seal Area */}
                    <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                        <div style={{ 
                            width: "140px", 
                            height: "140px", 
                            backgroundColor: colors.secondary, 
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            position: "relative",
                            border: "4px double white"
                        }}>
                            <div style={{ textAlign: "center" }}>
                                <FaAward color="white" size={60} />
                                <p style={{ color: "white", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", margin: "5px 0 0" }}>Verified</p>
                            </div>
                        </div>
                        {/* Ribbons */}
                        <div style={{ 
                            position: "absolute", 
                            top: "100px", 
                            left: "50%", 
                            width: "40px", 
                            height: "60px", 
                            backgroundColor: colors.secondary, 
                            transform: "translateX(-45px) rotate(-15deg)",
                            zIndex: -1,
                            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)"
                        }} />
                        <div style={{ 
                            position: "absolute", 
                            top: "100px", 
                            left: "50%", 
                            width: "40px", 
                            height: "60px", 
                            backgroundColor: colors.accent, 
                            transform: "translateX(5px) rotate(15deg)",
                            zIndex: -1,
                            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)"
                        }} />
                    </div>

                    {/* Signature */}
                    <div style={{ textAlign: "center" }}>
                        <div style={{ borderBottom: `1px solid ${colors.muted}`, paddingBottom: "10px", marginBottom: "10px" }}>
                            <span style={{ fontSize: "28px", fontFamily: "'Brush Script MT', cursive", color: colors.primary, opacity: 0.8 }}>LMS Director</span>
                        </div>
                        <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: colors.muted }}>Authorized Signature</p>
                    </div>
                </div>

                {/* Verification ID / QR */}
                <div style={{ marginTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: 0.7 }}>
                    <div style={{ textAlign: "left" }}>
                        <p style={{ fontSize: "10px", color: colors.muted, margin: 0 }}>Certificate ID: {certificateId}</p>
                        <p style={{ fontSize: "10px", color: colors.muted, margin: 0 }}>Verify at: verify-lms.ac.in</p>
                    </div>
                    <div style={{ padding: "8px", background: "white", border: "1px solid #eee", borderRadius: "10px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                        <QRCodeCanvas 
                            value={`https://verify-lms.ac.in/verify/${certificateId}`} 
                            size={60}
                            level="H"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CertificateTemplate;

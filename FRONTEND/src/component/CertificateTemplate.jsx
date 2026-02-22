import React, { forwardRef } from "react";
import { FaGraduationCap, FaGlobe, FaCertificate, FaAward, FaShieldAlt } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

const CertificateTemplate = forwardRef(({ studentName, courseTitle, date, certificateId }, ref) => {
    // Luxury Academic Palette
    const colors = {
        navy: "#0a192f",       // Deep Midnight Navy
        gold: "#c5a059",       // Burnished Gold
        goldLight: "#e5c185",  // Champagne Gold
        cream: "#f9f6f0",      // Antique Paper
        white: "#ffffff",
        text: "#1e293b",
        muted: "#475569"
    };

    return (
        <div 
            ref={ref}
            style={{ 
                width: "1123px", // A4 Landscape Pixels at 96 DPI
                height: "794px",
                padding: "0",
                position: "relative",
                backgroundColor: colors.cream,
                backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.white} 0%, ${colors.cream} 100%)`,
                fontFamily: "'Playfair Display', 'Times New Roman', serif",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                boxSizing: "border-box"
            }}
        >
            {/* 1. Intricate Professional Border System */}
            {/* Outer Navy Border */}
            <div style={{ position: "absolute", inset: "0px", border: `40px solid ${colors.navy}` }} />
            
            {/* Gold Accent Line */}
            <div style={{ position: "absolute", inset: "15px", border: `2px solid ${colors.gold}` }} />
            
            {/* Inner Gold Frame with Pattern */}
            <div style={{ 
                position: "absolute", 
                inset: "45px", 
                border: `3px solid ${colors.gold}`,
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(197, 160, 89, 0.1) 5px, rgba(197, 160, 89, 0.1) 10px)`
            }} />

            {/* Corner Luxury Ornaments */}
            {[
                { top: "5px", left: "5px", rotation: 0 },
                { top: "5px", right: "5px", rotation: 90 },
                { bottom: "5px", left: "5px", rotation: -90 },
                { bottom: "5px", right: "5px", rotation: 180 }
            ].map((p, i) => (
                <div key={i} style={{
                    position: "absolute",
                    width: "100px",
                    height: "100px",
                    top: p.top, left: p.left, right: p.right, bottom: p.bottom,
                    transform: `rotate(${p.rotation}deg)`,
                    zIndex: 5
                }}>
                    <div style={{ width: "40px", height: "40px", borderTop: `8px solid ${colors.goldLight}`, borderLeft: `8px solid ${colors.goldLight}`, position: "absolute", top: "45px", left: "45px" }} />
                </div>
            ))}

            {/* 2. Sophisticated Content Container */}
            <div style={{ position: "relative", zIndex: 10, width: "80%", textAlign: "center", paddingTop: "20px" }}>
                
                {/* Prestige Header */}
                <div style={{ marginBottom: "25px" }}>
                    <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                        <div style={{ height: "1px", width: "120px", background: `linear-gradient(to right, transparent, ${colors.gold})` }} />
                        <div style={{ 
                            width: "60px", height: "60px", borderRadius: "12px", background: colors.navy, 
                            display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(45deg)",
                            boxShadow: `0 0 0 4px ${colors.gold}, 0 10px 20px rgba(0,0,0,0.2)`
                        }}>
                            <FaGraduationCap size={30} color={colors.gold} style={{ transform: "rotate(-45deg)" }} />
                        </div>
                        <div style={{ height: "1px", width: "120px", background: `linear-gradient(to left, transparent, ${colors.gold})` }} />
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "8px", color: colors.gold }}>
                        Accredited Learning Certificate
                    </span>
                </div>

                <h1 style={{ 
                    fontSize: "85px", 
                    margin: "0", 
                    color: colors.navy, 
                    fontWeight: "900", 
                    letterSpacing: "5px",
                    fontFamily: "'Georgia', serif",
                    textShadow: "1px 1px 0px rgba(197, 160, 89, 0.5)"
                }}>
                    CERTIFICATE
                </h1>
                <h2 style={{ 
                    fontSize: "22px", 
                    margin: "0", 
                    color: colors.muted, 
                    fontWeight: "300", 
                    letterSpacing: "12px", 
                    textTransform: "uppercase",
                    marginTop: "-10px"
                }}>
                    OF ACCOMPLISHMENT
                </h2>

                {/* Main Body */}
                <div style={{ margin: "45px 0" }}>
                    <p style={{ fontSize: "20px", fontStyle: "italic", color: colors.muted, marginBottom: "10px" }}>
                        This world-class recognition is proudly presented to
                    </p>
                    <div style={{ position: "relative", display: "inline-block" }}>
                        <h2 style={{ 
                            fontSize: "62px", 
                            color: colors.navy, 
                            margin: "0", 
                            padding: "0 60px",
                            fontFamily: "'Palatino Linotype', serif",
                            fontWeight: "bold"
                        }}>
                            {studentName}
                        </h2>
                        <div style={{ position: "absolute", bottom: "-10px", left: "0", right: "0", height: "2px", background: `linear-gradient(to right, transparent, ${colors.gold}, transparent)` }} />
                    </div>
                </div>

                <p style={{ fontSize: "18px", color: colors.text, maxWidth: "750px", margin: "0 auto", lineHeight: "1.6" }}>
                    in recognition of their dedicated tenure and exceptional performance in mastering the 
                    requisite curriculum and professional standards for 
                </p>
                
                <div style={{ marginTop: "20px" }}>
                    <h3 style={{ 
                        fontSize: "36px", 
                        color: colors.navy, 
                        fontWeight: "bold",
                        fontStyle: "italic",
                        textDecoration: "underline",
                        textDecorationColor: colors.goldLight,
                        textUnderlineOffset: "8px"
                    }}>
                        {courseTitle}
                    </h3>
                </div>

                {/* 3. Official Authentication Area */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "50px", marginTop: "55px", alignItems: "center" }}>
                    
                    {/* Left: Date & ID */}
                    <div style={{ textAlign: "center" }}>
                        <div style={{ borderBottom: `1.5px solid ${colors.gold}`, paddingBottom: "10px", marginBottom: "8px" }}>
                            <span style={{ fontSize: "20px", fontWeight: "bold", color: colors.navy }}>{date}</span>
                        </div>
                        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "bold", color: colors.muted }}>Date of Issuance</p>
                        <p style={{ fontSize: "9px", color: colors.muted, marginTop: "15px", letterSpacing: "1px" }}>Certificate ID: {certificateId}</p>
                    </div>

                    {/* Center: Prestigious Gold Seal */}
                    <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                        <div style={{ 
                            width: "150px", height: "150px", 
                            background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors. goldLight} 50%, ${colors.gold} 100%)`, 
                            borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 15px 35px rgba(0,0,0,0.2), inset 0 0 0 5px rgba(255,255,255,0.3)",
                            position: "relative", border: `2px solid ${colors.gold}`
                        }}>
                            <div style={{ textAlign: "center" }}>
                                <FaAward color="white" size={65} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }} />
                                <div style={{ 
                                    fontSize: "10px", fontWeight: "950", color: "white", 
                                    textTransform: "uppercase", marginTop: "5px", letterSpacing: "1px" 
                                }}>
                                    Official Seal
                                </div>
                            </div>
                        </div>
                        {/* Decorative Ribbons */}
                        <div style={{ position: "absolute", top: "115px", left: "55px", width: "45px", height: "80px", background: colors.navy, transform: "rotate(-15deg)", zIndex: -1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)" }} />
                        <div style={{ position: "absolute", top: "115px", left: "100px", width: "45px", height: "80px", background: colors.gold, transform: "rotate(15deg)", zIndex: -1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)" }} />
                    </div>

                    {/* Right: Signature Area */}
                    <div style={{ textAlign: "center" }}>
                        <div style={{ borderBottom: `1.5px solid ${colors.gold}`, paddingBottom: "10px", marginBottom: "8px", position: "relative" }}>
                             {/* Simulated Artistic Signature */}
                             <span style={{ 
                                fontSize: "32px", 
                                fontFamily: "'Brush Script MT', cursive", 
                                color: colors.navy, 
                                opacity: 0.8 
                             }}>
                                Prof. Alan Sterling
                             </span>
                        </div>
                        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "bold", color: colors.muted }}>Authorized Signature</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px", opacity: 0.6 }}>
                            <FaShieldAlt size={12} color={colors.gold} />
                            <span style={{ fontSize: "9px", fontWeight: "bold", color: colors.muted }}>SECURE VERIFICATION SYSTEM</span>
                        </div>
                    </div>
                </div>

                {/* Subtle Footer QR / Branding */}
                <div style={{ position: "absolute", bottom: "-40px", right: "-40px", display: "flex", alignItems: "center", gap: "15px" }}>
                    <div style={{ textAlign: "right", opacity: 0.4 }}>
                        <p style={{ fontSize: "9px", color: colors.muted, margin: 0, fontWeight: "bold" }}>VERIFY AUTHENTICITY</p>
                        <p style={{ fontSize: "8px", color: colors.muted, margin: 0 }}>portal.lmsplatform.com/verify</p>
                    </div>
                    <div style={{ 
                        padding: "6px", background: "white", borderRadius: "8px", 
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #eee" 
                    }}>
                        <QRCodeCanvas 
                            value={`https://verify-lms.ac.in/verify/${certificateId}`} 
                            size={55}
                            level="H"
                            includeMargin={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CertificateTemplate;

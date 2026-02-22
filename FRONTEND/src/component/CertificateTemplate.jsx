import React, { forwardRef } from "react";
import { FaGraduationCap, FaCheckCircle, FaGlobe, FaCertificate } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

const CertificateTemplate = forwardRef(({ studentName, courseTitle, date, certificateId }, ref) => {
    // Standard Hex Colors for html2canvas compatibility (Avoids oklch issues)
    const colors = {
        green: "#22c55e",
        greenLight: "#f0fdf4",
        black: "#000000",
        gray: "#6b7280",
        grayLight: "#e5e7eb",
        grayVeryLight: "#f9fafb",
        yellow: "#facc15"
    };

    return (
        <div 
            ref={ref}
            style={{ 
                width: "1123px",
                height: "794px",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px",
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#ffffff",
                background: `linear-gradient(135deg, #ffffff 0%, ${colors.grayVeryLight} 100%)`
            }}
        >
            {/* Border Design */}
            <div className="absolute inset-0 border-[30px]" style={{ borderColor: colors.black, opacity: 0.03 }}></div>
            <div className="absolute inset-4 border-[2px]" style={{ borderColor: colors.black, opacity: 0.1 }}></div>
            <div className="absolute inset-8 border-[1px]" style={{ borderColor: colors.green, opacity: 0.2 }}></div>

            {/* Background Texture/Pattern - Using standard gradients for html2canvas compatibility */}
            <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.1]" style={{ background: `radial-gradient(circle, ${colors.green}33 0%, rgba(255,255,255,0) 70%)` }} />
            <div className="absolute bottom-0 left-0 w-96 h-96 opacity-[0.1]" style={{ background: `radial-gradient(circle, ${colors.green}33 0%, rgba(255,255,255,0) 70%)` }} />

            {/* Corner Accents */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "160px", height: "160px", borderTop: "6px solid", borderLeft: "6px solid", margin: "40px", borderTopLeftRadius: "24px", borderColor: colors.green, opacity: 0.2 }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "160px", height: "160px", borderBottom: "6px solid", borderRight: "6px solid", margin: "40px", borderBottomRightRadius: "24px", borderColor: colors.green, opacity: 0.2 }} />

            <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "56rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Logo/Icon */}
                <div style={{ marginBottom: "32px", position: "relative" }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "36px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", backgroundColor: colors.black }}>
                        <FaGraduationCap />
                    </div>
                </div>

                {/* Header */}
                <h4 style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.4em", fontSize: "14px", marginBottom: "16px", color: colors.green }}>
                    Official Certificate of Achievement
                </h4>
                <h1 style={{ fontSize: "72px", fontWeight: "900", marginBottom: "32px", fontStyle: "italic", letterSpacing: "-0.05em", color: colors.black }}>
                    CERTIFICATE
                </h1>

                {/* Body */}
                <p style={{ fontSize: "18px", marginBottom: "8px", fontWeight: "500", color: colors.gray }}>This is to certify that</p>
                <div style={{ marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "48px", fontWeight: "900", color: colors.black, textTransform: "uppercase", letterSpacing: "-0.025em" }}>
                        {studentName}
                    </h2>
                    <div style={{ height: "4px", width: "96px", margin: "8px auto 0", borderRadius: "9999px", backgroundColor: colors.green }} />
                </div>

                <p style={{ fontSize: "18px", maxWidth: "42rem", lineHeight: "1.625", marginBottom: "24px", color: colors.gray }}>
                    has successfully completed the premium online course
                </p>
                
                <h3 style={{ fontSize: "30px", fontWeight: "700", marginBottom: "48px", padding: "12px 32px", borderRadius: "16px", border: "1px solid", fontStyle: "italic", color: colors.green, backgroundColor: colors.greenLight, borderColor: colors.greenLight }}>
                    {courseTitle}
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "64px", width: "100%", marginTop: "32px", alignItems: "flex-end" }}>
                    {/* Date */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "100%", borderBottom: "1px solid", paddingBottom: "8px", marginBottom: "8px", borderColor: colors.grayLight }}>
                            <span style={{ fontWeight: "700", fontSize: "18px", color: colors.black }}>{date}</span>
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: colors.gray }}>Completion Date</span>
                    </div>

                    {/* Seal */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <div style={{ width: "128px", height: "128px", borderRadius: "9999px", border: "4px dashed", display: "flex", alignItems: "center", justifyContent: "center", borderColor: `${colors.green}33` }}>
                           <div style={{ width: "96px", height: "96px", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "48px", backgroundColor: colors.green, boxShadow: "0 10px 20px rgba(34, 197, 94, 0.2)" }}>
                                <FaCheckCircle />
                           </div>
                        </div>
                        <div style={{ position: "absolute", top: "-16px", right: "-8px", transform: "rotate(12deg)" }}>
                             <div style={{ color: colors.black, fontSize: "10px", fontWeight: "900", padding: "4px 8px", borderRadius: "4px", textTransform: "uppercase", backgroundColor: colors.yellow, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>Authenticated</div>
                        </div>
                    </div>

                    {/* Signature */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "100%", borderBottom: "1px solid", paddingBottom: "8px", marginBottom: "8px", borderColor: colors.grayLight }}>
                             <span style={{ fontSize: "30px", fontWeight: "900", fontStyle: "italic", letterSpacing: "-0.05em", opacity: "0.7", color: colors.black }}>LMS Admin</span>
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: colors.gray }}>Digital Signature</span>
                    </div>
                </div>

                {/* Footer Info & Verification QR */}
                <div style={{ marginTop: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", paddingLeft: "48px", paddingRight: "48px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.5", color: colors.gray }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaGlobe style={{ color: colors.green }} />
                            verify-lms.ac.in
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaCertificate style={{ color: colors.green }} />
                            ID: {certificateId || "CERT-"+(Math.random().toString(36).substr(2, 9).toUpperCase())}
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        <div style={{ padding: "8px", backgroundColor: "#ffffff", border: "1px solid #f3f4f6", borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}>
                            <QRCodeCanvas 
                                value={`https://verify-lms.ac.in/verify/${certificateId}`} 
                                size={60}
                                level="H"
                                includeMargin={false}
                            />
                        </div>
                        <span style={{ fontSize: "8px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "-0.025em", opacity: "0.4" }}>Scan to Verify</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CertificateTemplate;

import React, { forwardRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const CertificateTemplate = forwardRef(({ studentName, courseTitle, date, certificateId }, ref) => {
    const c = {
        navy:       "#0a192f",
        gold:       "#c5a059",
        goldLight:  "#d4b578",
        goldPale:   "#f0e2c0",
        cream:      "#faf8f3",
        white:      "#ffffff",
        text:       "#1e293b",
        muted:      "#5c6a7a",
    };

    return (
        <div
            ref={ref}
            style={{
                width: "1123px",
                height: "794px",
                position: "relative",
                backgroundColor: c.cream,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                userSelect: "none",
            }}
        >
            {/* ─── BACKGROUND RADIAL GLOW ─── */}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${c.white} 0%, ${c.cream} 100%)` }} />

            {/* ─── BORDER SYSTEM ─────────────────── */}
            {/* Layer 1 – thick navy outer frame */}
            <div style={{ position: "absolute", inset: 0, border: `38px solid ${c.navy}`, zIndex: 1 }} />
            {/* Layer 2 – thin gold inner line */}
            <div style={{ position: "absolute", inset: "44px", border: `2px solid ${c.gold}`, zIndex: 1 }} />
            {/* Layer 3 – thin gold inner border */}
            <div style={{ position: "absolute", inset: "52px", border: `1px solid ${c.goldPale}`, zIndex: 1 }} />

            {/* ─── CORNER ORNAMENTS ─── */}
            {[{ t: "44px", l: "44px" }, { t: "44px", r: "44px" }, { b: "44px", l: "44px" }, { b: "44px", r: "44px" }].map((pos, i) => {
                const isRight = "r" in pos;
                const isBottom = "b" in pos;
                return (
                    <div key={i} style={{
                        position: "absolute", zIndex: 2,
                        top: pos.t, bottom: pos.b, left: pos.l, right: pos.r,
                        width: "70px", height: "70px"
                    }}>
                        <svg viewBox="0 0 70 70" width="70" height="70">
                            <g transform={isRight ? (isBottom ? "scale(-1,-1) translate(-70,-70)" : "scale(-1,1) translate(-70,0)") : isBottom ? "scale(1,-1) translate(0,-70)" : ""}>
                                <path d="M 5 5 L 35 5" stroke={c.gold} strokeWidth="2" fill="none" />
                                <path d="M 5 5 L 5 35" stroke={c.gold} strokeWidth="2" fill="none" />
                                <circle cx="5" cy="5" r="3" fill={c.gold} />
                                <circle cx="35" cy="5" r="1.5" fill={c.gold} />
                                <circle cx="5" cy="35" r="1.5" fill={c.gold} />
                                <path d="M 15 15 L 30 15 L 30 16 L 15 16 Z" fill={c.goldPale} />
                                <path d="M 15 15 L 16 15 L 16 30 L 15 30 Z" fill={c.goldPale} />
                                <path d="M 15 15 L 22 8" stroke={c.goldLight} strokeWidth="1" fill="none" />
                            </g>
                        </svg>
                    </div>
                );
            })}

            {/* ─── CONTENT WRAPPER ─── */}
            <div style={{ position: "relative", zIndex: 10, width: "78%", textAlign: "center" }}>

                {/* 1. Diamond Logo */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                    <div style={{
                        width: "52px", height: "52px",
                        backgroundColor: c.navy,
                        transform: "rotate(45deg)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 0 0 3px ${c.gold}, 0 8px 20px rgba(0,0,0,0.25)`
                    }}>
                        <span style={{ transform: "rotate(-45deg)", fontSize: "22px" }}>🎓</span>
                    </div>
                </div>

                {/* Brand Name */}
                <p style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "6px", color: c.gold, margin: "0 0 8px" }}>
                    Virtual Courses LMS
                </p>

                {/* CERTIFICATE heading */}
                <h1 style={{
                    fontSize: "76px", margin: "0", color: c.navy,
                    fontWeight: "900", letterSpacing: "6px",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    lineHeight: "1"
                }}>
                    CERTIFICATE
                </h1>
                <p style={{ fontSize: "16px", color: c.muted, letterSpacing: "7px", textTransform: "uppercase", margin: "4px 0 25px", fontFamily: "Georgia, serif" }}>
                    OF COMPLETION
                </p>

                {/* Sub text */}
                <p style={{ fontSize: "18px", fontStyle: "italic", color: c.muted, margin: "0 0 8px", fontFamily: "Georgia, serif" }}>
                    This certificate is proudly presented to
                </p>

                {/* Student Name — cursive serif */}
                <div style={{ position: "relative", display: "inline-block", marginBottom: "12px" }}>
                    <h2 style={{
                        fontSize: "58px", margin: "0", padding: "0 60px",
                        color: c.navy,
                        fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, 'Times New Roman', serif",
                        fontWeight: "normal",
                        fontStyle: "italic"
                    }}>
                        {studentName}
                    </h2>
                    {/* Gold underline */}
                    <div style={{ position: "absolute", bottom: "-6px", left: "30%", right: "30%", height: "1.5px", background: `linear-gradient(to right, transparent, ${c.gold}, transparent)` }} />
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", gap: "6px" }}>
                        <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: c.gold }} />
                        <div style={{ width: "30px", height: "2px", backgroundColor: c.gold, marginTop: "1px" }} />
                        <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: c.gold }} />
                    </div>
                </div>

                {/* Body copy */}
                <p style={{ fontSize: "16px", color: c.muted, maxWidth: "640px", margin: "0 auto 6px", lineHeight: "1.7", fontFamily: "Georgia, serif" }}>
                    For successfully completing the comprehensive course in
                </p>
                <h3 style={{
                    fontSize: "28px", color: c.navy, margin: "0",
                    fontWeight: "bold", fontFamily: "'Georgia', serif",
                    textDecoration: "underline", textDecorationColor: c.goldLight,
                    textUnderlineOffset: "6px"
                }}>
                    {courseTitle}
                </h3>
                <p style={{ fontSize: "14px", color: c.muted, margin: "4px 0 0", fontFamily: "Georgia, serif" }}>
                    demonstrating excellence and mastery in all required modules.
                </p>

                {/* ─── 3-COLUMN FOOTER ─── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 220px 1fr", gap: "30px", marginTop: "40px", alignItems: "flex-end" }}>

                    {/* Left – Date */}
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "3px", color: c.gold, margin: "0 0 6px" }}>DATE ISSUED</p>
                        <div style={{ borderBottom: `1.5px solid ${c.gold}`, paddingBottom: "8px", marginBottom: "6px" }}>
                            <span style={{ fontSize: "18px", fontWeight: "bold", color: c.navy }}>{date}</span>
                        </div>
                        <p style={{ fontSize: "9px", color: c.muted, letterSpacing: "1px", textTransform: "uppercase" }}>CERTIFICATE ID: {certificateId}</p>
                    </div>

                    {/* Center – Gold Wax Seal + Ribbons */}
                    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "flex-start", height: "160px" }}>
                        {/* Seal Circle */}
                        <div style={{
                            width: "140px", height: "140px",
                            background: `linear-gradient(145deg, ${c.goldLight} 0%, ${c.gold} 50%, #a07820 100%)`,
                            borderRadius: "50%",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            boxShadow: `0 0 0 4px ${c.cream}, 0 0 0 6px ${c.gold}, 0 12px 30px rgba(0,0,0,0.2)`,
                            zIndex: 2, position: "relative"
                        }}>
                            <span style={{ fontSize: "55px", filter: "brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>🏅</span>
                            <p style={{ fontSize: "9px", fontWeight: "bold", color: c.white, textTransform: "uppercase", letterSpacing: "1.5px", margin: 0 }}>VERIFIED</p>
                        </div>
                        {/* Ribbon Left */}
                        <div style={{ position: "absolute", top: "100px", left: "30px", width: "38px", height: "65px", backgroundColor: c.navy, zIndex: 1, transform: "rotate(-18deg)", clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)" }} />
                        {/* Ribbon Right */}
                        <div style={{ position: "absolute", top: "100px", right: "30px", width: "38px", height: "65px", backgroundColor: c.gold, zIndex: 1, transform: "rotate(18deg)", clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)" }} />
                    </div>

                    {/* Right – Vibhu Suneja Signature */}
                    <div style={{ textAlign: "center" }}>
                        <div style={{ borderBottom: `1.5px solid ${c.gold}`, paddingBottom: "8px", marginBottom: "6px" }}>
                            <span style={{
                                fontSize: "30px",
                                fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
                                color: c.navy,
                                opacity: 0.85
                            }}>
                                Vibhu Suneja
                            </span>
                        </div>
                        <p style={{ fontSize: "10px", fontWeight: "bold", color: c.muted, letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>Founder & Director</p>
                        <p style={{ fontSize: "9px", color: c.gold, letterSpacing: "1px", textTransform: "uppercase", margin: "2px 0 0" }}>Virtual Courses LMS</p>

                        {/* QR Code in right column */}
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "14px" }}>
                            <div style={{ padding: "5px", background: c.white, borderRadius: "6px", border: `1px solid ${c.goldPale}`, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                                <QRCodeCanvas
                                    value={`https://verify-lms.ac.in/verify/${certificateId}`}
                                    size={55} level="H" includeMargin={false}
                                />
                            </div>
                        </div>
                        <p style={{ fontSize: "8px", color: c.muted, margin: "4px 0 0", letterSpacing: "1px" }}>SCAN TO VERIFY</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CertificateTemplate;

import React, { forwardRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const CertificateTemplate = forwardRef(({ studentName, courseTitle, date, certificateId }, ref) => {
    // Format course title: capitalise each word
    const formatTitle = (title = "") =>
        title.replace(/\b\w/g, (ch) => ch.toUpperCase());

    // Strip time from date string – keep Day Month Year only
    const formatDate = (raw = "") => {
        return raw.split(" at ")[0].trim();
    };

    // Colors – ivory / crimson / gold palette
    const c = {
        crimson:     "#8b1a1a",
        crimsonDark: "#6b1212",
        gold:        "#c8a84b",
        goldLight:   "#d4b96a",
        goldPale:    "#e8d5a0",
        ivory:       "#f8f5ee",
        white:       "#ffffff",
        text:        "#2c1810",
        muted:       "#5a3e35",
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                boxSizing: "border-box",
                backgroundColor: c.ivory,
                // Stronger parchment / linen texture
                backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(180,160,100,0.10) 0px, rgba(180,160,100,0.10) 1px, transparent 1px, transparent 10px), " +
                    "repeating-linear-gradient(-45deg, rgba(180,160,100,0.10) 0px, rgba(180,160,100,0.10) 1px, transparent 1px, transparent 10px), " +
                    "radial-gradient(ellipse at 50% 50%, rgba(200,168,75,0.06) 0%, transparent 70%)",
                // Inner shadow for depth — "printed on paper" feel
                boxShadow: "inset 0 0 80px rgba(90,62,53,0.08), inset 0 0 30px rgba(200,168,75,0.06)",
            }}
        >
            {/* ═══════════════════════════════════════════
                LARGE FAINT CENTER WATERMARK
            ═══════════════════════════════════════════ */}
            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "220px",
                fontFamily: "'Cinzel Decorative', 'Georgia', serif",
                fontWeight: 900,
                color: c.gold,
                opacity: 0.04,
                letterSpacing: "20px",
                userSelect: "none",
                pointerEvents: "none",
                lineHeight: 1,
            }}>
                VC
            </div>

            {/* ═══════════════════════════════════════════
                BORDER SYSTEM – 3 nested layers
            ═══════════════════════════════════════════ */}
            <div style={{ position:"absolute", inset:"12px", border:`1.5px solid ${c.gold}` }} />
            <div style={{ position:"absolute", inset:"20px", border:`4px solid ${c.gold}` }} />
            <div style={{ position:"absolute", inset:"30px", border:`1px solid ${c.crimson}`, opacity:0.25 }} />

            {/* ═══════════════════════════════
                CORNER ORNAMENTS – larger, more intricate
            ═══════════════════════════════ */}
            {[
                { top:"12px",   left:"12px",   sx:1,  sy:1  },
                { top:"12px",   right:"12px",  sx:-1, sy:1  },
                { bottom:"12px",left:"12px",   sx:1,  sy:-1 },
                { bottom:"12px",right:"12px",  sx:-1, sy:-1 },
            ].map((p,i)=>(
                <div key={i} style={{ position:"absolute", ...p, width:"130px", height:"130px" }}>
                    <svg viewBox="0 0 130 130" width="130" height="130">
                        <g transform={`scale(${p.sx},${p.sy}) translate(${p.sx<0?-130:0},${p.sy<0?-130:0})`}>
                            {/* outer L */}
                            <path d="M8,8 L60,8" stroke={c.gold} strokeWidth="2.5" fill="none"/>
                            <path d="M8,8 L8,60" stroke={c.gold} strokeWidth="2.5" fill="none"/>
                            {/* inner L */}
                            <path d="M18,18 L50,18" stroke={c.gold} strokeWidth="1.2" fill="none"/>
                            <path d="M18,18 L18,50" stroke={c.gold} strokeWidth="1.2" fill="none"/>
                            {/* accent dots */}
                            <circle cx="8"  cy="8"  r="4" fill={c.gold}/>
                            <circle cx="60" cy="8"  r="2.5" fill={c.gold}/>
                            <circle cx="8"  cy="60" r="2.5" fill={c.gold}/>
                            <circle cx="18" cy="18" r="2.5" fill={c.goldLight}/>
                            {/* floral petal cluster */}
                            <ellipse cx="34" cy="12" rx="8"  ry="3.5" fill={c.goldPale} opacity=".85" transform="rotate(-20,34,12)"/>
                            <ellipse cx="12" cy="34" rx="8"  ry="3.5" fill={c.goldPale} opacity=".85" transform="rotate(70,12,34)"/>
                            <ellipse cx="26" cy="26" rx="10" ry="4"   fill={c.gold}    opacity=".45" transform="rotate(45,26,26)"/>
                            <circle  cx="26" cy="26" r="3"   fill={c.gold}/>
                            {/* vine tendrils — extended */}
                            <path d="M34,12 Q42,20 32,28" stroke={c.gold} strokeWidth="1" fill="none" opacity=".6"/>
                            <path d="M12,34 Q20,42 28,32" stroke={c.gold} strokeWidth="1" fill="none" opacity=".6"/>
                            <path d="M42,20 Q48,28 40,36" stroke={c.goldLight} strokeWidth="0.8" fill="none" opacity=".4"/>
                            <path d="M20,42 Q28,48 36,40" stroke={c.goldLight} strokeWidth="0.8" fill="none" opacity=".4"/>
                            {/* extra leaf */}
                            <ellipse cx="44" cy="14" rx="5" ry="2.5" fill={c.goldPale} opacity=".6" transform="rotate(-35,44,14)"/>
                            <ellipse cx="14" cy="44" rx="5" ry="2.5" fill={c.goldPale} opacity=".6" transform="rotate(55,14,44)"/>
                        </g>
                    </svg>
                </div>
            ))}

            {/* ═══════════════════════════════
                SIDE ORNAMENTS  (left & right midpoints)
            ═══════════════════════════════ */}
            {[{left:"14px", top:"50%", rotate:"0deg"}, {right:"14px", top:"50%", rotate:"180deg"}].map((p,i)=>(
                <div key={i} style={{ position:"absolute", ...p, transform:`translateY(-50%) rotate(${p.rotate})`, width:"55px" }}>
                    <svg viewBox="0 0 55 160" width="55" height="160">
                        <g>
                            <path d="M27,5 Q10,40 27,80 Q44,120 27,155" stroke={c.gold} strokeWidth="1.5" fill="none" opacity=".7"/>
                            <ellipse cx="27" cy="80" rx="14" ry="6" fill={c.goldPale} opacity=".8" transform="rotate(45,27,80)"/>
                            <ellipse cx="27" cy="80" rx="14" ry="6" fill={c.goldPale} opacity=".8" transform="rotate(-45,27,80)"/>
                            <circle  cx="27" cy="80" r="5" fill={c.gold}/>
                            <circle  cx="27" cy="30" r="3" fill={c.goldLight} opacity=".7"/>
                            <circle  cx="27" cy="130" r="3" fill={c.goldLight} opacity=".7"/>
                        </g>
                    </svg>
                </div>
            ))}

            {/* ═══════════════════════════════
                TOP FLORAL MEDALLION
            ═══════════════════════════════ */}
            <div style={{ position:"absolute", top:"32px", left:"50%", transform:"translateX(-50%)" }}>
                <svg viewBox="0 0 320 60" width="320" height="60">
                    <polygon points="160,5 175,30 160,55 145,30" fill={c.gold} opacity=".9"/>
                    <polygon points="160,12 170,30 160,48 150,30" fill={c.ivory}/>
                    <circle cx="160" cy="30" r="5" fill={c.crimson}/>
                    <path d="M 145,30 Q 120,15 90,30 Q 60,45 30,30 Q 15,22 5,30" stroke={c.gold} strokeWidth="1.5" fill="none"/>
                    <path d="M 175,30 Q 200,15 230,30 Q 260,45 290,30 Q 305,22 315,30" stroke={c.gold} strokeWidth="1.5" fill="none"/>
                    {[60,90,120,200,230,260].map((x,i)=>(
                        <g key={i}>
                            <ellipse cx={x} cy="30" rx="7" ry="3" fill={c.goldPale} opacity=".8" transform={`rotate(${i%2===0?35:-35},${x},30)`}/>
                            <circle cx={x} cy="30" r="2" fill={c.gold}/>
                        </g>
                    ))}
                </svg>
            </div>

            {/* ═══════════════════════════════
                CERTIFICATE NUMBER – top right
            ═══════════════════════════════ */}
            <div style={{
                position: "absolute", top: "38px", right: "55px",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "10px",
                color: c.muted,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                opacity: 0.7,
                textAlign: "right",
            }}>
                <span style={{ display:"block", fontSize:"8px", letterSpacing:"2px", marginBottom:"2px", color:c.gold }}>Certificate No.</span>
                <span style={{ fontWeight:600, color:c.text }}>{certificateId}</span>
            </div>

            {/* ═══════════════════════════════
                MAIN CONTENT
            ═══════════════════════════════ */}
            <div style={{ position:"relative", zIndex:10, width:"82%", textAlign:"center", marginTop:"6px" }}>

                {/* ── CERTIFICATE ── (line 1 — large display) */}
                <h1 style={{
                    fontSize: "64px",
                    fontFamily: "'Cinzel Decorative', 'Georgia', serif",
                    color: c.crimson,
                    fontWeight: 900,
                    letterSpacing: "8px",
                    margin: "42px 0 0",
                    textShadow: `1px 1px 0 rgba(139,26,26,0.15)`,
                    lineHeight: 1.1,
                }}>
                    CERTIFICATE
                </h1>

                {/* ── OF ACHIEVEMENT ── (line 2 — smaller, elegant) */}
                <p style={{
                    fontSize: "22px",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: c.crimson,
                    letterSpacing: "10px",
                    margin: "2px 0 0",
                    textTransform: "uppercase",
                    fontWeight: 600,
                }}>
                    Of Achievement
                </p>

                {/* Sub-ornament — gold divider with diamond */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", margin:"6px 0 10px" }}>
                    <div style={{ height:"1px", width:"100px", background:`linear-gradient(to right, transparent, ${c.gold}, transparent)` }} />
                    <svg viewBox="0 0 30 12" width="30" height="12">
                        <polygon points="15,1 20,6 15,11 10,6" fill={c.gold}/>
                        <circle cx="4"  cy="6" r="2" fill={c.gold} opacity=".7"/>
                        <circle cx="26" cy="6" r="2" fill={c.gold} opacity=".7"/>
                    </svg>
                    <div style={{ height:"1px", width:"100px", background:`linear-gradient(to left, transparent, ${c.gold}, transparent)` }} />
                </div>

                {/* Presenter text */}
                <p style={{
                    fontSize: "12px",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: c.crimson,
                    textTransform: "uppercase",
                    letterSpacing: "4px",
                    margin: "0 0 4px",
                    fontWeight: 600,
                }}>
                    This Certificate is Proudly Conferred Upon
                </p>

                {/* Student Name — premium cursive (Great Vibes) */}
                <div style={{ position:"relative", display:"inline-block", margin:"2px 0 4px" }}>
                    {/* Left scroll ornament */}
                    <svg viewBox="0 0 40 20" width="40" height="20" style={{ position:"absolute", left:"-10px", bottom:"8px" }}>
                        <path d="M35,10 Q25,2 15,10 Q8,16 2,10" stroke={c.gold} strokeWidth="1.2" fill="none" opacity=".7"/>
                        <circle cx="2" cy="10" r="2" fill={c.gold} opacity=".6"/>
                    </svg>
                    <h2 style={{
                        fontSize: "56px",
                        fontFamily: "'Great Vibes', 'Brush Script MT', cursive",
                        fontWeight: "normal",
                        color: c.text,
                        margin: "0",
                        padding: "0 50px",
                        lineHeight: 1.2,
                    }}>
                        {studentName}
                    </h2>
                    {/* Right scroll ornament */}
                    <svg viewBox="0 0 40 20" width="40" height="20" style={{ position:"absolute", right:"-10px", bottom:"8px", transform:"scaleX(-1)" }}>
                        <path d="M35,10 Q25,2 15,10 Q8,16 2,10" stroke={c.gold} strokeWidth="1.2" fill="none" opacity=".7"/>
                        <circle cx="2" cy="10" r="2" fill={c.gold} opacity=".6"/>
                    </svg>
                    <div style={{ height:"2px", backgroundColor: c.text, marginTop:"2px", opacity:.5 }} />
                </div>

                {/* "in the course of" connector */}
                <p style={{
                    fontSize: "13px",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    color: c.muted,
                    margin: "4px 0 2px",
                    letterSpacing: "2px",
                }}>
                    in the course of
                </p>

                {/* Course Title — crimson with gold underline accent */}
                <div style={{ display:"inline-block", marginBottom:"6px" }}>
                    <p style={{
                        fontSize: "26px",
                        fontFamily: "'Cormorant Garamond', 'Palatino Linotype', serif",
                        fontStyle: "italic",
                        fontWeight: 700,
                        color: c.crimson,
                        margin: "0",
                    }}>
                        {formatTitle(courseTitle)}
                    </p>
                    <div style={{ height:"1.5px", margin:"4px auto 0", width:"60%", background:`linear-gradient(to right, transparent, ${c.gold}, transparent)` }} />
                </div>

                {/* Body paragraph */}
                <p style={{
                    fontSize: "13px",
                    fontFamily: "'Cormorant Garamond', 'Palatino Linotype', serif",
                    fontStyle: "italic",
                    color: c.muted,
                    maxWidth: "680px",
                    margin: "0 auto 12px",
                    lineHeight: "1.8",
                }}>
                    For successfully fulfilling all requirements of the curriculum, exhibiting distinguished
                    commitment, and achieving commendable proficiency in the subject matter.
                </p>

                {/* ── GOLD ORNAMENTAL DIVIDER above footer ── */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", margin:"0 0 14px" }}>
                    <div style={{ height:"1px", width:"120px", background:`linear-gradient(to right, transparent, ${c.gold})` }} />
                    <svg viewBox="0 0 60 14" width="60" height="14">
                        <path d="M5,7 Q15,2 30,7 Q45,12 55,7" stroke={c.gold} strokeWidth="1" fill="none"/>
                        <circle cx="30" cy="7" r="2.5" fill={c.gold}/>
                        <circle cx="5" cy="7" r="1.5" fill={c.goldLight}/>
                        <circle cx="55" cy="7" r="1.5" fill={c.goldLight}/>
                    </svg>
                    <div style={{ height:"1px", width:"120px", background:`linear-gradient(to left, transparent, ${c.gold})` }} />
                </div>

                {/* ── 3-COLUMN FOOTER ── */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 180px 1fr", gap:"16px", alignItems:"end" }}>

                    {/* Left – Date & QR */}
                    <div style={{ textAlign:"center" }}>
                        <div style={{ borderBottom:`1.5px solid ${c.text}`, paddingBottom:"5px", marginBottom:"5px" }}>
                            <p style={{ fontFamily:"'Cormorant Garamond', Palatino, serif", fontStyle:"italic", fontSize:"19px", color:c.text, margin:0, fontWeight:600 }}>
                                {formatDate(date)}
                            </p>
                        </div>
                        <p style={{ fontFamily:"'Cormorant Garamond', Palatino, serif", fontStyle:"italic", fontSize:"14px", color:c.muted, margin:"0 0 4px" }}>
                            Date of Issuance
                        </p>
                        {/* QR Code */}
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginTop:"8px" }}>
                            <div style={{
                                padding:"5px", background:c.white,
                                border:`1.5px solid ${c.gold}`,
                                borderRadius:"50%",
                                boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
                                width:"68px", height:"68px",
                                display:"flex", alignItems:"center", justifyContent:"center",
                            }}>
                                <QRCodeCanvas
                                    value={`https://verify-lms.ac.in/verify/${certificateId}`}
                                    size={52} level="H" includeMargin={false}
                                    fgColor={c.crimsonDark}
                                />
                            </div>
                            <p style={{ fontSize:"8px", color:c.muted, margin:"4px 0 0", letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Cormorant Garamond', serif", fontWeight:600 }}>Scan to Verify</p>
                            <p style={{ fontSize:"7px", color:c.muted, margin:"1px 0 0", fontFamily:"'Cormorant Garamond', serif" }}>ID: {certificateId}</p>
                        </div>
                    </div>

                    {/* Center – Red Wax Seal (enlarged) */}
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end" }}>
                        <div style={{
                            width:"160px", height:"160px",
                            borderRadius:"50%",
                            background:`radial-gradient(circle at 35% 35%, #c0392b, ${c.crimsonDark} 55%, #3d0808 100%)`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            boxShadow:"0 8px 24px rgba(100,0,0,0.35), inset 0 2px 8px rgba(255,255,255,0.18)",
                            border:`3.5px solid ${c.crimson}`,
                            position:"relative",
                        }}>
                            {/* Outer embossed ring */}
                            <div style={{ position:"absolute", inset:"8px", borderRadius:"50%", border:"1.5px solid rgba(255,255,255,0.18)" }} />
                            {/* Inner embossed ring */}
                            <div style={{ position:"absolute", inset:"16px", borderRadius:"50%", border:"1px solid rgba(255,255,255,0.10)" }} />
                            {/* Circular text around seal */}
                            <svg viewBox="0 0 160 160" width="160" height="160" style={{ position:"absolute", top:0, left:0 }}>
                                <defs>
                                    <path id="sealCircleTop" d="M 80,80 m -55,0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0" />
                                </defs>
                                <text fill="rgba(255,255,255,0.50)" fontSize="8" fontFamily="'Cormorant Garamond', Georgia, serif" letterSpacing="3" fontWeight="600" textAnchor="middle">
                                    <textPath href="#sealCircleTop" startOffset="50%">
                                        VERIFIED CREDENTIAL • VIRTUAL COURSES LMS
                                    </textPath>
                                </text>
                            </svg>
                            {/* VC monogram */}
                            <span style={{
                                fontSize:"48px",
                                color:"rgba(255,255,255,0.92)",
                                fontFamily:"'Cinzel Decorative', 'Palatino Linotype', serif",
                                fontWeight:"bold",
                                textShadow:"0 2px 4px rgba(0,0,0,0.5)",
                                position:"relative", zIndex:1,
                            }}>VC</span>
                        </div>
                    </div>

                    {/* Right – Vibhu Suneja Signature */}
                    <div style={{ textAlign:"center" }}>
                        <div style={{ borderBottom:`1.5px solid ${c.text}`, paddingBottom:"5px", marginBottom:"5px" }}>
                            <p style={{
                                fontSize: "32px",
                                fontFamily: "'Great Vibes', 'Brush Script MT', cursive",
                                color: c.text,
                                margin: 0,
                                letterSpacing: "1px",
                            }}>
                                Vibhu Suneja
                            </p>
                        </div>
                        <p style={{ fontFamily:"'Cormorant Garamond', Palatino, serif", fontStyle:"italic", fontSize:"13px", color:c.text, margin:"0 0 2px", fontWeight:600 }}>
                            Authorized Signatory
                        </p>
                        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"9px", color:c.muted, margin:"3px 0 0", textTransform:"uppercase", letterSpacing:"1.5px", fontWeight:600 }}>
                            Founder &amp; Director, Virtual Courses LMS
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CertificateTemplate;

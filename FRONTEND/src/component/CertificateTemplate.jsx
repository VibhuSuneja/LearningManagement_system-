import React, { forwardRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const CertificateTemplate = forwardRef(({ studentName, courseTitle, date, certificateId }, ref) => {
    // Format course title: capitalise each word
    const formatTitle = (title = "") =>
        title.replace(/\b\w/g, (c) => c.toUpperCase());

    // Strip time from date string – keep Day Month Year only
    const formatDate = (raw = "") => {
        // raw arrives as e.g. "22 February 2026 at 04:41 pm"
        // We only keep the portion before " at "
        return raw.split(" at ")[0].trim();
    };
    // Colors matching the image reference: ivory, crimson, gold
    const c = {
        crimson:    "#8b1a1a",
        crimsonDark:"#6b1212",
        gold:       "#c8a84b",
        goldLight:  "#d4b96a",
        goldPale:   "#e8d5a0",
        ivory:      "#f8f5ee",
        white:      "#ffffff",
        text:       "#2c1810",
        muted:      "#5a3e35",
        bg:         "#faf8f2",
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
                // Subtle herringbone / linen texture via diagonal repeating pattern
                backgroundColor: c.ivory,
                backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(180,160,100,0.07) 0px, rgba(180,160,100,0.07) 1px, transparent 1px, transparent 12px), " +
                    "repeating-linear-gradient(-45deg, rgba(180,160,100,0.07) 0px, rgba(180,160,100,0.07) 1px, transparent 1px, transparent 12px)",
            }}
        >
            {/* ═══════════════════════════════════════════
                BORDER SYSTEM  —  3 nested layers
            ═══════════════════════════════════════════ */}
            {/* Layer 1 – thin outer gold line */}
            <div style={{ position:"absolute", inset:"14px", border:`1.5px solid ${c.gold}` }} />
            {/* Layer 2 – thicker inner gold frame */}
            <div style={{ position:"absolute", inset:"22px", border:`4px solid ${c.gold}` }} />
            {/* Layer 3 – hairline crimson inner rule */}
            <div style={{ position:"absolute", inset:"32px", border:`1px solid ${c.crimson}`, opacity:0.25 }} />

            {/* ═══════════════════════════════
                CORNER ORNAMENTS  (4 corners SVG)
            ═══════════════════════════════ */}
            {[
                { top:"14px",   left:"14px",   sx:1,  sy:1  },
                { top:"14px",   right:"14px",  sx:-1, sy:1  },
                { bottom:"14px",left:"14px",   sx:1,  sy:-1 },
                { bottom:"14px",right:"14px",  sx:-1, sy:-1 },
            ].map((p,i)=>(
                <div key={i} style={{ position:"absolute", ...p, width:"110px", height:"110px" }}>
                    <svg viewBox="0 0 110 110" width="110" height="110">
                        <g transform={`scale(${p.sx},${p.sy}) translate(${p.sx<0?-110:0},${p.sy<0?-110:0})`}>
                            {/* outer L */}
                            <path d="M8,8 L50,8" stroke={c.gold} strokeWidth="2.5" fill="none"/>
                            <path d="M8,8 L8,50" stroke={c.gold} strokeWidth="2.5" fill="none"/>
                            {/* inner L */}
                            <path d="M18,18 L42,18" stroke={c.gold} strokeWidth="1.2" fill="none"/>
                            <path d="M18,18 L18,42" stroke={c.gold} strokeWidth="1.2" fill="none"/>
                            {/* dots */}
                            <circle cx="8"  cy="8"  r="3.5" fill={c.gold}/>
                            <circle cx="50" cy="8"  r="2"   fill={c.gold}/>
                            <circle cx="8"  cy="50" r="2"   fill={c.gold}/>
                            <circle cx="18" cy="18" r="2"   fill={c.goldLight}/>
                            {/* floral petal cluster */}
                            <ellipse cx="30" cy="12" rx="6"  ry="3"  fill={c.goldPale} opacity=".9" transform="rotate(-20,30,12)"/>
                            <ellipse cx="12" cy="30" rx="6"  ry="3"  fill={c.goldPale} opacity=".9" transform="rotate(70,12,30)"/>
                            <ellipse cx="22" cy="22" rx="8"  ry="3.5" fill={c.gold}    opacity=".5" transform="rotate(45,22,22)"/>
                            <circle  cx="22" cy="22" r="2.5" fill={c.gold}/>
                            {/* vine tendrils */}
                            <path d="M30,12 Q35,18 28,24" stroke={c.gold} strokeWidth="1" fill="none" opacity=".6"/>
                            <path d="M12,30 Q18,35 24,28" stroke={c.gold} strokeWidth="1" fill="none" opacity=".6"/>
                        </g>
                    </svg>
                </div>
            ))}

            {/* ═══════════════════════════════
                SIDE ORNAMENTS  (left & right midpoints)
            ═══════════════════════════════ */}
            {[{left:"16px", top:"50%", rotate:"0deg"}, {right:"16px", top:"50%", rotate:"180deg"}].map((p,i)=>(
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
                TOP FLORAL MEDALLION (ornament above CERTIFICATE)
            ═══════════════════════════════ */}
            <div style={{ position:"absolute", top:"35px", left:"50%", transform:"translateX(-50%)" }}>
                <svg viewBox="0 0 320 60" width="320" height="60">
                    {/* center diamond */}
                    <polygon points="160,5 175,30 160,55 145,30" fill={c.gold} opacity=".9"/>
                    <polygon points="160,12 170,30 160,48 150,30" fill={c.ivory}/>
                    <circle cx="160" cy="30" r="5" fill={c.crimson}/>
                    {/* horizontal flourishes */}
                    <path d="M 145,30 Q 120,15 90,30 Q 60,45 30,30 Q 15,22 5,30" stroke={c.gold} strokeWidth="1.5" fill="none"/>
                    <path d="M 175,30 Q 200,15 230,30 Q 260,45 290,30 Q 305,22 315,30" stroke={c.gold} strokeWidth="1.5" fill="none"/>
                    {/* petals along flourish */}
                    {[60,90,120,200,230,260].map((x,i)=>(
                        <g key={i}>
                            <ellipse cx={x} cy="30" rx="7" ry="3" fill={c.goldPale} opacity=".8" transform={`rotate(${i%2===0?35:-35},${x},30)`}/>
                            <circle cx={x} cy="30" r="2" fill={c.gold}/>
                        </g>
                    ))}
                </svg>
            </div>

            {/* ═══════════════════════════════
                MAIN CONTENT
            ═══════════════════════════════ */}
            <div style={{ position:"relative", zIndex:10, width:"82%", textAlign:"center", marginTop:"10px" }}>

                {/* CERTIFICATE OF ACHIEVEMENT title */}
                <h1 style={{
                    fontSize: "62px",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    color: c.crimson,
                    fontWeight: "bold",
                    letterSpacing: "5px",
                    margin: "46px 0 0",
                    textShadow: `1px 1px 0 rgba(139,26,26,0.2)`,
                }}>
                    CERTIFICATE OF ACHIEVEMENT
                </h1>

                {/* Sub-ornament under title */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", margin:"2px 0 14px" }}>
                    <div style={{ height:"1px", width:"80px", backgroundColor:c.gold, opacity:.8 }} />
                    <svg viewBox="0 0 30 12" width="30" height="12">
                        <polygon points="15,1 20,6 15,11 10,6" fill={c.gold}/>
                        <circle cx="4"  cy="6" r="2" fill={c.gold} opacity=".7"/>
                        <circle cx="26" cy="6" r="2" fill={c.gold} opacity=".7"/>
                    </svg>
                    <div style={{ height:"1px", width:"80px", backgroundColor:c.gold, opacity:.8 }} />
                </div>

                {/* Presenter text */}
                <p style={{
                    fontSize: "13px",
                    fontFamily: "Georgia, serif",
                    color: c.crimson,
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    margin: "0 0 6px",
                    fontWeight: "bold"
                }}>
                    This Certificate is Proudly Conferred Upon
                </p>

                {/* Student Name — large cursive italic */}
                <div style={{ position:"relative", display:"inline-block", margin:"4px 0 8px" }}>
                    <h2 style={{
                        fontSize: "58px",
                        fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
                        fontStyle: "italic",
                        fontWeight: "normal",
                        color: c.text,
                        margin: "0",
                        padding: "0 40px"
                    }}>
                        {studentName}
                    </h2>
                    <div style={{ height:"2px", backgroundColor: c.text, marginTop:"4px", opacity:.6 }} />
                </div>

                {/* Course Title — red italic */}
                <p style={{
                    fontSize: "26px",
                    fontFamily: "'Palatino Linotype', Palatino, serif",
                    fontStyle: "italic",
                    color: c.crimson,
                    margin: "6px 0 10px"
                }}>
                    {formatTitle(courseTitle)}
                </p>

                {/* Body paragraph */}
                <p style={{
                    fontSize: "14px",
                    fontFamily: "'Palatino Linotype', Palatino, serif",
                    fontStyle: "italic",
                    color: c.muted,
                    maxWidth: "720px",
                    margin: "0 auto 22px",
                    lineHeight: "1.75"
                }}>
                    For successfully fulfilling all requirements of the curriculum, exhibiting distinguished
                    commitment, and achieving commendable proficiency in the subject matter.
                </p>

                {/* ── 3-COLUMN FOOTER ── */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 200px 1fr", gap:"20px", alignItems:"flex-end" }}>

                    {/* Left – Date & Time */}
                    <div style={{ textAlign:"center" }}>
                        <div style={{ borderBottom:`1.5px solid ${c.text}`, paddingBottom:"6px", marginBottom:"6px" }}>
                            <p style={{ fontFamily:"'Palatino Linotype', Palatino, serif", fontStyle:"italic", fontSize:"20px", color:c.text, margin:0 }}>
                                {formatDate(date)}
                            </p>
                        </div>
                        <p style={{ fontFamily:"'Palatino Linotype', Palatino, serif", fontStyle:"italic", fontSize:"16px", color:c.text, margin:"0 0 4px" }}>
                            Date of Issuance
                        </p>
                        {/* QR Code below date */}
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginTop:"10px" }}>
                            <div style={{ padding:"5px", background:c.white, border:`1px solid ${c.gold}`, borderRadius:"6px", boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}>
                                <QRCodeCanvas
                                    value={`https://verify-lms.ac.in/verify/${certificateId}`}
                                    size={55} level="H" includeMargin={false}
                                    fgColor={c.crimsonDark}
                                />
                            </div>
                            <p style={{ fontSize:"9px", color:c.muted, margin:"4px 0 0", letterSpacing:"1px", textTransform:"uppercase", fontFamily:"Georgia, serif" }}>Scan to Verify</p>
                            <p style={{ fontSize:"8px", color:c.muted, margin:"2px 0 0", fontFamily:"Georgia, serif" }}>ID: {certificateId}</p>
                        </div>
                    </div>

                    {/* Center – Red Wax Seal */}
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", gap:"0" }}>
                        {/* Seal ring */}
                        <div style={{
                            width:"140px", height:"140px",
                            borderRadius:"50%",
                            background:`radial-gradient(circle at 35% 35%, #c0392b, ${c.crimsonDark} 60%, #3d0808)`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            boxShadow:"0 6px 20px rgba(100,0,0,0.35), inset 0 2px 6px rgba(255,255,255,0.2)",
                            border:`3px solid ${c.crimson}`,
                            position:"relative"
                        }}>
                            {/* inner embossed ring */}
                            <div style={{ position:"absolute", inset:"10px", borderRadius:"50%", border:"1.5px solid rgba(255,255,255,0.2)" }} />
                            {/* Circular embossed text around monogram */}
                            <svg viewBox="0 0 140 140" width="140" height="140" style={{ position:"absolute", top:0, left:0 }}>
                                <defs>
                                    <path id="sealCircle" d="M 70,70 m -48,0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0" />
                                </defs>
                                <text fill="rgba(255,255,255,0.55)" fontSize="8.5" fontFamily="Georgia, serif" letterSpacing="2.8" textAnchor="middle">
                                    <textPath href="#sealCircle" startOffset="50%">
                                        VERIFIED CREDENTIAL • VIRTUAL COURSES LMS
                                    </textPath>
                                </text>
                            </svg>
                            {/* VC monogram */}
                            <span style={{ fontSize:"46px", color:"rgba(255,255,255,0.92)", fontFamily:"'Palatino Linotype', Georgia, serif", fontStyle:"italic", fontWeight:"bold", textShadow:"0 2px 4px rgba(0,0,0,0.5)", position:"relative", zIndex:1 }}>VC</span>
                        </div>
                    </div>

                    {/* Right – Vibhu Suneja Signature */}
                    <div style={{ textAlign:"center" }}>
                        <div style={{ borderBottom:`1.5px solid ${c.text}`, paddingBottom:"6px", marginBottom:"6px" }}>
                            {/* Stylised cursive signature */}
                            <p style={{
                                fontSize: "32px",
                                fontFamily: "'Brush Script MT', 'Palatino Linotype', cursive",
                                color: c.text,
                                margin: 0,
                                letterSpacing: "1px"
                            }}>
                                Vibhu Suneja
                            </p>
                        </div>
                        <p style={{ fontFamily:"'Palatino Linotype', Palatino, serif", fontStyle:"italic", fontSize:"14px", color:c.text, margin:"0 0 2px" }}>
                            Authorized Signatory
                        </p>
                        <p style={{ fontFamily:"Georgia, serif", fontSize:"10px", color:c.muted, margin:"4px 0 0", textTransform:"uppercase", letterSpacing:"1.5px" }}>
                            Founder &amp; Director, Virtual Courses LMS
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CertificateTemplate;

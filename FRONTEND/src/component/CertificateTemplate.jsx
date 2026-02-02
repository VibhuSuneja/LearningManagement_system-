import React, { forwardRef } from "react";
import { FaGraduationCap, FaCheckCircle, FaGlobe, FaCertificate } from "react-icons/fa";

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
            className="w-[1123px] h-[794px] relative overflow-hidden flex items-center justify-center p-12 select-none"
            style={{ 
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
            <div className="absolute top-0 left-0 w-40 h-40 border-t-[6px] border-l-[6px] m-10 rounded-tl-3xl" style={{ borderColor: colors.green, opacity: 0.2 }} />
            <div className="absolute bottom-0 right-0 w-40 h-40 border-b-[6px] border-r-[6px] m-10 rounded-br-3xl" style={{ borderColor: colors.green, opacity: 0.2 }} />

            <div className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center">
                {/* Logo/Icon */}
                <div className="mb-8 relative">
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl relative" style={{ backgroundColor: colors.black }}>
                        <FaGraduationCap />
                    </div>
                </div>

                {/* Header */}
                <h4 className="font-black uppercase tracking-[0.4em] text-sm mb-4" style={{ color: colors.green }}>
                    Official Certificate of Achievement
                </h4>
                <h1 className="text-7xl font-black mb-8 italic tracking-tighter" style={{ color: colors.black }}>
                    CERTIFICATE
                </h1>

                {/* Body */}
                <p className="text-lg mb-2 font-medium" style={{ color: colors.gray }}>This is to certify that</p>
                <div className="mb-6">
                    <h2 className="text-5xl font-black uppercase tracking-tight" style={{ color: colors.black }}>
                        {studentName}
                    </h2>
                    <div className="h-1 w-24 mx-auto mt-2 rounded-full" style={{ backgroundColor: colors.green }} />
                </div>

                <p className="text-lg max-w-2xl leading-relaxed mb-6" style={{ color: colors.gray }}>
                    has successfully completed the premium online course
                </p>
                
                <h3 className="text-3xl font-bold mb-12 px-8 py-3 rounded-2xl border italic" style={{ color: colors.green, backgroundColor: colors.greenLight, borderColor: colors.greenLight }}>
                    {courseTitle}
                </h3>

                <div className="grid grid-cols-3 gap-16 w-full mt-8 items-end">
                    {/* Date */}
                    <div className="flex flex-col items-center">
                        <div className="w-full border-b pb-2 mb-2" style={{ borderColor: colors.grayLight }}>
                            <span className="font-bold text-lg" style={{ color: colors.black }}>{date}</span>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: colors.gray }}>Completion Date</span>
                    </div>

                    {/* Seal */}
                    <div className="flex flex-col items-center justify-center relative">
                        <div className="w-32 h-32 rounded-full border-4 border-dashed flex items-center justify-center" style={{ borderColor: `${colors.green}33` }}>
                           <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-5xl shadow-xl" style={{ backgroundColor: colors.green, boxShadow: `0 10px 20px ${colors.green}33` }}>
                                <FaCheckCircle />
                           </div>
                        </div>
                        <div className="absolute -top-4 -right-2 transform rotate-12">
                             <div className="text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase" style={{ backgroundColor: colors.yellow, color: colors.black }}>Authenticated</div>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="flex flex-col items-center">
                        <div className="w-full border-b pb-2 mb-2" style={{ borderColor: colors.grayLight }}>
                             <span className="text-3xl font-black italic tracking-tighter opacity-70" style={{ color: colors.black }}>LMS Admin</span>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: colors.gray }}>Digital Signature</span>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-20 flex items-center gap-12 text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: colors.gray }}>
                    <div className="flex items-center gap-2">
                        <FaGlobe style={{ color: colors.green }} />
                        verify-lms.ac.in
                    </div>
                    <div>•</div>
                    <div className="flex items-center gap-2">
                        <FaCertificate style={{ color: colors.green }} />
                        ID: {certificateId || "CERT-"+Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CertificateTemplate;

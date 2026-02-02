import React, { forwardRef } from "react";
import { FaGraduationCap, FaCheckCircle, FaGlobe, FaCertificate } from "react-icons/fa";

const CertificateTemplate = forwardRef(({ studentName, courseTitle, date, certificateId }, ref) => {
    return (
        <div 
            ref={ref}
            className="w-[1123px] h-[794px] bg-white relative overflow-hidden flex items-center justify-center p-12 select-none"
            style={{ 
                fontFamily: "'Inter', sans-serif",
                background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)"
            }}
        >
            {/* Border Design */}
            <div className="absolute inset-0 border-[30px] border-black opacity-[0.03]"></div>
            <div className="absolute inset-4 border-[2px] border-black opacity-[0.1]"></div>
            <div className="absolute inset-8 border-[1px] border-green-500 opacity-[0.2]"></div>

            {/* Background Texture/Pattern */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-40 h-40 border-t-[6px] border-l-[6px] border-green-500 m-10 rounded-tl-3xl opacity-20" />
            <div className="absolute bottom-0 right-0 w-40 h-40 border-b-[6px] border-r-[6px] border-green-500 m-10 rounded-br-3xl opacity-20" />

            <div className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center">
                {/* Logo/Icon */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse rounded-full" />
                    <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl relative">
                        <FaGraduationCap />
                    </div>
                </div>

                {/* Header */}
                <h4 className="text-green-500 font-black uppercase tracking-[0.4em] text-sm mb-4">
                    Official Certificate of Achievement
                </h4>
                <h1 className="text-7xl font-black text-black mb-8 italic tracking-tighter">
                    CERTIFICATE
                </h1>

                {/* Body */}
                <p className="text-gray-500 text-lg mb-2 font-medium">This is to certify that</p>
                <h2 className="text-5xl font-black text-black mb-6 uppercase tracking-tight relative group">
                    {studentName}
                    <div className="h-1 w-24 bg-green-500 mx-auto mt-2 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </h2>

                <p className="text-gray-500 text-lg max-w-2xl leading-relaxed mb-6">
                    has successfully completed the premium online course
                </p>
                
                <h3 className="text-3xl font-bold text-green-600 mb-12 bg-green-50 px-8 py-3 rounded-2xl border border-green-100 italic">
                    {courseTitle}
                </h3>

                <div className="grid grid-cols-3 gap-16 w-full mt-8 items-end">
                    {/* Date */}
                    <div className="flex flex-col items-center">
                        <div className="w-full border-b border-gray-200 pb-2 mb-2">
                            <span className="text-black font-bold text-lg">{date}</span>
                        </div>
                        <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Completion Date</span>
                    </div>

                    {/* Seal */}
                    <div className="flex flex-col items-center justify-center relative">
                        <div className="w-32 h-32 rounded-full border-4 border-dashed border-green-500/20 flex items-center justify-center">
                           <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-5xl shadow-xl shadow-green-500/20">
                                <FaCheckCircle />
                           </div>
                        </div>
                        <div className="absolute -top-4 -right-2 transform rotate-12">
                             <div className="bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">Authenticated</div>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="flex flex-col items-center">
                        <div className="w-full border-b border-gray-200 pb-2 mb-2">
                             <span className="text-3xl font-black italic tracking-tighter opacity-70">LMS Admin</span>
                        </div>
                        <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Digital Signature</span>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-20 flex items-center gap-12 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-50">
                    <div className="flex items-center gap-2">
                        <FaGlobe className="text-green-500" />
                        verify-lms.ac.in
                    </div>
                    <div>•</div>
                    <div className="flex items-center gap-2">
                        <FaCertificate className="text-green-500" />
                        ID: {certificateId || "CERT-"+Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CertificateTemplate;

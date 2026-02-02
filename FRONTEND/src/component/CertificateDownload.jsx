import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FaDownload, FaAward } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import CertificateTemplate from './CertificateTemplate';
import { toast } from 'react-toastify';

const CertificateDownload = ({ studentName, courseTitle, date, certificateId }) => {
    const certificateRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadCertificate = async () => {
        if (!certificateRef.current) return;
        
        setIsDownloading(true);
        toast.info("Generating your premium certificate...");

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                backgroundColor: "#fff",
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${studentName}-${courseTitle.replace(/\s+/g, '-')}-Certificate.pdf`);
            
            toast.success("Certificate downloaded successfully! Congratulations!");
        } catch (error) {
            console.error("Certificate Generation Error:", error);
            toast.error("Failed to generate certificate. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="relative">
            {/* Action Button */}
            <button
                onClick={downloadCertificate}
                disabled={isDownloading}
                className="group relative flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-black uppercase text-sm rounded-2xl shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-70"
            >
                {isDownloading ? (
                    <ClipLoader size={18} color="white" />
                ) : (
                    <>
                        <FaAward className="text-xl group-hover:rotate-12 transition-transform" />
                        Download Certificate
                    </>
                )}
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            </button>

            {/* Hidden Template for PDF Generation */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <CertificateTemplate 
                    ref={certificateRef}
                    studentName={studentName}
                    courseTitle={courseTitle}
                    date={date}
                    certificateId={certificateId}
                />
            </div>
        </div>
    );
};

export default CertificateDownload;

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
            // Wait for a few frames to ensure all assets are laid out
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(certificateRef.current, {
                scale: 3, // Even higher scale for professional printing
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
                width: 1123,
                height: 794
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [1123, 794]
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, 1123, 794);
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

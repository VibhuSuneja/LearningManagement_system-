import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

const TermsAndConditions = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6 font-sans">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-[40px] p-10 relative border border-gray-100">
                <FaArrowLeftLong 
                    className='absolute top-10 left-10 w-6 h-6 cursor-pointer hover:-translate-x-2 transition-transform' 
                    onClick={() => navigate("/")}
                />
                <h1 className="text-4xl font-black text-black uppercase tracking-tight text-center mb-10">Terms & Conditions</h1>
                
                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-black border-l-4 border-black pl-4 mb-4 uppercase text-xs tracking-[0.2em]">1. Acceptance of Terms</h2>
                        <p>By accessing and using V-LMS, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services. We reserve the right to modify these terms at any time.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black border-l-4 border-black pl-4 mb-4 uppercase text-xs tracking-[0.2em]">2. Virtual Learning Services</h2>
                        <p>V-LMS provides a platform for course enrollment, live sessions, and community interaction. All content provided is for educational purposes only. Creators retain ownership of their content while granting V-LMS a license to host it.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black border-l-4 border-black pl-4 mb-4 uppercase text-xs tracking-[0.2em]">3. User Conduct</h2>
                        <p>Users must not engage in any activity that is harmful, illegal, or violates the rights of others. This includes spamming, data mining, or uploading offensive content in our forums and chat systems.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black border-l-4 border-black pl-4 mb-4 uppercase text-xs tracking-[0.2em]">4. Payments and Refunds</h2>
                        <p>Course enrollments may require payment. For testing purposes, students should use <code className="bg-gray-100 px-2 py-1 rounded">success@razorpay</code> for safe transaction simulation. No real funds are deducted during this testing phase.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black border-l-4 border-black pl-4 mb-4 uppercase text-xs tracking-[0.2em]">5. Limitation of Liability</h2>
                        <p>V-LMS is provided "as is" without any warranties. We are not liable for any indirect, incidental, or consequential damages arising from the use of our platform.</p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-400 font-black uppercase tracking-widest italic">Last Updated: January 2026</p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;

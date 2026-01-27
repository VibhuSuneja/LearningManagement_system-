import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6 font-sans">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-[40px] p-10 relative border border-gray-100">
                <FaArrowLeftLong 
                    className='absolute top-10 left-10 w-6 h-6 cursor-pointer hover:-translate-x-2 transition-transform' 
                    onClick={() => navigate("/")}
                />
                <h1 className="text-4xl font-black text-black uppercase tracking-tight text-center mb-10">Privacy Policy</h1>
                
                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-black border-l-4 border-black pl-4 mb-4 uppercase text-xs tracking-[0.2em]">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as your name, email address, profile photo, and bio when you create an account or update your profile.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black border-l-4 border-black pl-4 mb-4 uppercase text-xs tracking-[0.2em]">2. How We Use Your Information</h2>
                        <p>We use your information to personalize your learning experience, facilitate communication between users, track achievement progress (XP Points), and provide customer support.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black border-l-4 border-black pl-4 mb-4 uppercase text-xs tracking-[0.2em]">3. Data Security</h2>
                        <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black border-l-4 border-black pl-4 mb-4 uppercase text-xs tracking-[0.2em]">4. Third-Party Services</h2>
                        <p>We use services like Cloudinary for image hosting and Razorpay for payment processing. These services have their own privacy policies governing how they handle your data.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black border-l-4 border-black pl-4 mb-4 uppercase text-xs tracking-[0.2em]">5. Your Choices</h2>
                        <p>You can update your profile information at any time through your account settings. You may also contact us to request the deletion of your account and personal data.</p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-400 font-black uppercase tracking-widest italic">Last Updated: January 2026</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaChevronLeft, FaTimes, FaGraduationCap, FaRobot, FaCheckCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const OnboardingTour = () => {
    const { userData } = useSelector((state) => state.user);
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const educatorSteps = [
        {
            title: "Welcome, Educator! 🎓",
            content: "Ready to share your knowledge? Let's take a quick 1-minute tour of your powerful new dashboard.",
            icon: <FaGraduationCap />,
            target: "body"
        },
        {
            title: "Insights at a Glance",
            content: "Monitor your success with real-time stats on enrolled students, total courses, and earnings right here.",
            icon: <FaCheckCircle />,
            target: ".stats-overview" 
        },
        {
            title: "Content Maestro",
            content: "The 'All Created Courses' section is your hub. Use the icons to manage lectures, create quizzes, or grade assignments.",
            icon: <FaCheckCircle />,
            target: "button:contains('Manage')"
        },
        {
            title: "Community Power",
            content: "Engage with your students in the Forums. Answer questions and build a thriving learning community.",
            icon: <FaCheckCircle />,
            target: "a[href='/forum']"
        }
    ];

    const studentSteps = [
        {
            title: "Welcome to Virtual Courses! 🚀",
            content: "The future of learning is here. Let's show you how to navigate your new classroom.",
            icon: <FaGraduationCap />,
            target: "body"
        },
        {
            title: "Your Learning Hub",
            content: "Find all your enrolled courses in 'My Courses'. We track your progress automatically so you never get lost.",
            icon: <FaCheckCircle />,
            target: "a[href='/mycourses']"
        },
        {
            title: "AI Study Assistant",
            content: "Stuck on a concept? Our Gemini-powered AI assistant is available 24/7 to answer your specific course questions.",
            icon: <FaRobot />,
            target: ".chatbot-toggle"
        },
        {
            title: "Compete & Climb",
            content: "Earn points by completing tasks and check the Leaderboard to see your global rank. Stay motivated!",
            icon: <FaCheckCircle />,
            target: "a[href='/leaderboard']"
        }
    ];

    const steps = userData?.role === 'educator' ? educatorSteps : studentSteps;

    useEffect(() => {
        const hasSeenTour = localStorage.getItem(`tour_seen_${userData?.role}_${userData?._id}`);
        if (!hasSeenTour && userData) {
            setTimeout(() => setIsVisible(true), 2000);
        }
    }, [userData]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeTour();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const completeTour = () => {
        setIsVisible(false);
        localStorage.setItem(`tour_seen_${userData?.role}_${userData?._id}`, 'true');
    };

    const restartTour = () => {
        setCurrentStep(0);
        setIsVisible(true);
    };

    // Expose restart capability globally for the "Tour" buttons
    useEffect(() => {
        window.startAppTour = restartTour;
        return () => delete window.startAppTour;
    }, [userData]);

    if (!isVisible || !userData) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={completeTour}
            />

            {/* Tour Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        className="h-full bg-black"
                    />
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                            {steps[currentStep].icon}
                        </div>
                        <button 
                            onClick={completeTour}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <h3 className="text-2xl font-black text-gray-800 mb-3 tracking-tight">
                        {steps[currentStep].title}
                    </h3>
                    <p className="text-gray-500 font-medium leading-relaxed mb-8">
                        {steps[currentStep].content}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            {steps.map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        i === currentStep ? 'w-6 bg-black' : 'w-2 bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>

                        <div className="flex gap-3">
                            {currentStep > 0 && (
                                <button
                                    onClick={handlePrev}
                                    className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    <FaChevronLeft />
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="px-6 py-3 bg-black text-white rounded-2xl font-black flex items-center gap-2 hover:bg-gray-900 transition-all shadow-xl shadow-gray-200"
                            >
                                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Role Badge */}
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {userData?.role} Onboarding
                    </span>
                    <span className="text-[10px] font-black text-gray-300">
                        Step {currentStep + 1} of {steps.length}
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

export default OnboardingTour;

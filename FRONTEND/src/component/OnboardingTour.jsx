import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaChevronLeft, FaTimes, FaGraduationCap, FaRobot, FaCheckCircle, FaPlay } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const OnboardingTour = () => {
    const { userData } = useSelector((state) => state.user);
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [spotlightRect, setSpotlightRect] = useState(null);

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
            content: "The 'All Created Courses' section is your hub. Use icons to manage lectures, create quizzes, or grade assignments.",
            icon: <FaCheckCircle />,
            target: ".course-grid, .courses-container, #course-list"
        },
        {
            title: "Growth & Community",
            content: "Stay connected! Visit the Forum to engage with students or track your leaderboard rank.",
            icon: <FaCheckCircle />,
            target: "nav, .nav-container"
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
            target: ".enrolled-courses-section, #my-courses-grid"
        },
        {
            title: "AI Study Assistant",
            content: "Stuck on a concept? Our Gemini-powered AI assistant is available 24/7 to answer your specific course questions.",
            icon: <FaRobot />,
            target: ".chatbot-toggle"
        },
        {
            title: "Global Leaderboard",
            content: "Compete with students worldwide! Earn XP by completing quizzes and assignments to climb the ranks.",
            icon: <FaCheckCircle />,
            target: "nav a[href='/leaderboard'], .rank-badge"
        }
    ];

    const steps = userData?.role === 'educator' ? educatorSteps : studentSteps;

    useEffect(() => {
        const hasSeenTour = localStorage.getItem(`tour_seen_${userData?.role}_${userData?._id}`);
        if (!hasSeenTour && userData) {
            setTimeout(() => setIsVisible(true), 2000);
        }
    }, [userData]);

    useEffect(() => {
        if (isVisible) {
            updateSpotlight();
            window.addEventListener('resize', updateSpotlight);
            window.addEventListener('scroll', updateSpotlight);
        }
        return () => {
            window.removeEventListener('resize', updateSpotlight);
            window.removeEventListener('scroll', updateSpotlight);
        };
    }, [isVisible, currentStep]);

    const updateSpotlight = () => {
        const targetSelector = steps[currentStep].target;
        if (targetSelector === 'body') {
            setSpotlightRect({ top: 0, left: 0, width: 0, height: 0, opacity: 0 });
            return;
        }

        const selectors = targetSelector.split(', ');
        let element = null;
        for (const sel of selectors) {
            element = document.querySelector(sel);
            if (element) break;
        }

        if (element) {
            const rect = element.getBoundingClientRect();
            setSpotlightRect({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                opacity: 1
            });
            
            // Auto-scroll to element if not in view
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            setSpotlightRect({ top: 0, left: 0, width: 0, height: 0, opacity: 0 });
        }
    };

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

    useEffect(() => {
        window.startAppTour = restartTour;
        return () => delete window.startAppTour;
    }, [userData]);

    if (!isVisible || !userData) return null;

    return (
        <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
            {/* Spotlight Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-auto">
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {spotlightRect && (
                            <motion.rect
                                initial={false}
                                animate={{
                                    x: spotlightRect.left - 8,
                                    y: spotlightRect.top - 8,
                                    width: spotlightRect.width + 16,
                                    height: spotlightRect.height + 16,
                                    rx: 16,
                                    opacity: spotlightRect.opacity
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect 
                    x="0" y="0" width="100%" height="100%" 
                    fill="rgba(0,0,0,0.7)" 
                    mask="url(#spotlight-mask)"
                    className="backdrop-blur-[2px]"
                    onClick={completeTour}
                />
            </svg>

            {/* Tour Card Container */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -20 }}
                        className="relative w-full max-w-sm bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 pointer-events-auto"
                    >
                        {/* Progress */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                className="h-full bg-black"
                            />
                        </div>

                        <div className="p-8 pb-6">
                            <div className="flex justify-between items-start mb-6">
                                <motion.div 
                                    initial={{ rotate: -20, scale: 0.5 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    className="w-16 h-16 bg-black text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-black/10"
                                >
                                    {steps[currentStep].icon}
                                </motion.div>
                                <button 
                                    onClick={completeTour}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-300"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
                                {steps[currentStep].title}
                            </h3>
                            <p className="text-gray-500 font-medium leading-relaxed mb-8 text-sm">
                                {steps[currentStep].content}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex gap-1.5">
                                    {steps.map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                                i === currentStep ? 'w-8 bg-black' : 'w-1.5 bg-gray-200'
                                            }`}
                                        />
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    {currentStep > 0 && (
                                        <button
                                            onClick={handlePrev}
                                            className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
                                        >
                                            <FaChevronLeft />
                                        </button>
                                    )}
                                    <button
                                        onClick={handleNext}
                                        className="px-8 py-3 bg-black text-white rounded-2xl font-black flex items-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-black/5 text-sm"
                                    >
                                        {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                                        <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-100/50 px-8 py-4 flex items-center justify-between border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {userData?.role} Demo
                                </span>
                            </div>
                            <span className="text-[10px] font-black text-gray-400">
                                {currentStep + 1} / {steps.length}
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default OnboardingTour;


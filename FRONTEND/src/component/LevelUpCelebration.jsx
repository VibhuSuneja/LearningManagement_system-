import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { FaLongArrowAltUp, FaTrophy, FaStar } from "react-icons/fa";

const LevelUpCelebration = ({ level, onClose }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        // Trigger Confetti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        // Play Sound
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        }

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
            <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3" />

            <motion.div 
                initial={{ scale: 0.5, y: 100, rotate: -10 }}
                animate={{ scale: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                className="relative bg-white/10 border border-white/20 p-12 rounded-[50px] shadow-[0_0_100px_rgba(255,255,255,0.1)] backdrop-blur-2xl max-w-lg w-full text-center overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Animated Stars */}
                    <div className="flex gap-4 mb-8">
                        {[1, 2, 3].map((s) => (
                            <motion.div
                                key={s}
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{ repeat: Infinity, duration: 2, delay: s * 0.2 }}
                                className="text-yellow-400 text-3xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                            >
                                <FaStar />
                            </motion.div>
                        ))}
                    </div>

                    <h4 className="text-white/50 font-black uppercase tracking-[0.4em] text-[10px] mb-2">Achievement Unlocked</h4>
                    
                    <motion.h1 
                        initial={{ letterSpacing: "0.5em", opacity: 0 }}
                        animate={{ letterSpacing: "0.1em", opacity: 1 }}
                        className="text-6xl font-black text-white italic mb-8 tracking-tighter"
                    >
                        LEVEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">UP</span>
                    </motion.h1>

                    {/* Level Hexagon */}
                    <div className="relative mb-10">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="w-32 h-32 border-4 border-dashed border-white/20 rounded-full flex items-center justify-center"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-gradient-to-br from-yellow-400 to-orange-600 w-24 h-24 rounded-3xl shadow-[0_20px_40px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center transform rotate-12 transition-transform hover:rotate-0">
                                <span className="text-white/70 text-[10px] font-black uppercase tracking-tighter -mb-1">Level</span>
                                <span className="text-white text-5xl font-black leading-none">{level}</span>
                            </div>
                        </div>
                        {/* Upwards Arrows */}
                        <motion.div 
                            animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute -top-10 left-1/2 -translate-x-1/2 text-green-400 text-2xl"
                        >
                            <FaLongArrowAltUp />
                        </motion.div>
                    </div>

                    <p className="text-white/80 font-medium mb-12 text-sm max-w-[280px] leading-relaxed">
                        You've unlocked new specialized AI agents and professional certificates. Keep learning!
                    </p>

                    <button 
                        onClick={onClose}
                        className="group relative w-full bg-white text-black font-black py-5 rounded-[25px] flex items-center justify-center gap-3 overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 uppercase tracking-widest text-xs flex items-center gap-2 group-hover:text-white transition-colors">
                           Claim Rewards <FaTrophy />
                        </span>
                    </button>
                    
                    <p className="mt-6 text-white/30 text-[9px] font-bold uppercase tracking-widest">
                        Press ESC to continue
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LevelUpCelebration;

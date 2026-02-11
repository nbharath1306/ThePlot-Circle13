"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface HeroProps {
    onStart: () => void;
}

const tagline = "Deep psychometric analysis. 7-year relationship forecast. 94% probabilistic accuracy.";

export default function Hero({ onStart }: HeroProps) {
    const [typedText, setTypedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    // Typewriter effect for tagline
    useEffect(() => {
        if (typedText.length < tagline.length) {
            const timer = setTimeout(() => {
                setTypedText(tagline.slice(0, typedText.length + 1));
            }, 30);
            return () => clearTimeout(timer);
        } else {
            // Stop cursor after typing is done
            const timer = setTimeout(() => setShowCursor(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [typedText]);

    return (
        <section className="relative z-10 flex flex-col items-center justify-center min-h-[75vh] text-center px-4">
            {/* Decorative top label */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs tracking-[0.5em] text-[#00ff00]/30 mb-8 font-mono"
            >
                CIRCLE13_LABS :: PREDICTION_ENGINE_V2
            </motion.div>

            {/* Main title */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1
                    className="text-5xl md:text-8xl font-bold tracking-tight mb-4 glitch-text"
                    style={{ textShadow: "0 0 40px rgba(0,255,0,0.3)" }}
                >
                    KNOW BEFORE<br />YOU KNOW
                </h1>
            </motion.div>

            {/* Typing tagline */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="h-12 mb-12"
            >
                <p className="text-sm md:text-base text-[#00ff00]/60 max-w-xl mx-auto font-mono leading-relaxed">
                    {typedText}
                    {showCursor && <span className="inline-block w-2 h-4 bg-[#00ff00] ml-1 align-middle" style={{ animation: "blink-cursor 0.8s step-end infinite" }} />}
                </p>
            </motion.div>

            {/* CTA Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(0,255,0,0.3)",
                    backgroundColor: "rgba(0,255,0,0.05)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                className="px-10 py-5 border border-[#00ff00]/50 text-[#00ff00] bg-transparent text-sm font-bold tracking-[0.3em] uppercase transition-all duration-300 relative overflow-hidden group"
            >
                <span className="relative z-10 flex items-center gap-3">
                    [ START ASSESSMENT ]
                </span>

                {/* Scanline hover effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff00]/10 to-transparent translate-y-[-100%] group-hover:animate-scan-fast pointer-events-none" />
            </motion.button>

            {/* Footer metrics */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-16 grid grid-cols-3 gap-8 md:gap-16 text-[10px] tracking-[0.2em] text-[#00ff00]/20 font-mono"
            >
                <div>
                    <span className="block text-[#00ff00]/40 text-lg mb-1">50+</span>
                    DATA POINTS
                </div>
                <div>
                    <span className="block text-[#00ff00]/40 text-lg mb-1">7YR</span>
                    PROJECTION
                </div>
                <div>
                    <span className="block text-[#00ff00]/40 text-lg mb-1">AI</span>
                    AGENTS
                </div>
            </motion.div>
        </section>
    );
}

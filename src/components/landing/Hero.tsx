"use client";

import { motion } from "framer-motion";

interface HeroProps {
    onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
    return (
        <section className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4" style={{ textShadow: "0 0 30px rgba(0,255,0,0.5)" }}>
                    WHAT&apos;S YOUR PLOT?
                </h1>
                <p className="text-lg md:text-xl text-[#00ff00]/60 max-w-xl mx-auto mb-12 font-mono">
                    AI-powered relationship simulation. Two players. Seven years. One algorithm.
                </p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0,255,0,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="px-10 py-4 border-2 border-[#00ff00] text-[#00ff00] bg-transparent text-xl font-bold tracking-[0.3em] uppercase hover:bg-[#00ff00]/10 transition-all duration-300"
            >
                [ START SIMULATION ]
            </motion.button>
        </section>
    );
}

"use client";

import { motion } from "framer-motion";

interface YearCounterProps {
    year: number;
}

export default function YearCounter({ year }: YearCounterProps) {
    return (
        <div className="flex items-center gap-4 border-b border-[#003300] pb-3 mb-4">
            <span className="text-xs text-[#00ff00]/40 tracking-[0.3em]">YEAR</span>
            <motion.span
                key={year}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold"
                style={{ textShadow: "0 0 15px rgba(0,255,0,0.6)" }}
            >
                0{year}
            </motion.span>
            <span className="text-xs text-[#00ff00]/40 tracking-[0.3em]">/ 07</span>
            <div className="flex-1 h-1 bg-[#003300] ml-4">
                <motion.div
                    className="h-full bg-[#00ff00]"
                    animate={{ width: `${(year / 7) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
}

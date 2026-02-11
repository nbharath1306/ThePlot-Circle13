"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Option } from "@/types";

interface QuestionCardProps {
    questionText: string;
    options: Option[];
    onSelect: (option: Option) => void;
}

export default function QuestionCard({ questionText, options, onSelect }: QuestionCardProps) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (option: Option) => {
        setSelected(option.value);
        setTimeout(() => onSelect(option), 250);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6 w-full"
        >
            {/* Terminal prompt style */}
            <div>
                <div className="text-xs tracking-[0.2em] text-[#00ff00]/40 mb-3 font-mono">
                    &gt; QUERY_ANALYSIS
                </div>
                <h2 className="text-xl md:text-2xl font-bold leading-relaxed tracking-wide text-[#e0e0e0]">
                    {questionText}
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {options.map((option, i) => (
                    <motion.button
                        key={option.value}
                        onClick={() => handleSelect(option)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        whileHover={{
                            scale: 1.01,
                            borderColor: "#00ff00",
                            backgroundColor: "rgba(0, 255, 0, 0.03)",
                            boxShadow: "0 0 10px rgba(0, 255, 0, 0.1)"
                        }}
                        whileTap={{ scale: 0.99 }}
                        className={`group text-left p-4 border rounded-sm transition-all duration-200 relative overflow-hidden ${selected === option.value
                                ? "border-[#00ff00] bg-[#00ff00]/10 shadow-[0_0_15px_rgba(0,255,0,0.2)]"
                                : "border-[#1a1a1a] hover:border-[#00ff00]/50 bg-black/40"
                            }`}
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <span className={`text-xs font-mono w-6 h-6 flex items-center justify-center border rounded-full transition-colors ${selected === option.value
                                    ? "border-[#00ff00] text-[#00ff00] bg-[#00ff00]/10"
                                    : "border-[#333] text-[#666] group-hover:border-[#00ff00]/50 group-hover:text-[#00ff00]"
                                }`}>
                                {String.fromCharCode(65 + i)}
                            </span>
                            <span className={`text-sm md:text-base transition-colors ${selected === option.value ? "text-white" : "text-[#a0a0a0] group-hover:text-white"
                                }`}>
                                {option.label}
                            </span>
                        </div>

                        {/* Scanner effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff00]/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}

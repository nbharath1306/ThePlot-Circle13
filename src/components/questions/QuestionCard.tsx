"use client";

import { motion } from "framer-motion";

interface QuestionCardProps {
    questionText: string;
    options: string[];
    onSelect: (value: string) => void;
}

export default function QuestionCard({ questionText, options, onSelect }: QuestionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-6"
        >
            <h2 className="text-xl md:text-2xl font-bold leading-relaxed tracking-wide">
                {questionText}
            </h2>

            <div className="grid grid-cols-1 gap-3">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onSelect(option)}
                        className="group text-left p-4 border border-[#003300] hover:border-[#00ff00] hover:bg-[#00ff00]/5 transition-all duration-200"
                    >
                        <span className="tracking-widest group-hover:underline decoration-2 underline-offset-4">
                            {">"} {option}
                        </span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

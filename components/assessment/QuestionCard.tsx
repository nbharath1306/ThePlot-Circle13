"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Slider } from "../ui/Slider";
import { Input } from "../ui/Input";

interface Question {
    id: string;
    type: "scale" | "multiple_choice" | "text" | "number";
    text: string;
    subtitle?: string;
    min?: number;
    max?: number;
    placeholder?: string;
    options?: { value: string; label: string }[];
    labels?: Record<string, string>;
}

interface QuestionCardProps {
    question: Question;
    onAnswer: (answer: any) => void;
    onBack?: () => void;
    defaultValue?: any;
    isLastQuestion?: boolean;
}

export default function QuestionCard({
    question,
    onAnswer,
    onBack,
    defaultValue,
    isLastQuestion,
}: QuestionCardProps) {
    const [answer, setAnswer] = useState<any>(null);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (defaultValue !== undefined && defaultValue !== null) {
            if (question.type === "text" || question.type === "number") {
                setInputValue(defaultValue);
                setAnswer(null); // Text input relies on inputValue
            } else {
                setAnswer(defaultValue);
            }
        } else {
            // Default initialization if no previous answer
            if (question.type === "scale") {
                setAnswer(5);
            } else {
                setAnswer(null);
                setInputValue("");
            }
        }
    }, [question, defaultValue]);

    const handleSubmit = () => {
        if (question.type === "text" || question.type === "number") {
            if (inputValue.trim()) onAnswer(inputValue);
        } else if (answer !== null) {
            onAnswer(answer);
        }
    };

    const isNextDisabled = () => {
        if (question.type === "text" || question.type === "number") return !inputValue.trim();
        if (question.type === "multiple_choice") return answer === null;
        return false;
    };

    const getLabelForValue = (val: number) => {
        if (!question.labels) return "";
        return question.labels[val.toString()] || "";
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-2xl mx-auto"
            >
                <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-3xl border border-white/10 shadow-2xl">

                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

                    <div className="relative z-10">
                        {/* Question Header */}
                        <div className="space-y-4 mb-12">
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl md:text-4xl font-bold font-display leading-tight"
                            >
                                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                                    {question.text}
                                </span>
                            </motion.h2>

                            {question.subtitle && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-gray-400 text-lg font-light leading-relaxed border-l-2 border-purple-500/30 pl-4"
                                >
                                    {question.subtitle}
                                </motion.p>
                            )}
                        </div>

                        {/* Interaction Area */}
                        <div className="min-h-[300px] flex flex-col justify-center mb-8">

                            {/* SCALE INPUT */}
                            {question.type === "scale" && (
                                <div className="space-y-12">
                                    <div className="relative h-40 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent rounded-2xl" />

                                        <div className="text-center space-y-2 relative z-10 scale-125">
                                            <motion.div
                                                key={answer}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-7xl font-bold font-display tracking-tighter text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                            >
                                                {answer || 5}
                                            </motion.div>
                                            <motion.p
                                                key={`label-${answer}`}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-purple-300 font-mono text-sm uppercase tracking-widest"
                                            >
                                                {getLabelForValue(answer || 5)}
                                            </motion.p>
                                        </div>
                                    </div>

                                    <div className="px-4">
                                        <div className="flex justify-between text-xs font-mono text-gray-500 mb-4 uppercase tracking-wider">
                                            <span>{question.labels?.["1"] || "Low intensity"}</span>
                                            <span>{question.labels?.["10"] || "High intensity"}</span>
                                        </div>
                                        <Slider
                                            defaultValue={[5]}
                                            min={1}
                                            max={10}
                                            step={1}
                                            value={[answer || 5]}
                                            onValueChange={(val) => setAnswer(val[0])}
                                            className="py-4"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* MULTIPLE CHOICE */}
                            {question.type === "multiple_choice" && (
                                <div className="grid gap-4">
                                    {question.options?.map((option, idx) => (
                                        <motion.button
                                            key={option.value}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            onClick={() => setAnswer(option.value)}
                                            className={`
                                                group relative w-full p-6 text-left rounded-xl border transition-all duration-300 overflow-hidden
                                                ${answer === option.value
                                                    ? "border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                                                    : "border-white/5 hover:border-white/20 hover:bg-white/5 bg-black/20"
                                                }
                                            `}
                                        >
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${answer === option.value ? "bg-purple-500" : "bg-transparent group-hover:bg-purple-500/30"}`} />

                                            <div className="flex items-center justify-between relative z-10">
                                                <span className={`text-lg transition-colors ${answer === option.value ? "text-white font-medium" : "text-gray-300 group-hover:text-white"}`}>
                                                    {option.label}
                                                </span>
                                                {answer === option.value && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="text-purple-400"
                                                    >
                                                        ●
                                                    </motion.span>
                                                )}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            )}

                            {/* TEXT / NUMBER INPUT */}
                            {(question.type === "text" || question.type === "number") && (
                                <div className="relative group">
                                    <Input
                                        type={question.type === "number" ? "number" : "text"}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={question.placeholder}
                                        className="h-20 text-2xl bg-black/30 border-white/10 focus:border-purple-500/50 transition-all rounded-2xl px-8 font-display placeholder:text-gray-700"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !isNextDisabled()) {
                                                handleSubmit();
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-2xl" />
                                </div>
                            )}
                        </div>

                        {/* Navigation Footer */}
                        <div className="flex items-center justify-between pt-8 border-t border-white/5">
                            <Button
                                variant="ghost"
                                onClick={onBack}
                                disabled={!onBack}
                                className={`text-gray-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-mono group flex items-center gap-2 ${!onBack ? "invisible" : ""}`}
                            >
                                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
                            </Button>

                            <Button
                                onClick={handleSubmit}
                                disabled={isNextDisabled()}
                                className={`
                                    px-10 py-6 rounded-full font-bold text-lg tracking-wide shadow-lg transition-all duration-300
                                    ${isNextDisabled()
                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                        : "bg-white text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                    }
                                `}
                            >
                                {isLastQuestion ? "Finalize" : "Next"} <span className="ml-2">→</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

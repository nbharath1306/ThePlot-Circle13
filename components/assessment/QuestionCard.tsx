"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Slider } from "../ui/Slider";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";

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
    isLastQuestion?: boolean;
}

export default function QuestionCard({
    question,
    onAnswer,
    onBack,
    isLastQuestion,
}: QuestionCardProps) {
    const [answer, setAnswer] = useState<any>(null); // Initialize as null to force user interaction
    const [inputValue, setInputValue] = useState(""); // Separate state for text input

    // Reset state when question changes
    useEffect(() => {
        if (question.type === "scale") {
            setAnswer(5); // Default for slider
        } else {
            setAnswer(null);
            setInputValue("");
        }
    }, [question]);

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
        return false; // Scale always has a value
    };


    // Helper to get label for current value
    const getLabelForValue = (val: number) => {
        if (!question.labels) return "";
        // Try to find exact match or closest label
        return question.labels[val.toString()] || "";
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl mx-auto"
            >
                <div className="bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    {/* Progress indicator */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }} // This would need actual progress prop
                        />
                    </div>

                    <h2 className="text-3xl font-bold mb-4 font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {question.text}
                    </h2>

                    {question.subtitle && (
                        <p className="text-gray-400 mb-8 font-sans text-lg">{question.subtitle}</p>
                    )}

                    <div className="min-h-[200px] flex flex-col justify-center mb-8">
                        {question.type === "scale" && (
                            <div className="space-y-8 py-4">
                                {/* Visual Scale Labels */}
                                <div className="flex justify-between items-end text-sm font-medium tracking-wider">
                                    <div className="text-left max-w-[30%] text-purple-400">
                                        <span className="text-2xl block mb-2">1</span>
                                        {question.labels?.["1"] || "Low"}
                                    </div>
                                    <div className="text-right max-w-[30%] text-pink-400">
                                        <span className="text-2xl block mb-2">10</span>
                                        {question.labels?.["10"] || "High"}
                                    </div>
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

                                {/* Current Value Display */}
                                <div className="text-center space-y-2">
                                    <div className="text-5xl font-bold text-white font-display">
                                        {answer || 5}
                                    </div>
                                    <p className="text-gray-400 text-sm h-6">
                                        {getLabelForValue(answer || 5)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {question.type === "multiple_choice" && (
                            <div className="grid gap-3">
                                {question.options?.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setAnswer(option.value)}
                                        className={`w-full p-5 rounded-xl border text-left transition-all duration-200 group relative overflow-hidden ${answer === option.value
                                            ? "border-purple-500 bg-purple-500/20 text-white"
                                            : "border-white/10 hover:border-purple-500/50 hover:bg-white/5 text-gray-300"
                                            }`}
                                    >
                                        <div className={`absolute left-0 top-0 h-full w-1 transition-all ${answer === option.value ? "bg-purple-500" : "bg-transparent group-hover:bg-purple-500/50"
                                            }`} />
                                        <span className="text-lg relative z-10">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {(question.type === "text" || question.type === "number") && (
                            <div className="relative group">
                                <Input
                                    type={question.type === "number" ? "number" : "text"}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={question.placeholder}
                                    className="h-16 text-xl bg-black/50 border-white/20 focus:border-purple-500 transition-all rounded-xl px-6"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !isNextDisabled()) {
                                            handleSubmit();
                                        }
                                    }}
                                />
                                <div className="absolute inset-0 rounded-xl bg-purple-500/10 blur-xl -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between gap-4 pt-4 border-t border-white/5">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            disabled={!onBack}
                            className={`text-gray-500 hover:text-white ${!onBack ? "invisible" : ""}`}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isNextDisabled()}
                            className="px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full font-bold shadow-lg shadow-purple-500/20"
                        >
                            {isLastQuestion ? "Finish" : "Next →"}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

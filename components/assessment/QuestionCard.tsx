"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Slider } from "../ui/Slider";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";

interface Question {
    id: string;
    type: "scale" | "multiple_choice" | "text";
    text: string;
    subtitle?: string;
    min?: number;
    max?: number;
    placeholder?: string;
    options?: { value: string; label: string }[];
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
        if (question.type === "text") {
            if (inputValue.trim()) onAnswer(inputValue);
        } else if (answer !== null) {
            onAnswer(answer);
        }
    };

    const isNextDisabled = () => {
        if (question.type === "text") return !inputValue.trim();
        if (question.type === "multiple_choice") return answer === null;
        return false; // Scale always has a value
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
                <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-2 font-display">{question.text}</h2>
                    {question.subtitle && (
                        <p className="text-gray-400 mb-8 font-sans">{question.subtitle}</p>
                    )}

                    <div className="min-h-[200px] flex flex-col justify-center mb-8">
                        {question.type === "scale" && (
                            <div className="space-y-6">
                                <div className="flex justify-between text-sm text-gray-400 font-mono">
                                    <span>{question.min || 1}</span>
                                    <span>{question.max || 10}</span>
                                </div>
                                <Slider
                                    defaultValue={[5]}
                                    max={question.max || 10}
                                    step={1}
                                    value={[answer]}
                                    onValueChange={(val) => setAnswer(val[0])}
                                    className="py-4"
                                />
                                <div className="text-center text-3xl font-bold text-primary font-mono">
                                    {answer}
                                </div>
                            </div>
                        )}

                        {question.type === "multiple_choice" && (
                            <div className="grid gap-3">
                                {question.options?.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setAnswer(option.value)}
                                        className={`w-full p-4 rounded-lg border text-left transition-all ${answer === option.value
                                                ? "border-primary bg-primary/20 text-primary"
                                                : "border-white/10 hover:border-white/20 hover:bg-white/5"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {question.type === "text" && (
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={question.placeholder}
                                className="h-14 text-lg"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isNextDisabled()) {
                                        handleSubmit();
                                    }
                                }}
                            />
                        )}
                    </div>

                    <div className="flex justify-between gap-4">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            disabled={!onBack}
                            className={!onBack ? "invisible" : ""}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isNextDisabled()}
                            className="px-8"
                        >
                            {isLastQuestion ? "Finish" : "Next"}
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QuestionCard from "./QuestionCard";
import { Answer, Question, Option, DIMENSION_LABELS } from "@/types";
import { getQuestions } from "@/lib/assessment";
import { useSoundEngine } from "@/components/shared/SoundManager";

interface QuestionFlowProps {
    onComplete: (answers: Answer[]) => void;
}

export default function QuestionFlow({ onComplete }: QuestionFlowProps) {
    const questions: Question[] = getQuestions();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const { click } = useSoundEngine();

    const currentQuestion = questions[currentIndex];
    const currentDimensionLabel = DIMENSION_LABELS[currentQuestion.dimension];

    const handleSelect = (option: Option) => {
        click();

        const answer: Answer = {
            questionId: currentQuestion.id,
            dimension: currentQuestion.dimension,
            score: option.score,
            value: option.value,
            timestamp: Date.now(),
        };

        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setTimeout(() => setCurrentIndex((prev) => prev + 1), 300);
        } else {
            setTimeout(() => onComplete(newAnswers), 500);
        }
    };

    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 w-full text-white">
            <div className="w-full max-w-2xl">
                {/* Header & Progress */}
                <div className="mb-10 space-y-4">
                    <div className="flex justify-between items-end border-b border-[#333] pb-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[#666] font-mono tracking-widest mb-1">
                                MODULE {currentQuestion.dimension.toUpperCase().substring(0, 3)}
                            </span>
                            <span className="text-sm text-[#00ff00] font-bold tracking-widest uppercase">
                                {currentDimensionLabel}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-mono text-[#666]">
                                Q.{currentIndex + 1} <span className="text-[#333]">/</span> {questions.length}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-[2px] bg-[#111] overflow-hidden relative">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-[#00ff00] shadow-[0_0_10px_#00ff00]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                        />
                    </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <QuestionCard
                        key={currentQuestion.id}
                        questionText={currentQuestion.text}
                        options={currentQuestion.options}
                        onSelect={handleSelect}
                    />
                </AnimatePresence>

                {/* Footer Status */}
                <div className="mt-12 text-center">
                    <p className="text-[10px] text-[#444] font-mono tracking-widest uppercase">
                        {answers.length > 0 ? "Analyzing Neural Patterns..." : "Initializing Assessment..."}
                    </p>
                </div>
            </div>
        </div>
    );
}

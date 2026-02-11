"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QuestionCard from "./QuestionCard";
import { Answer, Question } from "@/types";
import { getQuestions } from "@/lib/questions";

interface QuestionFlowProps {
    onComplete: (answers: Answer[]) => void;
}

export default function QuestionFlow({ onComplete }: QuestionFlowProps) {
    const questions: Question[] = getQuestions();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);

    const handleSelect = (value: string) => {
        const question = questions[currentIndex];
        const answer: Answer = {
            questionId: question.id,
            value,
            timestamp: Date.now(),
        };

        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setTimeout(() => setCurrentIndex((prev) => prev + 1), 300);
        } else {
            setTimeout(() => onComplete(newAnswers), 400);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-2xl">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs text-[#00ff00]/40 mb-2">
                        <span>ANALYSIS {currentIndex + 1}/{questions.length}</span>
                        <span>DATA_PACKET: {answers.length}/{questions.length}</span>
                    </div>
                    <div className="w-full h-1 bg-[#003300]">
                        <motion.div
                            className="h-full bg-[#00ff00]"
                            animate={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <QuestionCard
                        key={currentIndex}
                        questionText={questions[currentIndex].text}
                        options={questions[currentIndex].options}
                        onSelect={handleSelect}
                    />
                </AnimatePresence>
            </div>
        </div>
    );
}

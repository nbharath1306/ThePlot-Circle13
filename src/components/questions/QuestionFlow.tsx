"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QuestionCard from "./QuestionCard";
import { Answer, Question, Option, AssessmentDimension } from "@/types";
import { LIFETIME_QUESTIONS, DIMENSION_LABELS } from "@/lib/lifetime_assessment";
import { useSoundEngine } from "@/components/shared/SoundManager";

interface QuestionFlowProps {
    onComplete: (answers: Answer[]) => void;
}

export default function QuestionFlow({ onComplete }: QuestionFlowProps) {
    const questions = LIFETIME_QUESTIONS;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [showSectionIntro, setShowSectionIntro] = useState(true); // Start with intro
    const { click, whoosh } = useSoundEngine();

    const currentQuestion = questions[currentIndex];

    // Detect if we just entered a new dimension
    const previousQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null;
    const isNewSection = previousQuestion && previousQuestion.dimension !== currentQuestion.dimension;

    // Effect to handle section transitions
    useEffect(() => {
        if (isNewSection) {
            setShowSectionIntro(true);
            whoosh();
            const timer = setTimeout(() => setShowSectionIntro(false), 2000); // Show title card for 2s
            return () => clearTimeout(timer);
        }
    }, [isNewSection, currentQuestion.dimension, whoosh]);

    // Initial load
    useEffect(() => {
        const timer = setTimeout(() => setShowSectionIntro(false), 2000);
        return () => clearTimeout(timer);
    }, []);

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
            setTimeout(() => setCurrentIndex((prev) => prev + 1), 250);
        } else {
            setTimeout(() => onComplete(newAnswers), 500);
        }
    };

    const progress = ((currentIndex + 1) / questions.length) * 100;
    const currentLabel = DIMENSION_LABELS[currentQuestion.dimension];

    if (showSectionIntro) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
                <h2 className="text-xs font-mono text-emerald-500 mb-4 tracking-[0.2em] uppercase">
                    Next Module
                </h2>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                    {currentLabel}
                </h1>
                {currentQuestion.isSensitive && (
                    <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded text-red-200 text-xs font-mono">
                        ⚠ SENSITIVE CONTENT WARNING
                    </div>
                )}
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 w-full text-white">
            <div className="w-full max-w-2xl">
                {/* Header & Progress */}
                <div className="mb-10 space-y-4">
                    <div className="flex justify-between items-end border-b border-white/10 pb-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-white/40 font-mono tracking-widest mb-1">
                                ASSESSMENT PROTOCOL
                            </span>
                            <span className="text-sm text-emerald-400 font-bold tracking-widest uppercase">
                                {currentLabel}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-mono text-white/40">
                                {currentIndex + 1} <span className="text-white/20">/</span> {questions.length}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-[2px] bg-white/5 overflow-hidden relative">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
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
                    {currentQuestion.isSensitive && (
                        <p className="text-[10px] text-red-400/50 font-mono tracking-widest uppercase">
                            * Private & Encrypted
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

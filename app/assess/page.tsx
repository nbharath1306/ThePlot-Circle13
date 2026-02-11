"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/assessment/ProgressBar";
import QuestionCard from "@/components/assessment/QuestionCard";
import questionsData from "@/data/questions.json";

export default function AssessmentPage() {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isClient, setIsClient] = useState(false);

    // Flatten questions from domains for linear flow
    const allQuestions = questionsData.domains.flatMap((domain) =>
        domain.questions.map((q) => ({ ...q, domain: domain.id }))
    );

    useEffect(() => {
        setIsClient(true);
        // Load progress from local storage if available
        const savedAnswers = localStorage.getItem("theplot_assessment_answers");
        if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
        }
    }, []);

    const handleAnswer = (answer: any) => {
        const questionId = allQuestions[currentQuestionIndex].id;
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);
        localStorage.setItem("theplot_assessment_answers", JSON.stringify(newAnswers));

        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            // Calculate and save personality vector (simplified for MVP)
            // In a real app, this would call an API
            console.log("Assessment completed", newAnswers);
            router.push("/simulate"); // Proceed to simulation
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    if (!isClient) return null; // Avoid hydration mismatch

    const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;
    const currentQuestion = allQuestions[currentQuestionIndex];

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2 font-mono">
                    <span>Question {currentQuestionIndex + 1} of {allQuestions.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <ProgressBar progress={progress} />
            </div>

            <QuestionCard
                question={currentQuestion as any}
                onAnswer={handleAnswer}
                onBack={currentQuestionIndex > 0 ? handleBack : undefined}
                isLastQuestion={currentQuestionIndex === allQuestions.length - 1}
            />
        </main>
    );
}

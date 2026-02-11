"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import QuestionCard from "@/components/assessment/QuestionCard";
import detectiveQuestions from "@/data/detective-questions.json";

export default function DetectivePage() {
    const router = useRouter();
    const [mode, setMode] = useState<"landing" | "investigating">("landing");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const allQuestions = detectiveQuestions.sections.flatMap((section: any) => section.questions);

    const handleAnswer = (answer: any) => {
        const questionId = allQuestions[currentQuestionIndex].id;
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);

        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            completeInvestigation(newAnswers);
        }
    };

    const completeInvestigation = (finalAnswers: Record<string, any>) => {
        localStorage.setItem("detective_answers", JSON.stringify(finalAnswers));
        router.push("/detective/verdict");
    };

    if (mode === "landing") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-2xl text-center space-y-8">
                    <div className="text-8xl mb-6">🕵️</div>

                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        The Detective
                    </h1>

                    <p className="text-xl text-gray-300">
                        Predict where your relationship is headed.
                        <br />
                        Get the intel before you catch feelings.
                    </p>

                    <div className="bg-gray-900/50 border border-blue-500/30 rounded-2xl p-8 text-left space-y-4">
                        <h3 className="text-2xl font-semibold text-blue-400">What we'll investigate:</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">🔍</span>
                                <span>Communication patterns and effort balance</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">🚩</span>
                                <span>Red flags and warning signs</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">💚</span>
                                <span>Green flags and positive indicators</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">🔮</span>
                                <span>Prediction of where this is headed</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-sm text-yellow-200">
                            ⚠️ <strong>Honest answers only.</strong> This is for you, not them. The truth might hurt, but it's better to know now.
                        </p>
                    </div>

                    <Button
                        onClick={() => setMode("investigating")}
                        className="w-full max-w-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-6 text-lg"
                    >
                        Start Investigation →
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white p-4">
            <div className="max-w-4xl mx-auto py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            The Investigation
                        </h1>
                        <span className="text-sm text-gray-400">
                            {currentQuestionIndex + 1}/{allQuestions.length}
                        </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                <QuestionCard
                    question={allQuestions[currentQuestionIndex]}
                    onAnswer={handleAnswer}
                    onBack={
                        currentQuestionIndex > 0
                            ? () => setCurrentQuestionIndex((prev) => prev - 1)
                            : undefined
                    }
                    isLastQuestion={currentQuestionIndex === allQuestions.length - 1}
                />
            </div>
        </main>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import QuestionCard from "@/components/assessment/QuestionCard";
import matchmakerQuestions from "@/data/matchmaker-questions.json";

export default function MatchmakerPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"landing" | "building">("landing");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const allQuestions = matchmakerQuestions.sections.flatMap((section: any) => section.questions);

    const handleAnswer = (answer: any) => {
        const questionId = allQuestions[currentQuestionIndex].id;
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);

        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            completeDreamPartner(newAnswers);
        }
    };

    const completeDreamPartner = (finalAnswers: Record<string, any>) => {
        // Store the dream partner profile
        localStorage.setItem("matchmaker_dream_partner", JSON.stringify(finalAnswers));

        // Navigate to virtual date
        router.push("/matchmaker/date");
    };

    if (mode === "landing") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-2xl text-center space-y-8">
                    <div className="text-8xl mb-6">💘</div>

                    <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                        The Matchmaker
                    </h1>

                    <p className="text-xl text-gray-300">
                        Create your dream partner and go on a virtual date.
                        <br />
                        Test compatibility before the real thing.
                    </p>

                    <div className="bg-gray-900/50 border border-pink-500/30 rounded-2xl p-8 text-left space-y-4">
                        <h3 className="text-2xl font-semibold text-pink-400">How it works:</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">1️⃣</span>
                                <span>Answer questions about your ideal partner</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">2️⃣</span>
                                <span>AI creates a virtual version of your dream match</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">3️⃣</span>
                                <span>Go on a simulated date and have real conversations</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">4️⃣</span>
                                <span>Get a compatibility report and insights</span>
                            </li>
                        </ul>
                    </div>

                    <Button
                        onClick={() => setMode("building")}
                        className="w-full max-w-md bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 py-6 text-lg"
                    >
                        Build My Dream Partner →
                    </Button>
                </div>
            </main>
        );
    }

    // Building dream partner
    return (
        <main className="min-h-screen bg-black text-white p-4">
            <div className="max-w-4xl mx-auto py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                            Build Your Dream Partner
                        </h1>
                        <span className="text-sm text-gray-400">
                            {currentQuestionIndex + 1}/{allQuestions.length}
                        </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-pink-600 to-red-600 h-2 rounded-full transition-all duration-300"
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

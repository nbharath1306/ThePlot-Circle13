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
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
                {/* Aurora Background - Love Theme */}
                <div className="absolute inset-0 bg-black pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-600/20 blur-[100px] rounded-full animate-blob mix-blend-screen" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-red-600/20 blur-[100px] rounded-full animate-blob animation-delay-2000 mix-blend-screen" />
                    <div className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] bg-purple-600/20 blur-[100px] rounded-full animate-blob animation-delay-4000 mix-blend-screen" />
                </div>

                <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay" />

                <div className="max-w-3xl w-full relative z-10 text-center">
                    <div className="glass-card rounded-3xl p-12 border-t border-white/10 shadow-2xl">

                        <div className="text-8xl mb-8 filter drop-shadow-[0_0_30px_rgba(236,72,153,0.5)] animate-bounce">💘</div>

                        <h1 className="text-6xl font-bold font-display tracking-tighter mb-4">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-600">Matchmaker</span>
                        </h1>

                        <p className="text-xl text-gray-300 font-light mb-12 max-w-2xl mx-auto">
                            Design your perfect partner. <span className="text-white font-medium">Test compatibility in a simulation.</span>
                            <br />
                            Avoid the heartbreak before it happens.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 text-left mb-12">
                            {[
                                { icon: "1️⃣", text: "Design your ideal partner's personality" },
                                { icon: "2️⃣", text: "AI generates their digital twin" },
                                { icon: "3️⃣", text: "Go on a realistic virtual date" },
                                { icon: "4️⃣", text: "Get a brutal compatibility score" }
                            ].map((item, i) => (
                                <div key={i} className="glass p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                                    <span className="text-3xl filter drop-shadow-lg">{item.icon}</span>
                                    <span className="text-sm font-medium text-gray-200">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={() => setMode("building")}
                            className="w-full max-w-md bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 py-8 text-xl font-bold rounded-full shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] transition-all transform hover:-translate-y-1"
                        >
                            Build My Dream Partner →
                        </Button>
                    </div>
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

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionCard from "@/components/assessment/QuestionCard";
import { generatePersonaFromAnswers } from "@/lib/prompts";
import questionsData from "@/data/questions.json";
import { Button } from "@/components/ui/Button";

export default function OracleAssessmentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session");

    const [mode, setMode] = useState<"solo" | "create" | "join">("solo");
    const [shareLink, setShareLink] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [partnerReady, setPartnerReady] = useState(false);
    const [myRole, setMyRole] = useState<"A" | "B">("A");

    // Extract all questions from domains
    const allQuestions = questionsData.domains.flatMap((domain: any) => domain.questions).slice(0, 11);

    useEffect(() => {
        // Check if joining via link
        if (sessionId) {
            setMode("join");
            setMyRole("B");
            // In a real app, this would connect to a backend
            // For now, we'll use localStorage with session ID
        }
    }, [sessionId]);

    const createSession = () => {
        const newSessionId = Math.random().toString(36).substring(7);
        const link = `${window.location.origin}/oracle/assess?session=${newSessionId}`;
        setShareLink(link);
        setMode("create");
        setMyRole("A");

        // Store session in localStorage
        localStorage.setItem(`session_${newSessionId}`, JSON.stringify({
            creatorReady: false,
            joinerReady: false,
            creatorAnswers: {},
            joinerAnswers: {}
        }));
    };

    const copyLink = () => {
        navigator.clipboard.writeText(shareLink);
        alert("Link copied! Send it to your partner.");
    };

    const handleAnswer = (answer: any) => {
        const questionId = allQuestions[currentQuestionIndex].id;
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);

        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            completeAssessment(newAnswers);
        }
    };

    const completeAssessment = (finalAnswers: Record<string, any>) => {
        const persona = generatePersonaFromAnswers(finalAnswers);
        if (finalAnswers["name"]) persona.name = finalAnswers["name"];

        if (mode === "solo" || mode === "create") {
            // Solo mode or creating session: create both agents yourself
            localStorage.setItem("theplot_agent_a", JSON.stringify(persona));
            // For solo, we'll create a generic partner
            const genericPartner = {
                name: "Partner",
                traits: ["thoughtful", "caring", "independent"],
                values: ["honesty", "growth", "adventure"],
                conflictStyle: "collaborative",
                loveLanguage: "quality time",
                style: "balanced and considerate"
            };
            localStorage.setItem("theplot_agent_b", JSON.stringify(genericPartner));
            router.push("/oracle/timeline");
        } else {
            // Multi-user mode
            const key = myRole === "A" ? "theplot_agent_a" : "theplot_agent_b";
            localStorage.setItem(key, JSON.stringify(persona));

            // Check if partner is ready
            checkPartnerStatus();
        }
    };

    const checkPartnerStatus = () => {
        // In a real app, this would check a backend
        // For now, show waiting screen
        setPartnerReady(false);
        // Simulate partner joining after 3 seconds (for demo)
        setTimeout(() => {
            setPartnerReady(true);
        }, 3000);
    };

    const startSimulation = () => {
        router.push("/oracle/timeline");
    };

    // Landing screen
    if (mode === "solo") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md text-center space-y-6">
                    <div className="text-6xl mb-4">🔮</div>
                    <h1 className="text-3xl font-bold">How do you want to play?</h1>

                    <div className="space-y-4">
                        <Button
                            onClick={createSession}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-6"
                        >
                            Play with Partner (Online)
                        </Button>

                        <Button
                            onClick={() => {
                                setMode("create");
                                setMyRole("A");
                            }}
                            variant="ghost"
                            className="w-full py-6"
                        >
                            Play Solo (Answer for both)
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    // Share link screen
    if (mode === "create" && shareLink && currentQuestionIndex === 0) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md text-center space-y-6">
                    <div className="text-6xl mb-4">📱</div>
                    <h1 className="text-3xl font-bold">Send this link to your partner</h1>

                    <div className="bg-gray-900 p-4 rounded-lg border border-purple-500/30">
                        <code className="text-sm text-purple-400 break-all">{shareLink}</code>
                    </div>

                    <Button
                        onClick={copyLink}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                        Copy Link
                    </Button>

                    <Button
                        onClick={() => setCurrentQuestionIndex(0)}
                        variant="ghost"
                        className="w-full"
                    >
                        Start My Assessment →
                    </Button>
                </div>
            </main>
        );
    }

    // Waiting for partner screen
    if (currentQuestionIndex >= allQuestions.length && !partnerReady) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md text-center space-y-6">
                    <div className="text-6xl mb-4 animate-pulse">⏳</div>
                    <h1 className="text-3xl font-bold">Waiting for your partner...</h1>
                    <p className="text-gray-400">They're still answering questions.</p>
                </div>
            </main>
        );
    }

    // Both ready screen
    if (currentQuestionIndex >= allQuestions.length && partnerReady) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md text-center space-y-6">
                    <div className="text-6xl mb-4">✨</div>
                    <h1 className="text-3xl font-bold">Both ready!</h1>
                    <p className="text-gray-400">Time to see your future together.</p>

                    <Button
                        onClick={startSimulation}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-6"
                    >
                        Start Simulation →
                    </Button>
                </div>
            </main>
        );
    }

    // Assessment screen
    return (
        <main className="min-h-screen bg-black text-white p-4">
            <div className="max-w-4xl mx-auto py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            The Oracle Assessment
                        </h1>
                        <span className="text-sm text-gray-400">
                            {currentQuestionIndex + 1}/{allQuestions.length}
                        </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
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

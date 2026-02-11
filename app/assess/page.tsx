"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/assessment/ProgressBar";
import QuestionCard from "@/components/assessment/QuestionCard";
import questionsData from "@/data/questions.json";
import { Button } from "@/components/ui/Button";
import { generatePersonaFromAnswers } from "@/lib/prompts";

export default function AssessmentPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<"A" | "B">("A");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [answersA, setAnswersA] = useState<Record<string, any>>({});
    const [answersB, setAnswersB] = useState<Record<string, any>>({});

    const [phase, setPhase] = useState<"intro" | "assess_A" | "intermission" | "assess_B" | "complete">("intro");

    const [isClient, setIsClient] = useState(false);

    // Flatten questions
    const allQuestions = questionsData.domains.flatMap((domain) =>
        domain.questions.map((q) => ({ ...q, domain: domain.id }))
    );

    useEffect(() => {
        setIsClient(true);
        // Clear old single-player data on mount for a fresh start
        localStorage.removeItem("theplot_assessment_answers");
    }, []);

    const handleAnswer = (answer: any) => {
        const questionId = allQuestions[currentQuestionIndex].id;

        if (currentUser === "A") {
            setAnswersA(prev => ({ ...prev, [questionId]: answer }));
        } else {
            setAnswersB(prev => ({ ...prev, [questionId]: answer }));
        }

        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            // User finished all questions
            if (currentUser === "A") {
                setPhase("intermission");
            } else {
                finishAssessment();
            }
        }
    };

    const startPartnerB = () => {
        setCurrentUser("B");
        setCurrentQuestionIndex(0);
        setPhase("assess_B");
    };

    const finishAssessment = () => {
        // Generate Personas
        // Retrieve "name" from answers if it exists, otherwise default
        const nameA = answersA["name"] || "Partner A";
        const nameB = (currentUser === "B" ? answersB["name"] : answersB["name"]) || "Partner B"; // Fix access to latest answersB state if needed, but here answersB is state

        // Note: State updates are async, so we should allow render cycle or use the local update.
        // Ideally we pass the final answer set to this function.
        // For MVP, we'll assume the last render holds it or simple enough.
        // Actually, let's grab the final answers explicitly for safety in the call:

        // Correction: In handleAnswer, we call finishAssessment. setAnswersB won't be reflected yet if we rely on state immediately.
        // Refactor handleAnswer to pass the final object.
    };

    // Improved handleAnswer to handle completion correctly with latest data
    const handleAnswerSafe = (answer: any) => {
        const questionId = allQuestions[currentQuestionIndex].id;
        let newAnswers = {};

        if (currentUser === "A") {
            newAnswers = { ...answersA, [questionId]: answer };
            setAnswersA(newAnswers);
        } else {
            newAnswers = { ...answersB, [questionId]: answer };
            setAnswersB(newAnswers);
        }

        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            if (currentUser === "A") {
                setPhase("intermission");
            } else {
                completeAll(newAnswers);
            }
        }
    };

    const completeAll = (finalAnswersB: Record<string, any>) => {
        const personaA = generatePersonaFromAnswers(answersA);
        const personaB = generatePersonaFromAnswers(finalAnswersB);

        // Override names if provided in text fields
        if (answersA["name"]) personaA.name = answersA["name"];
        if (finalAnswersB["name"]) personaB.name = finalAnswersB["name"];

        // Save to LocalStorage
        localStorage.setItem("theplot_agent_a", JSON.stringify(personaA));
        localStorage.setItem("theplot_agent_b", JSON.stringify(personaB));

        router.push("/simulate");
    };


    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    if (!isClient) return null;

    // -- RENDER PHASES --

    if (phase === "intro") {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
                    Couples Assessment
                </h1>
                <p className="text-gray-400 max-w-md mb-8">
                    This is a shared session.
                    <br /><br />
                    <strong className="text-white">Player 1</strong> will go first.
                    Then you will pass the device to <strong className="text-white">Player 2</strong>.
                </p>
                <Button onClick={() => setPhase("assess_A")} className="w-40">
                    Start Player 1
                </Button>
            </main>
        );
    }

    if (phase === "intermission") {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">
                    Player 1 Finished!
                </h1>
                <div className="text-6xl mb-6">🔄</div>
                <p className="text-gray-400 max-w-md mb-8">
                    Please pass the device to <strong className="text-purple-400">Player 2</strong> now.
                    Don't peek! 🫣
                </p>
                <Button onClick={startPartnerB} className="w-40" variant="secondary">
                    I am Player 2
                </Button>
            </main>
        );
    }

    // Assessment View (Shared for A and B)
    const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;
    const currentQuestion = allQuestions[currentQuestionIndex];
    const userLabel = currentUser === "A" ? "Player 1" : "Player 2";
    const userColor = currentUser === "A" ? "text-pink-400" : "text-purple-400";

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between items-end mb-2 font-mono">
                    <span className={`text-xl font-bold ${userColor}`}>{userLabel}</span>
                    <span className="text-sm text-gray-500">Q{currentQuestionIndex + 1}/{allQuestions.length}</span>
                </div>
                <ProgressBar progress={progress} />
            </div>

            <QuestionCard
                question={currentQuestion as any}
                onAnswer={handleAnswerSafe}
                onBack={currentQuestionIndex > 0 ? handleBack : undefined}
                isLastQuestion={currentQuestionIndex === allQuestions.length - 1}
            />
        </main>
    );
}

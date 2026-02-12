"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionCard from "@/components/assessment/QuestionCard";
import { generatePersonaFromAnswers } from "@/lib/prompts";
import questionsData from "@/data/questions.json";
import { Button } from "@/components/ui/Button";
import QRCode from "qrcode";

function OracleAssessmentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlSessionId = searchParams.get("session");

    const [sessionId, setSessionId] = useState<string | null>(urlSessionId);
    const [mode, setMode] = useState<"landing" | "solo" | "join" | "waiting" | "ready" | "assessment">("landing");
    const [shareLink, setShareLink] = useState("");
    const [qrCode, setQrCode] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [myRole, setMyRole] = useState<"A" | "B">("A");
    const [myStatus, setMyStatus] = useState<"answering" | "done">("answering");
    const [copied, setCopied] = useState(false);

    const allQuestions = questionsData.domains.flatMap((domain: any) => domain.questions);

    // Initial check for session
    useEffect(() => {
        if (urlSessionId) {
            setSessionId(urlSessionId);
            setMyRole("B");
            setMode("join");

            // Check if A is already done (optional optimization)
            checkSessionStatus(urlSessionId);
        }
    }, [urlSessionId]);

    // Polling when waiting
    // State for partner tracking
    const [partnerProgress, setPartnerProgress] = useState(0);
    const [partnerActive, setPartnerActive] = useState(false);
    const [lastPartnerUpdate, setLastPartnerUpdate] = useState(0);

    // Define checkSessionStatus FIRST so it can be used
    const checkSessionStatus = async (id: string) => {
        try {
            const res = await fetch(`/api/session?id=${id}`);
            if (res.ok) {
                const session = await res.json();

                // If I am waiting, check if both are done
                if (session.status_A === 'done' && session.status_B === 'done') {
                    // Sync partner agent data
                    const partnerRole = myRole === 'A' ? 'B' : 'A';
                    const partnerAgent = session[`agent_${partnerRole}`];
                    const myAgent = session[`agent_${myRole}`];

                    if (partnerAgent) {
                        localStorage.setItem(`theplot_agent_${partnerRole.toLowerCase()}`, JSON.stringify(partnerAgent));
                    }
                    if (myAgent) {
                        localStorage.setItem(`theplot_agent_${myRole.toLowerCase()}`, JSON.stringify(myAgent));
                    }

                    if (mode === 'waiting') setMode("ready");
                }

                // Update Partner Progress
                const partnerRole = myRole === 'A' ? 'B' : 'A';
                const pProgress = session[`progress_${partnerRole}`] || 0;
                setPartnerProgress(pProgress);

                const lastActive = session[`last_active_${partnerRole}`] || 0;
                // Active if updated in last 10 seconds
                const isActive = (Date.now() - lastActive) < 10000;
                setPartnerActive(isActive);
                if (isActive && lastActive > lastPartnerUpdate) {
                    setLastPartnerUpdate(lastActive);
                }
            }
        } catch (error) {
            console.error("Failed to poll session:", error);
        }
    };

    // Define completeAssessment SECOND
    const completeAssessment = async (finalAnswers: Record<string, any>) => {
        const persona = generatePersonaFromAnswers(finalAnswers);
        if (finalAnswers["name"]) persona.name = finalAnswers["name"];

        // Save locally just in case
        const key = myRole === "A" ? "theplot_agent_a" : "theplot_agent_b";
        localStorage.setItem(key, JSON.stringify(persona));

        if (sessionId) {
            // Update server
            await fetch('/api/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update',
                    id: sessionId,
                    role: myRole,
                    status: 'done',
                    agent: persona
                })
            });

            setMyStatus("done");
            setMode("waiting");
            checkSessionStatus(sessionId); // Immediate check
        } else {
            // Solo mode fallback
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
        }
    };

    // Now Effects can use them safely
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (mode === "waiting" && sessionId) {
            interval = setInterval(() => {
                checkSessionStatus(sessionId);
            }, 3000);
        }
        // Poll for partner progress during assessment
        if (mode === "assessment" && sessionId) {
            interval = setInterval(() => {
                checkSessionStatus(sessionId);
            }, 2000);
        }

        return () => clearInterval(interval);
    }, [mode, sessionId]);

    const createSession = async () => {
        try {
            const res = await fetch('/api/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create' })
            });
            const session = await res.json();
            const newSessionId = session.id;

            setSessionId(newSessionId);
            const link = `${window.location.origin}/oracle/assess?session=${newSessionId}`;
            setShareLink(link);

            const qr = await QRCode.toDataURL(link, {
                width: 300,
                margin: 2,
                color: { dark: "#8B5CF6", light: "#000000" }
            });
            setQrCode(qr);

            setMyRole("A");
            setMode("solo");
        } catch (e) {
            console.error("Error creating session", e);
        }
    };

    const startAssessment = () => {
        setMode("assessment");
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const shareOnWhatsApp = () => {
        const message = encodeURIComponent(`Let's see our future together! 🔮\n\nJoin me on ThePlot:\n${shareLink}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
    };



    const handleAnswer = async (answer: any) => {
        const questionId = allQuestions[currentQuestionIndex].id;
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);

        // Optimistic UI update
        const nextIndex = currentQuestionIndex + 1;

        // Send progress update
        if (sessionId) {
            // Fire and forget to not block UI
            fetch('/api/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update',
                    id: sessionId,
                    role: myRole,
                    progress: nextIndex // sending 1-based index or 0-based index? let's stick to index
                })
            }).catch(console.error);
        }

        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            completeAssessment(newAnswers);
        }
    };

    // Manual check button
    const checkBothReady = () => {
        if (sessionId) checkSessionStatus(sessionId);
    };

    const startSimulation = () => {
        router.push("/oracle/timeline");
    };

    if (mode === "landing") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md text-center space-y-6">
                    <div className="text-6xl mb-4">🔮</div>
                    <h1 className="text-3xl font-bold">See Your Future Together</h1>
                    <p className="text-gray-400">
                        AI-powered relationship simulation for couples
                    </p>

                    <Button
                        onClick={createSession}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-6 text-lg"
                    >
                        Start Assessment →
                    </Button>
                </div>
            </main>
        );
    }

    if (mode === "solo") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md text-center space-y-6">
                    <div className="text-6xl mb-4">📱</div>
                    <h1 className="text-3xl font-bold">Share with your partner</h1>
                    <p className="text-gray-400 text-sm">They'll answer on their own device</p>

                    {qrCode && (
                        <div className="bg-white p-4 rounded-xl inline-block">
                            <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                        </div>
                    )}

                    <div className="bg-gray-900 p-4 rounded-lg border border-purple-500/30">
                        <code className="text-xs text-purple-400 break-all">{shareLink}</code>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={copyLink}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                        >
                            {copied ? "✅ Copied!" : "📋 Copy"}
                        </Button>
                        <Button
                            onClick={shareOnWhatsApp}
                            className="flex-1 bg-green-600 hover:bg-green-500"
                        >
                            WhatsApp
                        </Button>
                    </div>

                    <Button
                        onClick={startAssessment}
                        variant="ghost"
                        className="w-full mt-8"
                    >
                        Start My Assessment →
                    </Button>
                </div>
            </main>
        );
    }

    if (mode === "join") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md text-center space-y-6">
                    <div className="text-6xl mb-4">💕</div>
                    <h1 className="text-3xl font-bold">Your partner invited you!</h1>
                    <p className="text-gray-300">
                        They want to see your relationship's future together using AI.
                    </p>

                    <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-6 text-left space-y-3">
                        <h3 className="text-lg font-semibold text-purple-400">What happens next:</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>✨ Answer {allQuestions.length} questions about yourself</li>
                            <li>🔮 AI simulates your relationship over 10 years</li>
                            <li>📊 Get a detailed compatibility report</li>
                            <li>⏱️ Takes about 20 minutes</li>
                        </ul>
                    </div>

                    <Button
                        onClick={() => setMode("assessment")}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-6 text-lg"
                    >
                        Start My Assessment →
                    </Button>
                </div>
            </main>
        );
    }

    if (mode === "waiting") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md text-center space-y-6">
                    <div className="text-6xl mb-4 animate-pulse">⏳</div>
                    <h1 className="text-3xl font-bold">You're done!</h1>
                    <p className="text-gray-400">Waiting for your partner to finish...</p>

                    <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-6">
                        <p className="text-sm text-gray-400 mb-4">Ask them to click "I'm Done" when they finish (or check automatically)</p>
                        <Button
                            onClick={checkBothReady}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                        >
                            Check if Partner is Ready
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    if (mode === "ready") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md text-center space-y-6">
                    <div className="text-6xl mb-4">✨</div>
                    <h1 className="text-3xl font-bold">Both ready!</h1>
                    <p className="text-gray-400">Time to see your future together.</p>

                    <Button
                        onClick={startSimulation}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-6 text-lg"
                    >
                        Start Simulation →
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white p-4">
            <div className="max-w-4xl mx-auto py-8">
                <div className="mb-8 space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            The Oracle Assessment
                        </h1>
                        <span className="text-sm text-gray-400 font-mono">
                            {currentQuestionIndex + 1}/{allQuestions.length}
                        </span>
                    </div>

                    {/* Dual Progress Bar */}
                    <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                        {/* My Progress */}
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 z-20"
                            style={{
                                width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`,
                            }}
                        />
                        {/* Partner Progress (Ghost) */}
                        {sessionId && (
                            <div
                                className="absolute top-0 left-0 h-full bg-white/20 transition-all duration-1000 ease-out z-10"
                                style={{
                                    width: `${((partnerProgress + 1) / allQuestions.length) * 100}%`,
                                }}
                            />
                        )}
                    </div>

                    {/* Partner Status Indicator */}
                    {sessionId && (
                        <div className="flex justify-end items-center gap-2 h-6">
                            {partnerActive ? (
                                <>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs text-green-400 animate-pulse">Partner is answering...</span>
                                </>
                            ) : (
                                <span className="text-xs text-gray-500">Partner offline</span>
                            )}
                        </div>
                    )}
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

export default function OracleAssessmentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-2xl">Loading...</div>
            </div>
        }>
            <OracleAssessmentContent />
        </Suspense>
    );
}

export const dynamic = 'force-dynamic';

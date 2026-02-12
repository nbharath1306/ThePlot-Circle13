
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
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

    const Background = () => (
        <div className="aurora-bg fixed top-0 left-0 w-full h-full pointer-events-none z-0">
            <div className="aurora-blob aurora-1" />
            <div className="aurora-blob aurora-2" />
        </div>
    );

    if (mode === "landing") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
                <Background />
                <div className="max-w-md w-full glass-card rounded-3xl p-10 text-center space-y-8 relative z-10 border border-white/10 shadow-2xl">
                    <div className="text-7xl mb-6 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">🔮</div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
                            The Oracle
                        </h1>
                        <p className="text-gray-400 font-light">
                            AI-powered relationship simulation
                        </p>
                    </div>

                    <Button
                        onClick={createSession}
                        className="w-full bg-white text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] py-6 text-lg font-bold rounded-full transition-all duration-300"
                    >
                        Start Session →
                    </Button>
                </div>
            </main>
        );
    }

    if (mode === "solo") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
                <Background />
                <div className="max-w-md w-full glass-card rounded-3xl p-8 text-center space-y-6 relative z-10 border border-white/10">
                    <div className="text-6xl mb-2">📱</div>
                    <h1 className="text-2xl font-bold font-display">Invite Your Partner</h1>
                    <p className="text-gray-400 text-sm">Scan or share link. They play on their device.</p>

                    {qrCode && (
                        <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
                            <img src={qrCode} alt="QR Code" className="w-48 h-48 mix-blend-multiply" />
                        </div>
                    )}

                    <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                        <code className="text-xs text-purple-300 break-all font-mono">{shareLink}</code>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={copyLink}
                            className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10"
                        >
                            {copied ? "✅ Copied!" : "📋 Copy Link"}
                        </Button>
                        <Button
                            onClick={shareOnWhatsApp}
                            className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                        >
                            WhatsApp
                        </Button>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <Button
                            onClick={startAssessment}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 py-6 rounded-xl font-bold shadow-lg shadow-purple-900/40"
                        >
                            Start My Assessment →
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    if (mode === "join") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
                <Background />
                <div className="max-w-md w-full glass-card rounded-3xl p-8 text-center space-y-6 relative z-10 border border-white/10">
                    <div className="text-6xl mb-2">💕</div>
                    <h1 className="text-3xl font-bold font-display">Partner Assessment</h1>
                    <p className="text-gray-300">
                        You've been invited to test your compatibility.
                    </p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-4 border border-white/5">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold">1</div>
                            <p className="text-sm text-gray-300">Answer honestly about yourself</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-300 font-bold">2</div>
                            <p className="text-sm text-gray-300">Wait for AI simulation</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold">3</div>
                            <p className="text-sm text-gray-300">See your 10-year future</p>
                        </div>
                    </div>

                    <Button
                        onClick={() => setMode("assessment")}
                        className="w-full bg-white text-black hover:scale-105 font-bold py-6 rounded-full shadow-xl"
                    >
                        Begin Assessment →
                    </Button>
                </div>
            </main>
        );
    }

    if (mode === "waiting") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
                <Background />
                <div className="max-w-md w-full glass-card rounded-3xl p-10 text-center space-y-8 relative z-10 border border-white/10">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-7xl"
                    >
                        ⏳
                    </motion.div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold font-display">Assessment Complete</h1>
                        <p className="text-gray-400">Waiting for partner...</p>
                    </div>

                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-purple-500"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>
            </main>
        );
    }

    if (mode === "ready") {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
                <Background />
                <div className="max-w-md w-full glass-card rounded-3xl p-10 text-center space-y-8 relative z-10 border border-white/10 shadow-2xl shadow-purple-900/40">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-8xl"
                    >
                        ✨
                    </motion.div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                            System Ready
                        </h1>
                        <p className="text-gray-400">Data synchronized. Initialize simulation.</p>
                    </div>

                    <Button
                        onClick={startSimulation}
                        className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg font-bold rounded-full shadow-lg shadow-white/20"
                    >
                        Run Simulation →
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white p-4 relative overflow-hidden selection:bg-purple-500/30">
            <Background />

            <div className="max-w-4xl mx-auto py-8 relative z-10">
                <div className="mb-12 space-y-6">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl font-bold font-display tracking-tight">
                            Assessment Protocol
                        </h1>
                        <span className="text-sm font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                            Q{currentQuestionIndex + 1} / {allQuestions.length}
                        </span>
                    </div>

                    {/* Premium Progress Bar */}
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 relative">
                        {/* Partner Ghost Progress */}
                        {sessionId && (
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-white/30 z-10"
                                initial={{ width: 0 }}
                                animate={{ width: `${((partnerProgress + 1) / allQuestions.length) * 100}%` }}
                                transition={{ duration: 1, ease: "circOut" }}
                            />
                        )}

                        {/* My Progress */}
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 z-20"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>

                    {/* Partner Status Pill */}
                    {sessionId && (
                        <div className="flex justify-end">
                            <div className={`
                                inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-colors duration-500
                                ${partnerActive
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    : "bg-gray-800/50 border-white/5 text-gray-500"
                                }
                            `}>
                                <span className="relative flex h-2 w-2">
                                    {partnerActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${partnerActive ? "bg-emerald-500" : "bg-gray-600"}`}></span>
                                </span>
                                {partnerActive ? "PARTNER ACTIVE" : "PARTNER IDLE"}
                            </div>
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
            <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
                INITIALIZING...
            </div>
        }>
            <OracleAssessmentContent />
        </Suspense>
    );
}

export const dynamic = 'force-dynamic';

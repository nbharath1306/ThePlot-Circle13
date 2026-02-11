"use client";

import { useCallback, useEffect, useState, use } from "react";
import { useParams } from "next/navigation";
import { Session, Answer, SimulationResult, SessionStage } from "@/types";
import Lobby from "@/components/session/Lobby";
import QuestionFlow from "@/components/questions/QuestionFlow";
import LifetimeViewer from "@/components/simulation/LifetimeViewer"; // UPDATED IMPORT
import OutcomeDisplay from "@/components/results/OutcomeDisplay";

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const sessionId = id;

    const [session, setSession] = useState<Session | null>(null);
    const [stage, setStage] = useState<SessionStage>("lobby");
    const [userId] = useState(() => `user_${Math.random().toString(36).slice(2, 18)}`);
    const [simulation, setSimulation] = useState<SimulationResult | null>(null);
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [sessionUrl, setSessionUrl] = useState("");

    // Join session on mount
    useEffect(() => {
        const joinSession = async () => {
            // Retrieve QR data from sessionStorage (set by landing page)
            setQrDataUrl(sessionStorage.getItem(`qr_${sessionId}`) || "");
            setSessionUrl(sessionStorage.getItem(`url_${sessionId}`) || window.location.href);

            // Join the session
            try {
                const res = await fetch("/api/session/join", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId, userId }),
                });
                const data = await res.json();
                if (data.success) {
                    setSession(data.session);
                }
            } catch {
                // If join fails, create a quick mock session for demo mode
                setSession({
                    id: sessionId,
                    created_at: Date.now(),
                    expires_at: Date.now() + 30 * 60 * 1000,
                    status: "waiting",
                    users: {
                        userA: { userId, answers: [], connected: true, lastSeen: Date.now() },
                        userB: null,
                    },
                });
            }
        };

        joinSession();
    }, [sessionId, userId]);

    // Poll for session updates every 2 seconds (lobby stage)
    useEffect(() => {
        if (stage !== "lobby") return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/session/${sessionId}`);
                const data = await res.json();
                if (data.success) {
                    setSession(data.session);
                }
            } catch {
                // ignore
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [sessionId, stage]);

    // Auto-simulate partner joining after 5 seconds for demo
    useEffect(() => {
        if (!session || session.users.userB || stage !== "lobby") return;

        const timer = setTimeout(async () => {
            try {
                await fetch("/api/session/join", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId, userId: `user_bot_${Math.random().toString(36).slice(2, 10)}` }),
                });
            } catch {
                // Demo fallback — just set both users connected
                setSession((prev) =>
                    prev
                        ? {
                            ...prev,
                            status: "active",
                            users: {
                                ...prev.users,
                                userB: { userId: "user_bot_demo", answers: [], connected: true, lastSeen: Date.now() },
                            },
                        }
                        : prev
                );
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [session, stage, sessionId]);

    const handleLobbyReady = () => setStage("questions");

    const handleQuestionsComplete = async (answers: Answer[]) => {
        // Submit our answers
        try {
            await fetch("/api/session/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, userId, answers }),
            });

            // Also submit bot answers for demo
            const botUserId = session?.users.userB?.userId || session?.users.userA?.userId;
            if (botUserId && botUserId !== userId) {
                await fetch("/api/session/answer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId,
                        userId: botUserId,
                        answers: [
                            { questionId: "cv_1", dimension: "core_values", score: 5, value: "moderate", timestamp: Date.now() },
                            { questionId: "int_1", dimension: "intimacy", score: 7, value: "weekly_libido", timestamp: Date.now() },
                        ],
                    }),
                });
            }
        } catch {
            // ignore
        }

        // Trigger simulation
        setStage("simulation");

        try {
            const res = await fetch("/api/simulate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId }),
            });
            const data = await res.json();
            if (data.success && data.simulation) {
                setSimulation(data.simulation);
                return;
            }
        } catch {
            // API failed — use client-side fallback
        }

        // Fallback: generate simulation data client-side so demo always works
        generateFallback();
    };

    const generateFallback = () => {
        setSimulation({
            lifeStages: [
                {
                    id: 's1',
                    stageName: 'The Spark',
                    ageRange: '20s',
                    scenes: [{
                        title: "The First Night",
                        setting: "A Rooftop Bar",
                        dialogue: [
                            { speaker: 'A', content: "I didn't think I'd meet someone who gets my obsession with 80s synthpop." },
                            { speaker: 'B', content: "It's not an obsession, it's a lifestyle. And you're welcome." },
                            { speaker: 'A', content: "So... where does this go? Are we just talking music?" },
                            { speaker: 'B', content: "I hope not. I want to see where else we match." }
                        ],
                        significance: 'high'
                    }],
                    healthDelta: { connection: 20, passion: 30, stability: 5 },
                    summary: "Instant electric chemistry, bonded over shared niche interests."
                },
                {
                    id: 's2',
                    stageName: 'The Bind',
                    ageRange: '30s',
                    scenes: [{
                        title: "The Move-In Box",
                        setting: "Their New Apartment",
                        dialogue: [
                            { speaker: 'A', content: "Why do you have three boxes of just... cables?" },
                            { speaker: 'B', content: "You never know when you'll need a VGA cable! It's prudent." },
                            { speaker: 'A', content: "It's hoarding. But I guess I can live with it. If you maximize the closet space." },
                            { speaker: 'B', content: "Deal. But the cables stay." }
                        ],
                        significance: 'medium'
                    }],
                    healthDelta: { connection: 10, passion: -5, stability: 20 },
                    summary: "Moved in together. Minor friction over habits, but strong compromise."
                }
            ],
            overallHealth: { connection: 85, passion: 70, stability: 90 },
            verdict: {
                title: "Electric Soulmates",
                compatibilityScore: 92,
                summary: "A rare and enduring connection that survived the tests of time."
            }
        });
    };

    const handleSimulationComplete = useCallback(() => {
        setStage("results");
    }, []);

    if (!session) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="animate-pulse tracking-[0.3em]">CONNECTING TO SESSION...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white py-8 px-4 font-sans">
            {stage === "lobby" && (
                <Lobby
                    session={session}
                    qrCodeDataUrl={qrDataUrl}
                    sessionUrl={sessionUrl}
                    onReady={handleLobbyReady}
                />
            )}

            {stage === "questions" && <QuestionFlow onComplete={handleQuestionsComplete} />}

            {stage === "simulation" && simulation && (
                <div className="flex items-center justify-center min-h-[85vh]">
                    <LifetimeViewer simulation={simulation} onComplete={handleSimulationComplete} />
                </div>
            )}

            {stage === "simulation" && !simulation && (
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <p className="animate-pulse tracking-[0.3em] text-lg text-emerald-500">GENERATING LIFETIME...</p>
                        <p className="text-xs text-emerald-900 mt-2">SIMULATING 50 YEARS OF DATA</p>
                    </div>
                </div>
            )}

            {stage === "results" && simulation && <OutcomeDisplay simulation={simulation} />}
        </main>
    );
}

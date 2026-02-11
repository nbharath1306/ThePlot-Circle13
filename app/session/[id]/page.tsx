"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Session, Answer, SimulationResult, SessionStage } from "@/types";
import Lobby from "@/components/session/Lobby";
import QuestionFlow from "@/components/questions/QuestionFlow";
import Terminal from "@/components/simulation/Terminal";
import OutcomeDisplay from "@/components/results/OutcomeDisplay";

export default function SessionPage() {
    const params = useParams<{ id: string }>();
    const sessionId = params.id;

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
                // Next poll will pick it up
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
                            { questionId: "q1", value: "Need alone time", timestamp: Date.now() },
                            { questionId: "q2", value: "Growth", timestamp: Date.now() },
                            { questionId: "q3", value: "Be hurt but talk about it", timestamp: Date.now() },
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
        setSimulation({
            scenarios: [
                {
                    id: 's1',
                    title: 'The Spark',
                    transcript: [
                        { speaker: 'A', content: "I've never met anyone who thinks like you do." },
                        { speaker: 'B', content: "Is that a good thing?" },
                        { speaker: 'A', content: "The best thing. It's refreshing." },
                    ],
                    emotionalShift: { trust: 10, satisfaction: 15, commitment: 5 },
                    analysis: "Instant intellectual chemistry."
                },
                {
                    id: 's2',
                    title: 'The Challenge',
                    transcript: [
                        { speaker: 'A', content: "We interpret this situation so differently." },
                        { speaker: 'B', content: "Because we have different core values here." },
                        { speaker: 'A', content: "But can we respect that difference?" },
                        { speaker: 'B', content: "I think we can. If we try." },
                    ],
                    emotionalShift: { trust: 5, satisfaction: -5, commitment: 10 },
                    analysis: "Navigating value misalignment."
                },
                {
                    id: 's3',
                    title: 'The Future',
                    transcript: [
                        { speaker: 'A', content: "Seven years... and I'd choose you all over again." },
                        { speaker: 'B', content: "Even with the rough patches?" },
                        { speaker: 'A', content: "Because of them. We built this." },
                    ],
                    emotionalShift: { trust: 20, satisfaction: 25, commitment: 25 },
                    analysis: "Deep, earned security."
                }
            ],
            compatibility: {
                overallScore: 88,
                dimensions: [],
                strengths: ['Communication', 'Growth Mindset', 'Shared Values'],
                challenges: ['Financial Anxiety', 'Risk Tolerance'],
                prediction: 'success_thriving'
            },
            timeline: [
                { year: 1, events: ['First vacation together in Bali', 'Meeting each other\'s families', 'Both start new careers'], emotionalShift: { trust: 15, satisfaction: 20, commitment: 25 } },
                { year: 2, events: ['Move in together', 'Adopt a pet named Luna', 'Navigate work-life balance'], emotionalShift: { trust: 10, satisfaction: 15, commitment: 10 } },
                { year: 3, events: ['Major job change causes stress', 'First real argument about finances', 'Weekend trip heals the rift'], emotionalShift: { trust: -5, satisfaction: -10, commitment: 5 } },
                { year: 4, events: ['Both invest in personal growth', 'Start a creative project together', 'Deepen shared friendships'], emotionalShift: { trust: 10, satisfaction: 15, commitment: 10 } },
                { year: 5, events: ['Career breakthrough for one partner', 'Navigate long-distance phase', 'Reunite stronger than before'], emotionalShift: { trust: 5, satisfaction: -5, commitment: 15 } },
                { year: 6, events: ['Discuss long-term commitment', 'Family pressure from both sides', 'Find their own path together'], emotionalShift: { trust: 10, satisfaction: 10, commitment: 20 } },
                { year: 7, events: ['Major life decision made together', 'Celebrate anniversary milestone', 'Plan next chapter as a team'], emotionalShift: { trust: 15, satisfaction: 20, commitment: 15 } },
            ],
            outcome: 'success_thriving',
            emotionalMetrics: [
                { year: 1, trust: 65, satisfaction: 70, commitment: 75 },
                { year: 2, trust: 75, satisfaction: 85, commitment: 85 },
                { year: 3, trust: 70, satisfaction: 75, commitment: 90 },
                { year: 4, trust: 80, satisfaction: 90, commitment: 100 },
                { year: 5, trust: 85, satisfaction: 85, commitment: 100 },
                { year: 6, trust: 95, satisfaction: 95, commitment: 100 },
                { year: 7, trust: 100, satisfaction: 100, commitment: 100 },
            ],
        });
    };

    const handleSimulationComplete = useCallback(() => {
        setStage("results");
    }, []);

    if (!session) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="animate-pulse tracking-[0.3em]">CONNECTING TO SESSION...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen py-8 px-4">
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
                <Terminal simulation={simulation} onComplete={handleSimulationComplete} />
            )}

            {stage === "simulation" && !simulation && (
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <p className="animate-pulse tracking-[0.3em] text-lg">GENERATING SIMULATION...</p>
                        <p className="text-xs text-[#003300] mt-2">AI PROCESSING PERSONALITY MATRICES</p>
                    </div>
                </div>
            )}

            {stage === "results" && simulation && <OutcomeDisplay simulation={simulation} />}
        </main>
    );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import ChatMessage from "@/components/simulation/ChatMessage";
import VerdictCard from "@/components/simulation/VerdictCard";
import { AgentPersona } from "@/lib/prompts";

interface Message {
    speaker: string;
    text: string;
    emotion?: string;
    internal_thought?: string;
    role: "user" | "assistant" | "system";
}

export default function SimulationPage() {
    const router = useRouter();
    const [agentA, setAgentA] = useState<AgentPersona | null>(null);
    const [agentB, setAgentB] = useState<AgentPersona | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [turnCount, setTurnCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [verdict, setVerdict] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scenario = "You are discussing where to go for your first anniversary dinner. One of you wants something fancy, the other wants something low-key.";

    useEffect(() => {
        const savedAgentA = localStorage.getItem("theplot_agent_a");
        const savedAgentB = localStorage.getItem("theplot_agent_b");

        if (savedAgentA && savedAgentB) {
            setAgentA(JSON.parse(savedAgentA));
            setAgentB(JSON.parse(savedAgentB));
        } else {
            router.push("/assess");
        }
    }, [router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const runTurn = async () => {
        if (!agentA || !agentB || loading) return;
        setLoading(true);

        try {
            const isAgentATurn = turnCount % 2 === 0;
            const currentAgent = isAgentATurn ? agentA : agentB;
            const otherAgentName = isAgentATurn ? agentB.name : agentA.name;
            const role = isAgentATurn ? "Agent A" : "Agent B";

            const conversationHistory = messages.map(m => ({
                role: m.role,
                content: `${m.speaker}: ${m.text}`
            }));

            const res = await fetch("/api/simulation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    agent: currentAgent,
                    otherAgentName,
                    history: conversationHistory,
                    scenario,
                    role
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            const newMessage: Message = {
                speaker: currentAgent.name,
                text: data.text,
                emotion: data.emotion,
                internal_thought: data.internal_thought,
                role: "assistant"
            };

            setMessages((prev) => [...prev, newMessage]);
            setTurnCount((prev) => prev + 1);

        } catch (error) {
            console.error("Simulation error:", error);
            setIsPlaying(false);
        } finally {
            setLoading(false);
        }
    };

    const analyzeRelationship = async () => {
        if (!agentA || !agentB) return;
        setAnalyzing(true);
        setIsPlaying(false);

        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages,
                    agentA,
                    agentB,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setVerdict(data);
            }
        } catch (error) {
            console.error("Analysis error:", error);
        } finally {
            setAnalyzing(false);
        }
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isPlaying && !loading && turnCount < 10) {
            timeout = setTimeout(() => {
                runTurn();
            }, 2000);
        } else if (turnCount >= 10 && isPlaying && !analyzing && !verdict) {
            analyzeRelationship();
        }
        return () => clearTimeout(timeout);
    }, [isPlaying, loading, turnCount, analyzing, verdict]);

    if (!agentA || !agentB) return <div className="text-white text-center mt-20 animate-pulse">Loading profiles...</div>;

    return (
        <main className="min-h-screen bg-black flex flex-col">
            <header className="p-4 border-b border-white/10 flex justify-between items-center bg-gray-900/80 backdrop-blur-md sticky top-0 z-10 transition-all duration-300">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-display">
                        ThePlot
                    </h1>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                        {agentA.name} <span className="text-gray-600 mx-1">vs</span> {agentB.name}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={isPlaying ? "secondary" : "primary"}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-24 transition-all"
                        disabled={turnCount >= 10}
                    >
                        {isPlaying ? "Pause" : "Play"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => router.push("/")}>
                        Exit
                    </Button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-3xl mx-auto w-full pb-20">
                <div className="bg-blue-900/10 p-6 rounded-xl border border-blue-500/20 mb-8 text-center backdrop-blur-sm">
                    <h3 className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-2">Current Scenario</h3>
                    <p className="text-gray-300 font-serif text-lg leading-relaxed">{scenario}</p>
                </div>

                {messages.map((msg, idx) => (
                    <ChatMessage
                        key={idx}
                        message={msg}
                        isLeft={msg.speaker === agentA.name}
                    />
                ))}

                {loading && (
                    <div className="flex justify-center items-center gap-2 text-gray-500 text-sm py-4 animate-pulse">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="ml-2 font-mono text-xs uppercase tracking-wider">
                            {turnCount % 2 === 0 ? agentA.name : agentB.name} is typing...
                        </span>
                    </div>
                )}

                {analyzing && (
                    <div className="flex flex-col items-center gap-4 text-purple-400 text-sm py-8">
                        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        <span className="font-mono text-base uppercase tracking-wider animate-pulse">
                            Analyzing your future...
                        </span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {verdict && (
                <VerdictCard
                    label={verdict.label}
                    survival_probability={verdict.survival_probability}
                    verdict={verdict.verdict}
                    vibe={verdict.vibe}
                    agentA={agentA.name}
                    agentB={agentB.name}
                    onClose={() => setVerdict(null)}
                />
            )}

        </main>
    );
}

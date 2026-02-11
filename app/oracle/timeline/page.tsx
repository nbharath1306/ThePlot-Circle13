"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import ChatMessage from "@/components/simulation/ChatMessage";
import { AgentPersona } from "@/lib/prompts";
import { ORACLE_SCENARIOS, Scenario } from "@/lib/scenarios";

interface Message {
    speaker: string;
    text: string;
    emotion?: string;
    internal_thought?: string;
    role: "user" | "assistant" | "system";
}

export default function OracleTimelinePage() {
    const router = useRouter();
    const [agentA, setAgentA] = useState<AgentPersona | null>(null);
    const [agentB, setAgentB] = useState<AgentPersona | null>(null);
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [turnCount, setTurnCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [scenarioComplete, setScenarioComplete] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentScenario = ORACLE_SCENARIOS[currentScenarioIndex];
    const isLastScenario = currentScenarioIndex === ORACLE_SCENARIOS.length - 1;

    useEffect(() => {
        const savedAgentA = localStorage.getItem("theplot_agent_a");
        const savedAgentB = localStorage.getItem("theplot_agent_b");

        if (savedAgentA && savedAgentB) {
            setAgentA(JSON.parse(savedAgentA));
            setAgentB(JSON.parse(savedAgentB));
        } else {
            router.push("/oracle/assess");
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
                    scenario: currentScenario.context,
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

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isPlaying && !loading && turnCount < 6) {
            timeout = setTimeout(() => {
                runTurn();
            }, 2000);
        } else if (turnCount >= 6 && isPlaying) {
            setIsPlaying(false);
            setScenarioComplete(true);
        }
        return () => clearTimeout(timeout);
    }, [isPlaying, loading, turnCount]);

    const handleNextScenario = () => {
        if (!isLastScenario) {
            setCurrentScenarioIndex(prev => prev + 1);
            setMessages([]);
            setTurnCount(0);
            setScenarioComplete(false);
        } else {
            // Navigate to final report
            router.push("/oracle/report");
        }
    };

    if (!agentA || !agentB) return <div className="text-white text-center mt-20 animate-pulse">Loading profiles...</div>;

    return (
        <main className="min-h-screen bg-black flex flex-col">
            <header className="p-4 border-b border-white/10 flex justify-between items-center bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-display">
                        The Oracle
                    </h1>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                        {agentA.name} <span className="text-gray-600 mx-1">×</span> {agentB.name}
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="text-xs text-gray-400 mr-2">
                        Scenario {currentScenarioIndex + 1}/{ORACLE_SCENARIOS.length}
                    </div>
                    <Button
                        size="sm"
                        variant={isPlaying ? "secondary" : "primary"}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-24"
                        disabled={turnCount >= 6 || scenarioComplete}
                    >
                        {isPlaying ? "Pause" : "Play"}
                    </Button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-3xl mx-auto w-full pb-20">
                {/* Scenario Header */}
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-8 rounded-2xl border border-purple-500/30 text-center backdrop-blur-sm">
                    <div className="text-6xl mb-4">{currentScenario.emoji}</div>
                    <h2 className="text-3xl font-bold text-white mb-2">Year {currentScenario.year}</h2>
                    <h3 className="text-xl text-purple-400 mb-4">{currentScenario.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{currentScenario.description}</p>
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
                            {turnCount % 2 === 0 ? agentA.name : agentB.name} is responding...
                        </span>
                    </div>
                )}

                {scenarioComplete && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div className="text-center space-y-2">
                            <div className="text-4xl">✓</div>
                            <p className="text-gray-400">Scenario Complete</p>
                        </div>
                        <Button
                            onClick={handleNextScenario}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8"
                        >
                            {isLastScenario ? "See Final Report →" : "Next Scenario →"}
                        </Button>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

        </main>
    );
}

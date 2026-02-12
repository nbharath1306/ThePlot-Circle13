"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
    const [fullHistory, setFullHistory] = useState<Message[]>([]);

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
    }, [messages, loading]);

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
        const updatedHistory = [...fullHistory, ...messages];
        setFullHistory(updatedHistory);

        if (!isLastScenario) {
            setCurrentScenarioIndex(prev => prev + 1);
            setMessages([]);
            setTurnCount(0);
            setScenarioComplete(false);
            setIsPlaying(false);
        } else {
            localStorage.setItem("theplot_sim_history", JSON.stringify(updatedHistory));
            router.push("/oracle/report");
        }
    };

    if (!agentA || !agentB) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
            <span className="animate-pulse"> LOADING_PROFILE_DATA...</span>
        </div>
    );

    return (
        <main className="min-h-screen bg-black text-white font-mono flex flex-col relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <header className="fixed top-0 w-full z-50 p-4 border-b border-white/10 bg-black/80 backdrop-blur-xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push("/")} className="text-gray-500 hover:text-white transition-colors">← EXIT</button>
                    <div>
                        <h1 className="text-sm font-bold tracking-[0.2em] text-purple-500">
                            SIMULATION_SEQUENCE_{currentScenarioIndex + 1}
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">
                            SUBJECTS: {agentA.name.toUpperCase()} & {agentB.name.toUpperCase()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 animate-pulse">
                        {isPlaying ? "● SIMULATING LIVE" : "○ PAUSED"}
                    </span>
                    <Button
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        disabled={turnCount >= 6 || scenarioComplete}
                        className={`
                            border border-white/20 hover:bg-white/10 text-xs tracking-widest px-6 py-2 rounded-none transition-all
                            ${isPlaying ? "bg-red-500/20 text-red-400 border-red-500/50" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"}
                        `}
                    >
                        {isPlaying ? "HALT" : "EXECUTE"}
                    </Button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pt-24 pb-32 px-4 max-w-4xl mx-auto w-full z-10 scrollbar-hide">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentScenarioIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-12"
                    >
                        <div className="glass-card p-8 rounded-none border-l-4 border-purple-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-bold select-none">{currentScenario.year}</div>
                            <div className="relative z-10">
                                <span className="text-purple-400 text-xs tracking-widest mb-2 block">TIMELINE: YEAR {currentScenario.year}</span>
                                <h2 className="text-3xl font-bold mb-4 font-display">{currentScenario.title}</h2>
                                <p className="text-gray-400 leading-relaxed max-w-2xl text-sm md:text-base border-t border-white/10 pt-4 mt-4">
                                    {currentScenario.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="space-y-6">
                    {messages.map((msg, idx) => (
                        <ChatMessage
                            key={idx}
                            message={msg}
                            isLeft={msg.speaker === agentA.name}
                        />
                    ))}

                    {loading && (
                        <div className="flex items-center gap-2 text-gray-500 text-xs tracking-widest animate-pulse ml-4 border-l border-white/20 pl-4 py-2">
                            <span>PROCESSING_RESPONSE</span>
                            <span className="animate-ping">_</span>
                        </div>
                    )}
                </div>

                <div ref={messagesEndRef} />
            </div>

            {/* Sticky Action Footer */}
            <AnimatePresence>
                {(scenarioComplete || (!isPlaying && messages.length === 0)) && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black to-transparent z-50 flex justify-center"
                    >
                        {scenarioComplete ? (
                            <Button
                                onClick={handleNextScenario}
                                className="bg-white text-black hover:bg-gray-200 px-12 py-6 text-lg font-bold tracking-widest rounded-none shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            >
                                {isLastScenario ? "GENERATE FINAL REPORT →" : "INITIATE NEXT CYCLE →"}
                            </Button>
                        ) : (
                            !isPlaying && messages.length === 0 && (
                                <Button
                                    onClick={() => setIsPlaying(true)}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-12 py-6 text-lg font-bold tracking-widest rounded-none shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                >
                                    BEGIN SIMULATION
                                </Button>
                            )
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

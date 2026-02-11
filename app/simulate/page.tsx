"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import ChatMessage from "@/components/simulation/ChatMessage";
import { AgentPersona, generatePersonaFromAnswers } from "@/lib/prompts";

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
    const [messages, setMessages] = useState<Message[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [turnCount, setTurnCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Hardcoded Agent B for MVP
    const agentB: AgentPersona = {
        name: "Jordan",
        traits: ["Relaxed", "Creative"],
        style: "Casual and avoiding conflict",
        values: ["Freedom", "Creativity"],
        background: "An artist who hates rigid schedules.",
    };

    const scenario = "You are discussing where to go for your first anniversary dinner. One of you wants something fancy, the other wants something low-key.";

    useEffect(() => {
        // Load assessment results
        const savedAnswers = localStorage.getItem("theplot_assessment_answers");
        if (!savedAnswers) {
            router.push("/assess");
            return;
        }
        const answers = JSON.parse(savedAnswers);
        const generatedAgent = generatePersonaFromAnswers(answers);
        setAgentA(generatedAgent);
    }, [router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const runTurn = async () => {
        if (!agentA || loading) return;
        setLoading(true);

        try {
            // Determine whose turn it is
            const isAgentATurn = turnCount % 2 === 0;
            const currentAgent = isAgentATurn ? agentA : agentB;
            const otherAgentName = isAgentATurn ? agentB.name : agentA.name;
            const role = isAgentATurn ? "Agent A" : "Agent B";

            // Prepare history for API
            // Filter out internal thoughts for prompt history to keep it clean? 
            // For MVP, passing full history as text is simpler.
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
                role: "assistant" // In LLM context, previously spoken lines are context
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

    // Effect to run loop when playing
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isPlaying && !loading && turnCount < 10) { // Limit to 10 turns for MVP
            timeout = setTimeout(() => {
                runTurn();
            }, 2000); // 2 second delay between turns
        }
        return () => clearTimeout(timeout);
    }, [isPlaying, loading, turnCount]);

    if (!agentA) return <div className="text-white text-center mt-20">Loading profile...</div>;

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

                <div ref={messagesEndRef} />
            </div>

        </main>
    );
}

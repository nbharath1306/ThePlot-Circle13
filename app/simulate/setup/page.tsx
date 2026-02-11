"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { AgentPersona, generatePersonaFromAnswers } from "@/lib/prompts";

export default function SetupPage() {
    const router = useRouter();
    const [agentA, setAgentA] = useState<AgentPersona | null>(null);
    const [partnerName, setPartnerName] = useState("");
    const [partnerTraits, setPartnerTraits] = useState("");
    const [partnerVibe, setPartnerVibe] = useState("");
    const [yourName, setYourName] = useState("");

    useEffect(() => {
        const savedAnswers = localStorage.getItem("theplot_assessment_answers");
        if (!savedAnswers) {
            router.push("/assess");
            return;
        }
        const answers = JSON.parse(savedAnswers);
        const generatedAgent = generatePersonaFromAnswers(answers);
        setAgentA(generatedAgent);
        setYourName("Me"); // Default
    }, [router]);

    const handleStart = () => {
        if (!agentA) return;

        // Save Agent A with custom name
        const finalAgentA = { ...agentA, name: yourName || "Me" };
        localStorage.setItem("theplot_agent_a", JSON.stringify(finalAgentA));

        // Create and save Agent B
        const agentB: AgentPersona = {
            name: partnerName || "Mystery Date",
            traits: partnerTraits.split(",").map(t => t.trim()).filter(Boolean),
            style: "Dynamic",
            values: ["Connection"],
            background: partnerVibe || "A mysterious person you just met.",
        };

        // Default traits if empty to ensure simulation works
        if (agentB.traits.length === 0) agentB.traits = ["Charming", "Mysterious"];

        localStorage.setItem("theplot_agent_b", JSON.stringify(agentB));

        router.push("/simulate");
    };

    if (!agentA) return null;

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-display mb-2">
                        Cast The Roles
                    </h1>
                    <p className="text-gray-400">Who is in this story?</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Your Name</label>
                        <Input
                            value={yourName}
                            onChange={(e) => setYourName(e.target.value)}
                            placeholder="Enter your name"
                            className="bg-gray-900/50 border-gray-700"
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Partner Profile</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Partner's Name</label>
                                <Input
                                    value={partnerName}
                                    onChange={(e) => setPartnerName(e.target.value)}
                                    placeholder="e.g. Jessica, Ryan..."
                                    className="bg-gray-900/50 border-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Key Traits (comma separated)</label>
                                <Input
                                    value={partnerTraits}
                                    onChange={(e) => setPartnerTraits(e.target.value)}
                                    placeholder="e.g. Smart, Funny, Stubborn"
                                    className="bg-gray-900/50 border-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Vibe / Backstory</label>
                                <Input
                                    value={partnerVibe}
                                    onChange={(e) => setPartnerVibe(e.target.value)}
                                    placeholder="e.g. An artist who loves chaos"
                                    className="bg-gray-900/50 border-gray-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleStart}
                    className="w-full h-12 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
                    disabled={!yourName || !partnerName}
                >
                    Start Simulation →
                </Button>
            </Card>
        </main>
    );
}

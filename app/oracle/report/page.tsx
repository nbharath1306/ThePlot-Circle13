"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import html2canvas from "html2canvas";

interface AnalysisResult {
    label: string;
    survival_probability: number;
    verdict: string;
    vibe: string;
}

export default function OracleReportPage() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [agentA, setAgentA] = useState<any>(null);
    const [agentB, setAgentB] = useState<any>(null);
    const [sharing, setSharing] = useState(false);

    const storyRef = useRef<HTMLDivElement>(null);
    const postRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAnalysis = async (messages: any[], a: any, b: any) => {
            try {
                const res = await fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages,
                        agentA: a,
                        agentB: b
                    })
                });
                const data = await res.json();
                setResult(data);
            } catch (error) {
                console.error("Analysis failed", error);
            } finally {
                setLoading(false);
            }
        };

        const history = localStorage.getItem("theplot_sim_history");
        const storedAgentA = localStorage.getItem("theplot_agent_a");
        const storedAgentB = localStorage.getItem("theplot_agent_b");

        if (!history || !storedAgentA || !storedAgentB) {
            router.push("/oracle/assess");
            return;
        }

        const parsedHistory = JSON.parse(history);
        const parsedAgentA = JSON.parse(storedAgentA);
        const parsedAgentB = JSON.parse(storedAgentB);

        setAgentA(parsedAgentA);
        setAgentB(parsedAgentB);

        fetchAnalysis(parsedHistory, parsedAgentA, parsedAgentB);
    }, [router]);

    const captureAndShare = async (element: HTMLElement | null, fileName: string) => {
        if (!element) return;
        setSharing(true);
        try {
            const canvas = await html2canvas(element, {
                backgroundColor: "#000000",
                scale: 2
            });
            const image = canvas.toDataURL("image/png");

            // Trigger download
            const link = document.createElement("a");
            link.href = image;
            link.download = `${fileName}.png`;
            link.click();

            // Also try native share on mobile
            if (navigator.share && navigator.canShare) {
                const blob = await (await fetch(image)).blob();
                const file = new File([blob], `${fileName}.png`, { type: 'image/png' });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'My Relationship Verdict',
                        text: `The Oracle says we are ${result?.label}! 🔥 Survival chance: ${result?.survival_probability}%`
                    });
                }
            }
        } catch (error) {
            console.error("Sharing failed", error);
        }
        setSharing(false);
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = result ? encodeURIComponent(`The Oracle Verdict: ${result.vibe} ${result.label}\nChance: ${result.survival_probability}%\n\nCheck your fate: ${shareUrl}`) : '';

    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-6xl animate-pulse">🔮</div>
                    <h2 className="text-xl font-mono text-purple-400">Consulting the Oracle...</h2>
                </div>
            </main>
        );
    }

    if (!result) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center text-red-500">Failed to generate report. Please try again.</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white p-6 pb-32 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Main Result Display */}
            <div className="max-w-md w-full space-y-8 text-center relative z-10">
                <div>
                    <h1 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-2">Final Verdict</h1>
                    <div className="text-8xl mb-4 animate-bounce">{result.vibe}</div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        {result.label}
                    </h2>
                </div>

                <div className="relative pt-4">
                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden w-full">
                        <div
                            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-1000 ease-out"
                            style={{ width: `${result.survival_probability}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs font-mono text-gray-500 mt-2">
                        <span>Doomed</span>
                        <span className="text-white font-bold">{result.survival_probability}% Survival Chance</span>
                        <span>Forever</span>
                    </div>
                </div>

                <div className="bg-gray-900/50 border border-purple-500/30 p-6 rounded-xl backdrop-blur-md">
                    <p className="text-xl italic text-gray-200">"{result.verdict}"</p>
                </div>

                {/* Share Actions */}
                <div className="space-y-4 pt-8">
                    <h3 className="text-purple-400 font-mono text-sm uppercase tracking-wider">Share Your Fate</h3>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={() => captureAndShare(storyRef.current, "oracle-story")}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                            disabled={sharing}
                        >
                            📸 Insta Story
                        </Button>
                        <Button
                            onClick={() => captureAndShare(postRef.current, "oracle-post")}
                            className="bg-gray-800 hover:bg-gray-700 border border-purple-500/30"
                            disabled={sharing}
                        >
                            🖼️ Insta Post
                        </Button>
                        <Button
                            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank')}
                            className="bg-blue-500 hover:bg-blue-400"
                        >
                            🐦 Twitter / X
                        </Button>
                        <Button
                            onClick={() => window.open(`https://wa.me/?text=${shareText}`, '_blank')}
                            className="bg-green-600 hover:bg-green-500"
                        >
                            💬 WhatsApp
                        </Button>
                    </div>

                    <Button
                        onClick={() => router.push("/")}
                        variant="ghost"
                        className="w-full mt-4 text-gray-500 hover:text-white"
                    >
                        Start New Assessment
                    </Button>
                </div>

                <div className="text-xs text-gray-600 font-mono mt-8">
                    {agentA?.name} & {agentB?.name}
                </div>
            </div>

            {/* Hidden Share Cards for Generation */}
            <div className="fixed -left-[9999px] top-0">

                {/* 1. Instagram Story Layout (9:16) */}
                <div
                    ref={storyRef}
                    className="w-[1080px] h-[1920px] bg-black flex flex-col items-center justify-between p-20 text-center relative overflow-hidden"
                >
                    {/* Background Effects */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-purple-900/40 via-black to-pink-900/40 blur-3xl rounded-full"></div>

                    <div className="z-10 mt-20">
                        <h1 className="text-6xl font-black font-display text-white tracking-tight uppercase mb-4">The Oracle</h1>
                        <p className="text-3xl text-purple-400 font-mono uppercase tracking-widest">Verdict</p>
                    </div>

                    <div className="z-10 flex flex-col items-center gap-10">
                        <div className="text-[250px] leading-none filter drop-shadow-[0_0_60px_rgba(168,85,247,0.5)] animate-pulse">
                            {result.vibe}
                        </div>
                        <h2 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-4 leading-tight">
                            {result.label}
                        </h2>
                    </div>

                    <div className="z-10 w-full max-w-2xl bg-gray-900/80 border border-purple-500/50 p-12 rounded-3xl backdrop-blur-xl">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-3xl text-gray-400 font-mono">Survival Chance</span>
                            <span className="text-5xl font-bold text-white">{result.survival_probability}%</span>
                        </div>
                        <div className="h-6 bg-gray-800 rounded-full overflow-hidden w-full mb-8">
                            <div
                                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                style={{ width: `${result.survival_probability}%` }}
                            />
                        </div>
                        <p className="text-4xl italic text-gray-200 font-serif leading-relaxed">
                            "{result.verdict}"
                        </p>
                    </div>

                    <div className="z-10 mb-20">
                        <p className="text-3xl text-gray-500 font-mono">theplot.vercel.app</p>
                    </div>
                </div>

                {/* 2. Instagram Post Layout (1:1) */}
                <div
                    ref={postRef}
                    className="w-[1080px] h-[1080px] bg-black flex flex-col items-center justify-center p-16 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-purple-900/20 via-black to-pink-900/20"></div>

                    <div className="z-10 flex flex-col items-center gap-8 w-full border-4 border-white/10 p-12 rounded-[60px] h-full justify-center bg-white/5 backdrop-blur-sm">

                        <div className="absolute top-12 left-0 w-full flex justify-center">
                            <h1 className="text-4xl font-black text-white/30 tracking-widest uppercase">The Oracle</h1>
                        </div>

                        <div className="text-[180px] leading-none filter drop-shadow-[0_0_40px_rgba(236,72,153,0.5)]">
                            {result.vibe}
                        </div>

                        <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 leading-tight">
                            {result.label}
                        </h2>

                        <div className="w-full bg-black/60 p-8 rounded-3xl border border-white/10">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-2xl text-gray-400 font-mono">Survival%</span>
                                <span className="text-5xl font-bold text-white">{result.survival_probability}%</span>
                            </div>
                            <div className="h-4 bg-gray-800 rounded-full overflow-hidden w-full">
                                <div
                                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                    style={{ width: `${result.survival_probability}%` }}
                                />
                            </div>
                        </div>

                        <p className="text-3xl text-gray-400 font-mono mt-4">theplot.vercel.app</p>
                    </div>
                </div>

            </div>
        </main>
    );
}

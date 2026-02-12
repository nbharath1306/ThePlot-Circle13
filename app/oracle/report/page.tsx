"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

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
                scale: 2,
                useCORS: true,
                logging: false
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
                        title: 'The Oracle Verdict',
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
            <main className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
                <div className="text-center space-y-4">
                    <div className="text-6xl animate-pulse filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">🔮</div>
                    <h2 className="text-xs tracking-[0.3em] text-purple-400 uppercase">Compiling Destiny...</h2>
                </div>
            </main>
        );
    }

    if (!result) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
                <div className="text-center text-red-500 border border-red-900/50 p-6 bg-red-950/20">
                    ERROR: FATE_CALCULATION_FAILED
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white p-6 pb-32 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay" />
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(50,20,100,0.2)_0%,transparent_60%)] pointer-events-none" />

            {/* Main Result Receipt */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="glass-card p-0 overflow-hidden relative border border-white/10 shadow-2xl">
                    {/* Receipt Header */}
                    <div className="bg-white text-black p-6 text-center border-b border-black">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-mono tracking-widest uppercase">The Oracle™</span>
                            <span className="text-xs font-mono">{new Date().toLocaleDateString()}</span>
                        </div>
                        <h1 className="text-5xl font-black font-display tracking-tighter uppercase leading-none">
                            {result.label}
                        </h1>
                    </div>

                    {/* Receipt Body */}
                    <div className="p-8 space-y-8 bg-black/60 backdrop-blur-3xl">

                        <div className="text-center">
                            <div className="text-8xl mb-4 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-[pulse_3s_infinite]">
                                {result.vibe}
                            </div>
                            <div className="inline-block border border-white/20 px-4 py-1 rounded-full bg-white/5">
                                <span className="text-xs font-mono text-gray-300 uppercase tracking-widest">
                                    Vibe Analysis
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-400 font-mono text-sm uppercase">Survival Probability</span>
                                <span className="text-4xl font-bold font-display text-white">{result.survival_probability}%</span>
                            </div>
                            <div className="h-4 bg-gray-800 rounded-none overflow-hidden w-full border border-white/10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.survival_probability}%` }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                />
                            </div>
                        </div>

                        <div className="border-t border-dashed border-white/20 pt-6">
                            <p className="text-lg text-gray-300 font-mono leading-relaxed">
                                <span className="text-purple-400 mr-2">&gt;&gt;</span>
                                {result.verdict}
                            </p>
                        </div>
                    </div>

                    {/* Barcode Footer */}
                    <div className="bg-white text-black p-4 flex justify-between items-center">
                        <div className="h-8 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxMDAgMTAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjQiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEwIiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjYiIHk9IjAiIHdpZHRoPSIzIiBoZWlnaHQ9IjEwIiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjExIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSIxNCIgeT0iMCIgd2lkdGg9IjIiIGhlaWdodD0iMTAiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iMTgiIHk9IjAiIHdpZHRoPSI0IiBoZWlnaHQ9IjEwIiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjIzIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSIyNiIgeT0iMCIgd2lkdGg9IjIiIGhlaWdodD0iMTAiIGZpbGw9ImJsYWNrIi8+PC9zdmc+')] opacity-50" />
                        <span className="text-[10px] font-mono whitespace-nowrap ml-4">THE_PLOT_REC_{Math.floor(Math.random() * 10000)}</span>
                    </div>
                </div>

                {/* Share Actions */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <Button
                        onClick={() => captureAndShare(storyRef.current, "oracle-story")}
                        className="bg-white text-black hover:bg-gray-200 font-bold border-none"
                        disabled={sharing}
                    >
                        📸 IG STORY
                    </Button>
                    <Button
                        onClick={() => window.open(`https://wa.me/?text=${shareText}`, '_blank')}
                        className="bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30"
                    >
                        💬 WHATSAPP
                    </Button>
                </div>
                <Button
                    onClick={() => router.push("/")}
                    variant="ghost"
                    className="w-full mt-4 text-xs font-mono text-gray-500 hover:text-white uppercase tracking-widest"
                >
                    Initialize New Protocol
                </Button>
            </motion.div>

            {/* GENERATION CANVASES (HIDDEN) */}
            <div className="fixed -left-[9999px] top-0">
                {/* 1. Instagram Story (9:16) - 1080x1920 */}
                <div
                    ref={storyRef}
                    className="w-[1080px] h-[1920px] bg-black p-20 flex flex-col justify-between relative overflow-hidden text-white"
                >
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black z-0 opacity-50" />
                    <div className="absolute inset-0 z-0 opacity-20 bg-noise" />

                    {/* Content */}
                    <div className="relative z-10 border-4 border-white p-12 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <h1 className="text-8xl font-black font-display tracking-tighter uppercase leading-none">
                                {result.label}
                            </h1>
                            <div className="text-4xl font-mono border border-white px-4 py-2">
                                {result.survival_probability}%
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="text-[400px] leading-none filter drop-shadow-[0_0_80px_rgba(255,255,255,0.4)]">
                                {result.vibe}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <p className="text-5xl font-mono leading-tight">
                                "{result.verdict}"
                            </p>
                            <div className="flex justify-between items-end border-t-4 border-white pt-8">
                                <div>
                                    <div className="text-3xl font-mono opacity-60 uppercase mb-2">The Oracle Protocol</div>
                                    <div className="text-2xl font-mono opacity-40">theplot.vercel.app</div>
                                </div>
                                <div className="h-16 w-48 bg-white opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Instagram Post (1:1) - 1080x1080 */}
                <div ref={postRef} className="w-[1080px] h-[1080px] bg-black p-12 text-white relative">
                    <div className="w-full h-full border-4 border-white p-12 flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                            <h1 className="text-7xl font-black tracking-tighter uppercase">{result.label}</h1>
                            <span className="text-4xl font-mono">{result.survival_probability}% SURVIVAL</span>
                        </div>

                        <div className="flex justify-center my-12">
                            <div className="text-[350px] leading-none">{result.vibe}</div>
                        </div>

                        <div className="flex justify-between items-end">
                            <p className="text-3xl font-mono max-w-2xl">"{result.verdict}"</p>
                            <div className="text-right">
                                <div className="text-3xl font-black uppercase">The Oracle</div>
                                <div className="text-xl font-mono opacity-50">theplot.vercel.app</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

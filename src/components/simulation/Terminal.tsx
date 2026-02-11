"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { SimulationResult, ScenarioResult } from "@/types";
import { useSoundEngine } from "@/components/shared/SoundManager";
import DialogueDisplay from "./DialogueDisplay";
import EmotionalMetrics from "./EmotionalMetrics";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalProps {
    simulation: SimulationResult;
    onComplete: () => void;
}

const bootLines = [
    "> Initializing neural simulation engine...",
    "> Loading personality matrix A... OK",
    "> Loading personality matrix B... OK",
    "> Materializing scenario contexts...",
    "> Synchronizing temporal processors...",
    "> SIMULATION READY. EXECUTING...",
];

export default function Terminal({ simulation, onComplete }: TerminalProps) {
    const [bootIndex, setBootIndex] = useState(0);
    const [bootDone, setBootDone] = useState(false);
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [phase, setPhase] = useState<'title' | 'dialogue' | 'analysis'>('title');

    const { whoosh, startAmbient } = useSoundEngine();

    // Boot sequence
    useEffect(() => {
        if (bootDone) return;
        if (bootIndex < bootLines.length) {
            const timer = setTimeout(() => setBootIndex((prev) => prev + 1), 200);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setBootDone(true);
                startAmbient();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [bootIndex, bootDone, startAmbient]);

    const currentScenario = simulation.scenarios ? simulation.scenarios[currentScenarioIndex] : null;

    // Handle Title Phase Duration
    useEffect(() => {
        if (!bootDone || phase !== 'title' || !currentScenario) return;

        whoosh();
        const timer = setTimeout(() => {
            setPhase('dialogue');
        }, 3000); // Show title for 3s
        return () => clearTimeout(timer);
    }, [bootDone, phase, currentScenario, whoosh]);

    const handleDialogueComplete = () => {
        setPhase('analysis');
        setTimeout(() => {
            // Move to next scenario
            if (currentScenarioIndex < (simulation.scenarios?.length || 0) - 1) {
                setCurrentScenarioIndex(prev => prev + 1);
                setPhase('title');
            } else {
                onComplete();
            }
        }, 3000); // Show analysis/metrics for 3s before next
    };

    // Fallback for legacy data structure (if scenarios shouldn't exist, though we just built them)
    if (!simulation.scenarios && simulation.timeline) {
        return <div className="p-10 text-red-500">LEGACY DATA FORMAT DETECTED. PLEASE RE-RUN SIMULATION.</div>;
    }

    if (!currentScenario) return null;

    return (
        <div className="w-full max-w-6xl mx-auto border border-[#003300] bg-black min-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden font-mono">
            {/* CRT Effects */}
            <div className="absolute inset-0 pointer-events-none bg-[url('/scanlines.png')] opacity-10 z-50 mix-blend-overlay" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00ff00]/5 to-transparent z-40 animate-scan" />

            {/* Header */}
            <div className="border-b border-[#003300] px-4 py-2 flex justify-between text-[10px] tracking-[0.2em] bg-[#001100] text-[#00ff00]/60 z-30">
                <span>SIMULATION_CORE_V2.1</span>
                <span>
                    SCENARIO: {currentScenarioIndex + 1}/{simulation.scenarios?.length} :: {phase.toUpperCase()}
                </span>
            </div>

            {!bootDone ? (
                <div className="flex-1 p-8 flex flex-col justify-end pb-20">
                    {bootLines.slice(0, bootIndex).map((line, i) => (
                        <div key={i} className="text-xs text-[#00ff00] mb-2">{line}</div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col relative">
                    {/* SCENARIO TITLE CARD */}
                    <AnimatePresence mode="wait">
                        {phase === 'title' && (
                            <motion.div
                                key="title"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 backdrop-blur-sm"
                            >
                                <div className="text-center">
                                    <h3 className="text-[#00ff00]/50 tracking-[0.5em] text-xs mb-4">YEAR {currentScenarioIndex + 1}</h3>
                                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-wider mb-2 text-shadow-glow">
                                        {currentScenario.title.toUpperCase()}
                                    </h1>
                                    <div className="h-1 w-24 bg-[#00ff00] mx-auto mb-4" />
                                    <p className="text-[#00ff00]/70 text-sm max-w-md mx-auto leading-relaxed">
                                        {simulation.timeline[currentScenarioIndex]?.events[0] || "Analyzing interaction..."}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* DIALOGUE AREA */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        {phase !== 'title' && (
                            <DialogueDisplay
                                transcript={currentScenario.transcript}
                                onComplete={handleDialogueComplete}
                            />
                        )}
                    </div>

                    {/* METRICS SIDEBAR (or Bottom Bar for mobile) */}
                    {phase === 'analysis' && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-[#001100] border-t border-[#003300] p-4 z-20"
                        >
                            <div className="flex justify-between items-center max-w-4xl mx-auto">
                                <span className="text-xs text-[#00ff00]/50 tracking-widest">EMOTIONAL_SHIFT_DETECTED</span>
                                <div className="flex gap-8">
                                    <div className="text-center">
                                        <div className="text-[10px] text-[#666]">TRUST</div>
                                        <div className={`text-lg font-bold ${currentScenario.emotionalShift.trust >= 0 ? 'text-[#00ff00]' : 'text-red-500'}`}>
                                            {currentScenario.emotionalShift.trust > 0 ? '+' : ''}{currentScenario.emotionalShift.trust}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] text-[#666]">SATISFACTION</div>
                                        <div className={`text-lg font-bold ${currentScenario.emotionalShift.satisfaction >= 0 ? 'text-[#00ff00]' : 'text-red-500'}`}>
                                            {currentScenario.emotionalShift.satisfaction > 0 ? '+' : ''}{currentScenario.emotionalShift.satisfaction}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SimulationResult, LifeStageResult, DialogueTurn, RelationshipHealth } from "@/types";
import { useSoundEngine } from "@/components/shared/SoundManager";

interface LifetimeViewerProps {
    simulation: SimulationResult;
    onComplete: () => void;
}

const STAGE_COLORS = {
    'The Spark': 'from-pink-500/20 to-purple-900/40',
    'The Bind': 'from-blue-500/20 to-indigo-900/40',
    'The Build': 'from-emerald-500/20 to-slate-900/40',
    'The Drift': 'from-orange-500/20 to-red-900/40',
    'The Legacy': 'from-amber-100/10 to-stone-900/40',
};

export default function LifetimeViewer({ simulation, onComplete }: LifetimeViewerProps) {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [dialogueIndex, setDialogueIndex] = useState(-1); // -1 start, 0+ dialogue
    const [showStageTitle, setShowStageTitle] = useState(true);
    const [currentMetrics, setCurrentMetrics] = useState<RelationshipHealth>({ connection: 50, passion: 80, stability: 30 });

    // Derived state
    const stage = simulation.lifeStages[currentStageIndex];
    const isFinished = currentStageIndex >= simulation.lifeStages.length;
    const { whoosh, messageSound, success } = useSoundEngine();

    // Auto-play logic
    useEffect(() => {
        if (isFinished) {
            setTimeout(onComplete, 2000);
            return;
        }

        // 1. Stage Title Card Phase
        if (showStageTitle) {
            whoosh();
            const timer = setTimeout(() => {
                setShowStageTitle(false);
                setDialogueIndex(0); // Start dialogue
            }, 3000); // 3s title card
            return () => clearTimeout(timer);
        }

        // 2. Dialogue Phase
        if (dialogueIndex >= 0 && dialogueIndex < stage.scenes[0].dialogue.length) {
            const turn = stage.scenes[0].dialogue[dialogueIndex];
            const readTime = Math.min(Math.max(turn.content.length * 50, 2000), 5000);

            messageSound();

            const timer = setTimeout(() => {
                setDialogueIndex(prev => prev + 1);
            }, readTime);
            return () => clearTimeout(timer);
        }

        // 3. Stage End / Transition Phase
        if (dialogueIndex >= stage.scenes[0].dialogue.length) {
            // Update metrics for next stage (visual smooth transition handled by state update)
            setCurrentMetrics(prev => ({
                connection: Math.max(0, Math.min(100, prev.connection + stage.healthDelta.connection)),
                passion: Math.max(0, Math.min(100, prev.passion + stage.healthDelta.passion)),
                stability: Math.max(0, Math.min(100, prev.stability + stage.healthDelta.stability)),
            }));

            const timer = setTimeout(() => {
                if (currentStageIndex < simulation.lifeStages.length - 1) {
                    setCurrentStageIndex(prev => prev + 1);
                    setDialogueIndex(-1);
                    setShowStageTitle(true);
                } else {
                    onComplete(); // Done
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [currentStageIndex, dialogueIndex, showStageTitle, isFinished, simulation.lifeStages.length, stage, onComplete, whoosh, messageSound]);

    if (!stage) return null;

    const bgGradient = STAGE_COLORS[stage.stageName as keyof typeof STAGE_COLORS] || 'from-gray-900 to-black';

    return (
        <div className={`relative w-full h-[80vh] flex flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black`}>
            {/* Dynamic Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-50 transition-colors duration-[2000ms]`} />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none" />

            {/* HUD: Relationship Health */}
            <div className="absolute top-4 left-4 right-4 flex justify-center space-x-8 z-20">
                <MetricBar label="Passion" value={currentMetrics.passion} color="text-rose-400" barColor="bg-rose-500" />
                <MetricBar label="Connection" value={currentMetrics.connection} color="text-emerald-400" barColor="bg-emerald-500" />
                <MetricBar label="Stability" value={currentMetrics.stability} color="text-blue-400" barColor="bg-blue-500" />
            </div>

            {/* Stage Title Card */}
            <AnimatePresence>
                {showStageTitle && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.8 }}
                        className="absolute z-30 text-center"
                    >
                        <h3 className="text-xl text-white/60 font-mono tracking-[0.3em] uppercase mb-2">{stage.ageRange}</h3>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl">{stage.stageName}</h1>
                        <p className="mt-4 text-white/80 max-w-lg mx-auto font-light text-lg italic">"{stage.scenes[0].title}"</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dialogue View */}
            {!showStageTitle && (
                <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col space-y-6">
                    {stage.scenes[0].dialogue.slice(0, dialogueIndex + 1).map((turn, i) => {
                        const isA = turn.speaker === 'A';
                        const isLast = i === dialogueIndex;

                        return (
                            <motion.div
                                key={`${stage.id}-${i}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${isA ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`
                                    max-w-[70%] p-4 rounded-2xl backdrop-blur-md shadow-xl border border-white/5
                                    ${isA
                                        ? 'bg-white/10 rounded-tl-none text-white'
                                        : 'bg-white/5 rounded-tr-none text-white/90'
                                    }
                                    ${isLast ? 'border-white/20 shadow-white/5' : ''}
                                `}>
                                    <p className="text-sm font-light leading-relaxed">{turn.content}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Cinematic Letterbox Bars */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-black z-40" />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-black z-40 flex items-center justify-center">
                <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase">
                    SIMULATION YEAR {parseInt(stage.ageRange) || "20XX"}
                </p>
            </div>
        </div>
    );
}

function MetricBar({ label, value, color, barColor }: any) {
    return (
        <div className="flex flex-col items-center w-24">
            <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${color}`}>{label}</span>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1 }}
                />
            </div>
        </div>
    );
}

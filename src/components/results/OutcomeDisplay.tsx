"use client";

import { motion } from "framer-motion";
import { SimulationResult } from "@/types";
import { useEffect, useState } from "react";

interface OutcomeDisplayProps {
    simulation: SimulationResult;
}

export default function OutcomeDisplay({ simulation }: OutcomeDisplayProps) {
    const { verdict, overallHealth, lifeStages } = simulation;
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setRevealed(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // Color logic based on score
    const scoreColor = verdict.compatibilityScore > 80 ? "text-emerald-400" : verdict.compatibilityScore > 50 ? "text-amber-400" : "text-rose-400";
    const borderColor = verdict.compatibilityScore > 80 ? "border-emerald-500" : verdict.compatibilityScore > 50 ? "border-amber-500" : "border-rose-500";

    return (
        <div className="w-full max-w-2xl mx-auto py-12 px-6 bg-black min-h-screen">

            {/* 1. Final Verdict Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className={`border ${borderColor} bg-white/5 p-8 text-center relative overflow-hidden mb-12`}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <h2 className="text-xs font-mono tracking-[0.4em] uppercase text-white/40 mb-4">LIFETIME VERDICT</h2>

                <h1 className={`text-4xl md:text-6xl font-black uppercase tracking-tight mb-2 ${scoreColor}`}>
                    {verdict.title}
                </h1>

                <div className="text-6xl font-thin text-white mb-6">
                    {verdict.compatibilityScore}%
                </div>

                <p className="text-sm text-white/70 italic max-w-md mx-auto leading-relaxed">
                    "{verdict.summary}"
                </p>
            </motion.div>

            {/* 2. Relationship Health Metrics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-4 mb-16"
            >
                <HealthMetric label="Passion" value={overallHealth.passion} color="bg-rose-500" />
                <HealthMetric label="Connection" value={overallHealth.connection} color="bg-emerald-500" />
                <HealthMetric label="Stability" value={overallHealth.stability} color="bg-blue-500" />
            </motion.div>

            {/* 3. The Life Story (Timeline) */}
            <div className="space-y-12 relative border-l border-white/10 ml-4 pl-8 pb-20">
                {lifeStages.map((stage, i) => (
                    <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (i * 0.2) }}
                        className="relative"
                    >
                        {/* Timeline Dot */}
                        <div className="absolute -left-[37px] top-1 w-3 h-3 bg-white/20 rounded-full border border-black" />

                        <div className="flex flex-col space-y-2">
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                {stage.ageRange} — {stage.stageName}
                            </span>
                            <h3 className="text-xl font-bold text-white">
                                "{stage.scenes[0].title}"
                            </h3>
                            <p className="text-sm text-white/60 leading-relaxed max-w-md">
                                {stage.summary}
                            </p>

                            {/* Small metrics delta */}
                            <div className="flex gap-2 mt-2">
                                <DeltaTag value={stage.healthDelta.passion} label="Passion" />
                                <DeltaTag value={stage.healthDelta.connection} label="Conn" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-center pt-8 border-t border-white/5"
            >
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-colors"
                >
                    Run Another Simulation
                </button>
            </motion.div>

        </div>
    );
}

function HealthMetric({ label, value, color }: any) {
    return (
        <div className="flex flex-col items-center p-4 bg-white/5 border border-white/5 rounded">
            <span className="text-[10px] uppercase tracking-widest text-white/50 mb-2">{label}</span>
            <div className="text-2xl font-bold text-white mb-2">{value}</div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

function DeltaTag({ value, label }: any) {
    if (value === 0) return null;
    const isPos = value > 0;
    return (
        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${isPos ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'}`}>
            {isPos ? '+' : ''}{value} {label}
        </span>
    );
}

"use client";

import { motion } from "framer-motion";
import { SimulationResult, OUTCOME_NAMES, OutcomeType } from "@/types";
import TimelineSummary from "./TimelineSummary";
import ShareButtons from "./ShareButtons";
import { useEffect, useState, useMemo } from "react";

interface OutcomeDisplayProps {
    simulation: SimulationResult;
}

function Confetti() {
    const pieces = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: ["#00ff00", "#00e5ff", "#ffcc00", "#ff4081", "#00ff00"][Math.floor(Math.random() * 5)],
        delay: Math.random() * 2,
        size: 4 + Math.random() * 8,
    })), []);

    return (
        <>
            {pieces.map((p) => (
                <div
                    key={p.id}
                    className="confetti-piece"
                    style={{
                        left: `${p.left}%`,
                        backgroundColor: p.color,
                        width: p.size,
                        height: p.size,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                />
            ))}
        </>
    );
}

function AnimatedScore({ value }: { value: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 1500;
        const steps = 60;
        const stepValue = value / steps;
        let current = 0;
        const interval = setInterval(() => {
            current += stepValue;
            if (current >= value) {
                setCount(value);
                clearInterval(interval);
            } else {
                setCount(Math.round(current));
            }
        }, duration / steps);
        return () => clearInterval(interval);
    }, [value]);

    return (
        <span className="text-4xl md:text-6xl font-bold count-up" style={{
            textShadow: "0 0 30px rgba(0,255,0,0.5)",
        }}>
            {count}%
        </span>
    );
}

export default function OutcomeDisplay({ simulation }: OutcomeDisplayProps) {
    const isPositive = simulation.outcome.startsWith("success_"); // Use compatibility prediction or legacy outcome
    const [revealed, setRevealed] = useState(false);

    // Adapt to new structure
    const outcomeName = OUTCOME_NAMES[simulation.outcome as OutcomeType] || simulation.outcome;
    const score = simulation.compatibility?.overallScore ?? 50;
    const strengths = simulation.compatibility?.strengths ?? ["Resilience", "Deep Conversation"];
    const challenges = simulation.compatibility?.challenges ?? ["Values alignment"];

    useEffect(() => {
        const timer = setTimeout(() => setRevealed(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-10 relative">
            {/* Confetti for positive outcomes */}
            {isPositive && revealed && <Confetti />}

            {/* Dramatic reveal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="text-center"
            >
                <div className="text-xs tracking-[0.3em] text-[#00ff00]/40 mb-3">FINAL_PREDICTION</div>

                <h1
                    className="text-3xl md:text-5xl font-bold mb-4"
                    style={{ textShadow: `0 0 40px ${isPositive ? "rgba(0,255,0,0.5)" : "rgba(255,149,0,0.5)"}` }}
                >
                    {outcomeName}
                </h1>

                <div className={`inline-block px-4 py-1 border ${isPositive ? "border-[#00ff00] text-[#00ff00]" : "border-[#ff9500] text-[#ff9500]"} text-xs tracking-[0.3em]`}>
                    {isPositive ? "POSITIVE TRAJECTORY" : "DIVERGENT TRAJECTORY"}
                </div>
            </motion.div>

            {/* Compatibility Score */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center py-8"
            >
                <div className="text-xs tracking-[0.3em] text-[#00ff00]/40 mb-4">COMPATIBILITY_INDEX</div>
                <AnimatedScore value={score} />
            </motion.div>

            {/* Insights / Strengths / Challenges */}
            <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="border border-[#003300] bg-[#001100]/50 p-6"
                >
                    <h2 className="text-xs tracking-[0.2em] text-[#00ff00] mb-4 uppercase">Key Strengths</h2>
                    <ul className="space-y-3">
                        {strengths.map((s, i) => (
                            <li key={i} className="text-sm text-[#ccc] flex items-start gap-2">
                                <span className="text-[#00ff00]">✓</span> {s}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="border border-[#330000] bg-[#110000]/50 p-6"
                >
                    <h2 className="text-xs tracking-[0.2em] text-[#ff4400] mb-4 uppercase">Risk Factors</h2>
                    <ul className="space-y-3">
                        {challenges.map((c, i) => (
                            <li key={i} className="text-sm text-[#ccc] flex items-start gap-2">
                                <span className="text-[#ff4400]">!</span> {c}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            {/* Timeline */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                <h2 className="text-sm tracking-[0.2em] text-[#00ff00]/50 mb-4 text-center">SCENARIO_ANALYSIS</h2>
                <TimelineSummary timeline={simulation.timeline} />
            </motion.div>

            {/* Share */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-center space-y-4"
            >
                <h2 className="text-sm tracking-[0.2em] text-[#00ff00]/50">TRANSMIT_RESULTS</h2>
                <ShareButtons outcomeName={outcomeName} />
            </motion.div>

            {/* Disclaimer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="border border-[#003300] p-4 text-xs text-[#00ff00]/30 text-center"
            >
                <p>AI Prediction Engine v2.0 - Experimental Model.</p>
                <p>Results are probabilistic, not deterministic.</p>
            </motion.div>
        </div>
    );
}

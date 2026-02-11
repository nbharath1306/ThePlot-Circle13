"use client";

import { motion } from "framer-motion";
import { SimulationResult } from "@/types";
import TimelineSummary from "./TimelineSummary";
import ShareButtons from "./ShareButtons";

interface OutcomeDisplayProps {
    simulation: SimulationResult;
}

export default function OutcomeDisplay({ simulation }: OutcomeDisplayProps) {
    const isPositive = simulation.outcome.startsWith("success_");

    return (
        <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-10">
            {/* Outcome Headline */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="text-xs tracking-[0.3em] text-[#00ff00]/40 mb-3">SIMULATION_COMPLETE</div>
                <h1
                    className="text-3xl md:text-5xl font-bold mb-4"
                    style={{ textShadow: `0 0 30px ${isPositive ? "rgba(0,255,0,0.5)" : "rgba(255,149,0,0.5)"}` }}
                >
                    {simulation.outcomeName}
                </h1>
                <div className={`inline-block px-4 py-1 border ${isPositive ? "border-[#00ff00] text-[#00ff00]" : "border-[#ff9500] text-[#ff9500]"} text-xs tracking-[0.3em]`}>
                    {isPositive ? "POSITIVE TRAJECTORY" : "DIVERGENT TRAJECTORY"}
                </div>
            </motion.div>

            {/* Insights */}
            <div className="border border-[#003300] p-6">
                <h2 className="text-sm tracking-[0.2em] text-[#00ff00]/50 mb-4">COMPATIBILITY_INSIGHTS</h2>
                <ul className="space-y-2">
                    {simulation.insights.map((insight, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 * i }}
                            className="text-sm text-[#00ff00]/70"
                        >
                            <span className="text-[#00ff00]/30 mr-2">▸</span>
                            {insight}
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* Timeline */}
            <div>
                <h2 className="text-sm tracking-[0.2em] text-[#00ff00]/50 mb-4">TIMELINE_ARCHIVE</h2>
                <TimelineSummary timeline={simulation.timeline} />
            </div>

            {/* Share */}
            <div className="text-center space-y-4">
                <h2 className="text-sm tracking-[0.2em] text-[#00ff00]/50">TRANSMIT_RESULTS</h2>
                <ShareButtons outcomeName={simulation.outcomeName} />
            </div>

            {/* Mental Health Resources */}
            <div className="border border-[#003300] p-4 text-xs text-[#00ff00]/30 text-center">
                <p className="font-bold mb-1">If you have real relationship concerns:</p>
                <p>National Relationship Helpline: 1-800-799-7233 | Mental Health: samhsa.gov</p>
                <p className="mt-2 italic">This was entertainment only. Talk to your partner, not just AI.</p>
            </div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { EmotionalState } from "@/types";

interface EmotionalMetricsProps {
    state: EmotionalState | undefined;
}

const metrics = [
    { key: "trust" as const, label: "TRUST", color: "#00ff00" },
    { key: "satisfaction" as const, label: "SATISFACTION", color: "#00ddff" },
    { key: "commitment" as const, label: "COMMITMENT", color: "#ff9500" },
];

export default function EmotionalMetrics({ state }: EmotionalMetricsProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-xs tracking-[0.3em] text-[#00ff00]/40 mb-3">EMOTIONAL_STATE</h3>
            {metrics.map((m) => {
                const value = state ? state[m.key] : 50;
                return (
                    <div key={m.key}>
                        <div className="flex justify-between text-xs mb-1">
                            <span style={{ color: `${m.color}99` }}>{m.label}</span>
                            <span style={{ color: m.color }}>{value}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#111] border border-[#222]">
                            <motion.div
                                className="h-full"
                                style={{ backgroundColor: m.color }}
                                animate={{ width: `${value}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

"use client";

import { motion } from "framer-motion";

interface EmotionalMetricsProps {
    state?: {
        year: number;
        trust: number;
        satisfaction: number;
        commitment: number;
    };
}

function barColor(value: number, type: string): string {
    if (type === "trust") return value >= 80 ? "#00e5ff" : value >= 50 ? "#00ff00" : value >= 30 ? "#ff9500" : "#ff3333";
    if (type === "satisfaction") return value >= 80 ? "#00e5ff" : value >= 50 ? "#0088ff" : value >= 30 ? "#ff9500" : "#ff3333";
    return value >= 80 ? "#ffcc00" : value >= 50 ? "#ff8800" : value >= 30 ? "#ff9500" : "#ff3333";
}

const metrics: { key: "trust" | "satisfaction" | "commitment"; label: string; gradient: string }[] = [
    { key: "trust", label: "TRUST", gradient: "bar-gradient-trust" },
    { key: "satisfaction", label: "SATISFACTION", gradient: "bar-gradient-satisfaction" },
    { key: "commitment", label: "COMMITMENT", gradient: "bar-gradient-commitment" },
];

export default function EmotionalMetrics({ state }: EmotionalMetricsProps) {
    if (!state) {
        return (
            <div className="text-xs text-[#003300] animate-pulse tracking-widest">
                AWAITING DATA...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xs tracking-[0.3em] text-[#00ff00]/50 border-b border-[#003300] pb-2">
                EMOTIONAL_STATE
            </h3>

            {metrics.map(({ key, label }) => {
                const value = state[key];
                const color = barColor(value, key);
                const isLow = value < 40;
                const isMax = value >= 100;

                return (
                    <div key={key} className={`space-y-1 ${isLow ? "warning-pulse" : ""} ${isMax ? "sparkle" : ""}`}>
                        <div className="flex justify-between text-xs">
                            <span style={{ color }}>{label}</span>
                            <motion.span
                                key={value}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="font-bold"
                                style={{ color }}
                            >
                                {value}%
                            </motion.span>
                        </div>
                        <div className="w-full h-2 bg-[#001100] overflow-hidden relative">
                            <motion.div
                                className="h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(value, 100)}%` }}
                                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                                style={{ backgroundColor: color }}
                            />
                            {/* Glow effect on high values */}
                            {value >= 80 && (
                                <motion.div
                                    className="absolute inset-y-0 right-0 w-8"
                                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{
                                        background: `linear-gradient(90deg, transparent, ${color}40)`,
                                        right: `${100 - Math.min(value, 100)}%`,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Overall status indicator */}
            <div className="pt-4 border-t border-[#003300]">
                <div className="text-xs text-[#003300] tracking-widest">
                    STABILITY_INDEX
                </div>
                <div className="mt-1 text-sm font-bold" style={{
                    color: barColor(Math.round((state.trust + state.satisfaction + state.commitment) / 3), "trust"),
                }}>
                    {Math.round((state.trust + state.satisfaction + state.commitment) / 3)}%
                </div>
            </div>
        </div>
    );
}

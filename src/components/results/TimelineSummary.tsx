"use client";

import { motion } from "framer-motion";
import { YearEvent } from "@/types";

interface TimelineSummaryProps {
    timeline: YearEvent[];
}

export default function TimelineSummary({ timeline }: TimelineSummaryProps) {
    return (
        <div className="relative">
            {/* Vertical timeline connector on desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#003300] via-[#00ff00]/30 to-[#003300]" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeline.map((year, i) => {
                    const isConflict = year.emotionalShift.trust < 0 || year.emotionalShift.satisfaction < -5;
                    const borderColor = isConflict ? "border-[#ff9500]/30 hover:border-[#ff9500]/60" : "border-[#003300] hover:border-[#00ff00]/40";

                    return (
                        <motion.div
                            key={year.year}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className={`border ${borderColor} p-4 bg-[#000800]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,0,0.1)]`}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`text-xs tracking-[0.3em] ${isConflict ? "text-[#ff9500]/50" : "text-[#00ff00]/50"}`}>
                                    YEAR {String(year.year).padStart(2, "0")}
                                </span>
                                {isConflict && <span className="text-xs text-[#ff9500]/40">⚡</span>}
                            </div>
                            <div className="space-y-1.5">
                                {year.events.map((event, j) => (
                                    <div key={j} className="text-xs text-[#00ff00]/50 flex items-start gap-1.5">
                                        <span className="text-[#003300] flex-shrink-0">›</span>
                                        <span>{event}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Mini emotional delta */}
                            <div className="mt-3 pt-2 border-t border-[#001100] flex gap-3 text-xs">
                                <span className={year.emotionalShift.trust >= 0 ? "text-[#00ff00]/30" : "text-[#ff9500]/30"}>
                                    T:{year.emotionalShift.trust > 0 ? "+" : ""}{year.emotionalShift.trust}
                                </span>
                                <span className={year.emotionalShift.satisfaction >= 0 ? "text-[#00ff00]/30" : "text-[#ff9500]/30"}>
                                    S:{year.emotionalShift.satisfaction > 0 ? "+" : ""}{year.emotionalShift.satisfaction}
                                </span>
                                <span className={year.emotionalShift.commitment >= 0 ? "text-[#00ff00]/30" : "text-[#ff9500]/30"}>
                                    C:{year.emotionalShift.commitment > 0 ? "+" : ""}{year.emotionalShift.commitment}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

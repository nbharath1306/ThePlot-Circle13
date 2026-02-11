"use client";

import { YearEvent } from "@/types";
import { motion } from "framer-motion";

interface TimelineSummaryProps {
    timeline: YearEvent[];
}

export default function TimelineSummary({ timeline }: TimelineSummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeline.map((year, i) => (
                <motion.div
                    key={year.year}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="border border-[#003300] p-4 hover:border-[#00ff00]/40 transition-colors"
                >
                    <div className="text-xs text-[#00ff00]/40 mb-2 tracking-widest">YEAR 0{year.year}</div>
                    <ul className="space-y-1.5 text-sm">
                        {year.events.map((event, j) => (
                            <li key={j} className="text-[#00ff00]/70">
                                <span className="text-[#003300] mr-1.5">{">"}</span>
                                {event}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            ))}
        </div>
    );
}

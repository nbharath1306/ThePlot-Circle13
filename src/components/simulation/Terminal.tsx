"use client";

import { useCallback, useEffect, useState } from "react";
import { SimulationResult } from "@/types";
import YearCounter from "./YearCounter";
import EventDisplay from "./EventDisplay";
import EmotionalMetrics from "./EmotionalMetrics";

interface TerminalProps {
    simulation: SimulationResult;
    onComplete: () => void;
}

export default function Terminal({ simulation, onComplete }: TerminalProps) {
    const [currentYear, setCurrentYear] = useState(0); // 0 = boot sequence
    const [bootDone, setBootDone] = useState(false);

    // Boot sequence
    useEffect(() => {
        const timer = setTimeout(() => {
            setBootDone(true);
            setCurrentYear(1);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleYearComplete = useCallback(() => {
        if (currentYear >= 7) {
            setTimeout(onComplete, 2000);
        } else {
            // Dramatic pause between years
            setTimeout(() => setCurrentYear((prev) => prev + 1), 1500);
        }
    }, [currentYear, onComplete]);

    const yearData = simulation.timeline.find((y) => y.year === currentYear);
    const emotionalState = simulation.emotionalMetrics.find((e) => e.year === currentYear);

    return (
        <div className="w-full max-w-5xl mx-auto border border-[#00ff00] bg-black min-h-[80vh] flex flex-col shadow-[0_0_30px_rgba(0,255,0,0.15)]">
            {/* Terminal Header */}
            <div className="border-b border-[#00ff00] px-4 py-2 flex justify-between text-xs text-[#00ff00]/50 tracking-widest">
                <span>SIMULATION_VIEWER.exe</span>
                <span>CPU: 98% | MEM: 2.4GB</span>
            </div>

            {!bootDone ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="animate-pulse text-lg tracking-[0.3em]">INITIALIZING SIMULATION CORE...</p>
                        <p className="text-xs text-[#003300] mt-2">LOADING PERSONALITY MATRICES</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col md:flex-row">
                    {/* Main Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <YearCounter year={currentYear} />
                        {yearData && (
                            <EventDisplay
                                events={yearData.events}
                                onAllDisplayed={handleYearComplete}
                            />
                        )}
                    </div>

                    {/* Sidebar: Emotional Metrics */}
                    <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-[#003300] p-4">
                        <EmotionalMetrics state={emotionalState} />
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="border-t border-[#003300] px-4 py-2 flex justify-between items-center text-xs text-[#003300]">
                <span>YEAR {currentYear}/7</span>
                {bootDone && currentYear < 7 && (
                    <button
                        onClick={onComplete}
                        className="text-[#003300] hover:text-[#00ff00]/50 transition-colors"
                    >
                        [SKIP]
                    </button>
                )}
            </div>
        </div>
    );
}

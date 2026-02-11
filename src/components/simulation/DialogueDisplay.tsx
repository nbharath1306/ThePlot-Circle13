"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DialogueTurn } from "@/types";
import { useSoundEngine } from "@/components/shared/SoundManager";

interface DialogueDisplayProps {
    transcript: DialogueTurn[];
    onComplete: () => void;
}

export default function DialogueDisplay({ transcript, onComplete }: DialogueDisplayProps) {
    const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
    const { typeSound, messageSound } = useSoundEngine();

    // Auto-advance logic could go here, but for now we render them one by one
    // or we render the whole list and animate entry? 
    // Let's do sequential revelation.

    useEffect(() => {
        if (currentTurnIndex < transcript.length) {
            const turn = transcript[currentTurnIndex];
            // Calculate read time based on length, min 1.5s, max 4s
            const readTime = Math.min(Math.max(turn.content.length * 50, 1500), 4000);

            messageSound();

            const timer = setTimeout(() => {
                setCurrentTurnIndex(prev => prev + 1);
            }, readTime);

            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(onComplete, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentTurnIndex, transcript.length, onComplete, messageSound]);

    return (
        <div className="flex flex-col space-y-4 p-4 w-full max-w-4xl mx-auto">
            {transcript.slice(0, currentTurnIndex + 1).map((turn, i) => {
                const isA = turn.speaker === 'A';
                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: isA ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${isA ? 'justify-start' : 'justify-end'} w-full`}
                    >
                        <div className={`
                            max-w-[80%] p-3 text-sm md:text-base border rounded-sm relative
                            ${isA
                                ? 'border-[#00ff00]/30 bg-[#001100] text-[#00ff00]/90 rounded-tl-none'
                                : 'border-[#00e5ff]/30 bg-[#000811] text-[#00e5ff]/90 rounded-tr-none'
                            }
                        `}>
                            <div className="text-[10px] tracking-widest opacity-50 mb-1 font-mono uppercase">
                                {isA ? 'AGENT_A' : 'AGENT_B'}
                            </div>
                            <p className="leading-relaxed font-sans">{turn.content}</p>

                            {/* Scanning line effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[5px] w-full animate-scan opacity-20 pointer-events-none" />
                        </div>
                    </motion.div>
                );
            })}

            {/* Typing indicator if active */}
            {currentTurnIndex < transcript.length && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex ${transcript[currentTurnIndex].speaker === 'A' ? 'justify-start' : 'justify-end'}`}
                >
                    <div className="text-xs text-white/30 font-mono animate-pulse">
                        {transcript[currentTurnIndex].speaker === 'A' ? 'A_PROCESSING...' : 'B_PROCESSING...'}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "../ui/Button";

interface ChatMessageProps {
    message: {
        speaker: string;
        text: string;
        emotion?: string;
        internal_thought?: string;
    };
    isLeft: boolean;
}

export default function ChatMessage({ message, isLeft }: ChatMessageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn("flex w-full mb-8", isLeft ? "justify-start" : "justify-end")}
        >
            <div
                className={cn(
                    "max-w-[90%] md:max-w-[80%] p-6 relative border transition-all duration-300 group",
                    isLeft
                        ? "bg-gray-900/80 border-l-4 border-l-blue-500 border-y-transparent border-r-transparent hover:border-r-white/10"
                        : "bg-gray-900/80 border-r-4 border-r-purple-500 border-y-transparent border-l-transparent hover:border-l-white/10"
                )}
            >
                {/* Tech Deco Elements */}
                <div className={cn("absolute top-0 w-2 h-2 border-t border-white/20", isLeft ? "left-0 border-l" : "right-0 border-r")} />
                <div className={cn("absolute bottom-0 w-2 h-2 border-b border-white/20", isLeft ? "left-0 border-l" : "right-0 border-r")} />

                <div className="flex justify-between items-baseline mb-3 border-b border-white/5 pb-2">
                    <span className={cn(
                        "text-xs font-mono font-bold tracking-[0.2em] uppercase",
                        isLeft ? "text-blue-400" : "text-purple-400"
                    )}>
                        {message.speaker}
                    </span>
                    {message.emotion && (
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest border border-white/10 px-2 py-0.5">
                            STATUS: {message.emotion}
                        </span>
                    )}
                </div>

                <p className="text-sm md:text-base leading-relaxed text-gray-200 font-sans tracking-wide">
                    {message.text}
                </p>

                {message.internal_thought && (
                    <div className="mt-4 pt-4 border-t border-white/5 relative">
                        <div className="absolute top-0 left-0 text-[10px] text-gray-600 font-mono -translate-y-1/2 bg-gray-900 px-2">
                            INTERNAL_LOG
                        </div>
                        <p className="text-xs text-gray-400 font-mono italic leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                            {`>> ${message.internal_thought}`}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

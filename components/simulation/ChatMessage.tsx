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
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn("flex w-full mb-6", isLeft ? "justify-start" : "justify-end")}
        >
            <div
                className={cn(
                    "max-w-[85%] sm:max-w-[75%] rounded-3xl p-5 relative shadow-lg backdrop-blur-sm",
                    isLeft
                        ? "bg-gray-800/80 rounded-tl-none text-white border border-white/5"
                        : "bg-primary/20 rounded-tr-none text-white border border-primary/20"
                )}
            >
                <div className="flex justify-between items-center mb-2">
                    <span className={cn("text-xs font-bold tracking-wider uppercase opacity-70", isLeft ? "text-blue-300" : "text-pink-300")}>
                        {message.speaker}
                    </span>
                    {message.emotion && (
                        <span className="text-xs py-0.5 px-2 rounded-full bg-black/20 text-white/70">
                            {message.emotion}
                        </span>
                    )}
                </div>
                <p className="text-base md:text-lg leading-relaxed font-sans">{message.text}</p>

                {message.internal_thought && (
                    <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400 font-mono italic flex items-start gap-2">
                        <span>💭</span>
                        <span>{message.internal_thought}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

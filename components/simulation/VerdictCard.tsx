"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";

interface VerdictCardProps {
    label: string;
    survival_probability: number;
    verdict: string;
    vibe: string;
    agentA: string;
    agentB: string;
    onClose: () => void;
}

export default function VerdictCard({
    label,
    survival_probability,
    verdict,
    vibe,
    agentA,
    agentB,
    onClose,
}: VerdictCardProps) {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "ThePlot - Our Relationship Verdict",
                    text: `${agentA} & ${agentB}: ${label} | ${survival_probability}% survival chance`,
                    url: window.location.origin,
                });
            } catch (err) {
                console.log("Share cancelled");
            }
        } else {
            alert("Screenshot this and share! 📸");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20 border-2 border-purple-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />

                <div className="text-center space-y-6">
                    <div className="text-6xl mb-4">{vibe}</div>

                    <div>
                        <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-2">
                            The Verdict
                        </h2>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                            {label}
                        </h1>
                    </div>

                    <div className="flex justify-center items-baseline gap-2">
                        <span className="text-5xl font-bold text-white">{survival_probability}%</span>
                        <span className="text-gray-400 text-sm">survival chance</span>
                    </div>

                    <p className="text-gray-300 italic text-lg leading-relaxed">
                        "{verdict}"
                    </p>

                    <div className="pt-4 border-t border-white/10 text-xs text-gray-500">
                        {agentA} × {agentB}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleShare}
                            className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
                        >
                            Share 📸
                        </Button>
                        <Button onClick={onClose} variant="ghost" className="flex-1">
                            Close
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

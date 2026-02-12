"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function OraclePage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Aurora Background */}
            <div className="aurora-bg fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="aurora-blob aurora-1" />
                <div className="aurora-blob aurora-2" />
                <div className="aurora-blob aurora-3" />
            </div>

            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay z-10" />

            <div className="max-w-4xl w-full relative z-20">
                <div className="glass-card rounded-3xl p-12 text-center border-t border-white/10 shadow-2xl relative overflow-hidden">

                    {/* Glowing Orb */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative z-10 space-y-12">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1 }}
                                className="text-8xl mb-8 inline-block filter drop-shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse"
                            >
                                🔮
                            </motion.div>

                            <h1 className="text-6xl md:text-8xl font-bold font-display tracking-tighter text-white">
                                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Oracle</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                                A predictive simulation engine for your relationship. <br />
                                <span className="text-white font-medium">See the next 10 years in 10 minutes.</span>
                            </p>
                        </div>

                        {/* Timeline Grid */}
                        <div className="grid md:grid-cols-4 gap-4 text-left">
                            {[
                                { year: "Year 1", title: "Moving In", icon: "🏠" },
                                { year: "Year 3", title: "Career Conflict", icon: "💼" },
                                { year: "Year 5", title: "Financial Crisis", icon: "💰" },
                                { year: "Year 10", title: "Legacy", icon: "🌅" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="glass p-6 rounded-2xl hover:bg-white/5 transition-colors border border-white/5"
                                >
                                    <div className="text-2xl mb-2">{item.icon}</div>
                                    <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-1">{item.year}</div>
                                    <div className="font-bold text-gray-200">{item.title}</div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-8 flex flex-col md:flex-row gap-6 justify-center items-center">
                            <Button
                                onClick={() => router.push("/oracle/assess")}
                                className="bg-white text-black hover:bg-gray-200 px-12 py-6 text-xl font-bold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-500 transform hover:-translate-y-1"
                            >
                                Initialize Simulation →
                            </Button>
                            <button
                                onClick={() => router.push("/")}
                                className="text-gray-400 hover:text-white font-mono uppercase tracking-widest text-sm transition-colors border-b border-transparent hover:border-white pb-1"
                            >
                                Abort Protocol
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

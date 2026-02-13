"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProposalPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProposalContent />
        </Suspense>
    );
}

function ProposalContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const name = searchParams.get("to") || "My Love"; // Default name

    const [phase, setPhase] = useState<"loading" | "intro" | "questions" | "proposal" | "accepted">("loading");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
    const [attempts, setAttempts] = useState(0);
    const [mascotMessage, setMascotMessage] = useState("");
    const [showMascot, setShowMascot] = useState(false);

    // Glitch effect state
    const [glitch, setGlitch] = useState(false);

    const questions = [
        "Are you ready to initiate the sequence?",
        "Do you believe in destiny?",
        "Is your heart racing right now?",
        "Do you trust the algorithm?",
    ];

    const mascotTaunts = [
        "Don't even think about it.",
        "That button is forbidden.",
        "Error 404: 'No' not found.",
        "I'm watching you...",
        "Resistance is futile.",
        "Just click YES already!",
        "Are you trying to break my heart?",
    ];

    useEffect(() => {
        // Simulate boot sequence
        const timer = setTimeout(() => {
            setPhase("intro");
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleStart = () => {
        setPhase("questions");
    };

    const handleAnswer = (answer: boolean) => {
        if (answer) {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            } else {
                setPhase("proposal");
            }
        } else {
            // Force yes logic even on questions? User said "no option to click no".
            // Let's visual shake and force proceed or just don't allow click.
            triggerGlitch();
            setMascotMessage("Incorrect answer. Try again.");
            setShowMascot(true);
            setTimeout(() => setShowMascot(false), 2000);
        }
    };

    const moveNoButton = () => {
        // Generate random positions but keep within viewing area approx
        const x = Math.floor(Math.random() * 600 - 300);
        const y = Math.floor(Math.random() * 600 - 300);
        setNoBtnPos({ x, y });
        setAttempts(prev => prev + 1);

        // Trigger mascot
        if (attempts % 2 === 0) {
            setMascotMessage(mascotTaunts[Math.floor(Math.random() * mascotTaunts.length)]);
            setShowMascot(true);
            setTimeout(() => setShowMascot(false), 2000);
        }
    };

    const triggerGlitch = () => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 300);
    };

    const handleAccept = () => {
        setPhase("accepted");
    };

    return (
        <main className={`min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center ${glitch ? "animate-pulse" : ""}`}>

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,0,255,0.1),transparent_70%)]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
            </div>

            <AnimatePresence mode="wait">

                {/* LOADING PHASE */}
                {phase === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
                        className="text-center font-mono"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-t-2 border-l-2 border-purple-500 rounded-full mx-auto mb-4"
                        />
                        <p className="text-purple-400 tracking-[0.3em] animate-pulse">ESTABLISHING UPLINK...</p>
                    </motion.div>
                )}

                {/* INTRO PHASE */}
                {phase === "intro" && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-md px-6 text-center z-10"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            INCOMING REQUEST
                        </h1>
                        <p className="text-gray-300 mb-8 font-light text-lg">
                            A heavily encrypted romantic payload has been targeted at your coordinates.
                        </p>
                        <button
                            onClick={handleStart}
                            className="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                        >
                            <span className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl group-hover:bg-purple-500/40 transition-all" />
                            <span className="relative flex items-center gap-2 font-mono uppercase tracking-widest text-sm">
                                Decrypt Message <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </button>

                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const name = prompt("Who is this proposal for?");
                                    if (name) {
                                        const url = `${window.location.origin}/proposal?to=${encodeURIComponent(name)}`;
                                        navigator.clipboard.writeText(url);
                                        alert("Link copied to clipboard! Send it to them.");
                                    }
                                }}
                                className="text-xs text-white/20 hover:text-white/50 transition-colors uppercase tracking-widest"
                            >
                                Create Custom Link
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* QUESTIONS PHASE */}
                {phase === "questions" && (
                    <motion.div
                        key="questions"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="max-w-2xl px-6 text-center z-10 w-full"
                    >
                        <div className="mb-8 font-mono text-purple-500 text-sm tracking-widest">
                            QUERY {currentQuestion + 1}/{questions.length}
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-12 leading-tight">
                            {questions[currentQuestion]}
                        </h2>

                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => handleAnswer(true)}
                                className="w-full md:w-auto px-12 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                            >
                                YES
                            </button>
                            <button
                                // For questions, standard no behavior but with punishment
                                onClick={() => handleAnswer(false)}
                                className="w-full md:w-auto px-12 py-4 bg-transparent border border-white/20 hover:bg-white/5 rounded-xl font-bold text-lg text-gray-400 transition-all"
                            >
                                NO
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* PROPOSAL PHASE */}
                {phase === "proposal" && (
                    <motion.div
                        key="proposal"
                        className="absolute inset-0 flex flex-col items-center justify-center z-20 overflow-hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="text-center px-4"
                        >
                            <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                                Will You Be My Valentine, {name}?
                            </h1>

                            <div className="relative h-64 w-full max-w-lg mx-auto flex items-center justify-center gap-8">
                                <motion.button
                                    onClick={handleAccept}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="z-50 px-12 py-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl font-black text-2xl shadow-[0_0_50px_rgba(236,72,153,0.4)] border border-white/20 hover:border-white/50 transition-all"
                                >
                                    YES! 💖
                                </motion.button>

                                {attempts > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="absolute left-10 md:left-20 top-1/2 -translate-y-1/2 text-4xl hidden md:block"
                                    >
                                        👉
                                    </motion.div>
                                )}

                                {attempts > 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="absolute right-10 md:right-20 top-1/2 -translate-y-1/2 text-4xl hidden md:block"
                                    >
                                        👈
                                    </motion.div>
                                )}

                                <motion.button
                                    animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                                    onMouseEnter={moveNoButton}
                                    onClick={moveNoButton} // Touch devices support
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="absolute px-8 py-4 bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-xl font-medium text-gray-400"
                                >
                                    No thanks
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Mascot Overlay */}
                        <AnimatePresence>
                            {showMascot && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50, x: 50 }}
                                    animate={{ opacity: 1, y: 0, x: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="fixed bottom-10 right-10 flex items-end gap-4 z-50 max-w-[200px]"
                                >
                                    <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl rounded-br-none border border-white/20 text-sm font-mono text-purple-200 shadow-xl">
                                        {mascotMessage}
                                    </div>
                                    <div className="text-4xl">🤖</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ACCEPTED PHASE */}
                {phase === "accepted" && (
                    <motion.div
                        key="accepted"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center z-30"
                    >
                        <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-pulse">
                            MATCH CONFIRMED
                        </h1>
                        <p className="mt-8 text-2xl text-white/80 font-mono">
                            The universe has spoken.
                        </p>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="mt-12 text-6xl"
                        >
                            🎉💘💍
                        </motion.div>

                        <ConfettiParticles />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

function ConfettiParticles() {
    const [particles, setParticles] = useState<{ id: number, x: number, y: number, color: string, duration: number }[]>([]);

    useEffect(() => {
        const colors = ['bg-red-500', 'bg-pink-500', 'bg-purple-500', 'bg-white'];
        const newParticles = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 1000 - 500,
            y: Math.random() * 1000 - 500,
            color: colors[Math.floor(Math.random() * colors.length)],
            duration: Math.random() * 3 + 2
        }));
        setParticles(newParticles);
    }, []);

    return (
        <>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                        scale: 0
                    }}
                    animate={{
                        x: p.x,
                        y: p.y,
                        opacity: 0,
                        rotate: 360,
                        scale: 1.5
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                    className={`fixed top-1/2 left-1/2 w-4 h-4 rounded-full ${p.color}`}
                />
            ))}
        </>
    );
}

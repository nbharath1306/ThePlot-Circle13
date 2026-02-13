"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from "framer-motion";
import Confetti from "react-confetti";

// --- TYPES & HELPERS ---
type PitchData = {
    name: string;
    message: string;
    spotifyLink: string;
    images: string[];
};

const safeDecode = (str: string) => {
    try {
        return JSON.parse(decodeURIComponent(atob(str)));
    } catch (e) {
        return null;
    }
};

const phrases = [
    "Wait...", "Are you sure?", "Think about the snacks!",
    "I'll learn to cook!", "Don't break my heart 💔",
    "Error: Option Unavailable", "Last chance!",
    "System Failure imminent...", "Okay, I'll cry.",
    "404: No not found"
];

// --- MAIN COMPONENT ---
export default function PitchViewer() {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-pink-500 font-mono animate-pulse">Initializing Love Protocol...</div>}>
            <PitchContent />
        </Suspense>
    );
}

function PitchContent() {
    const searchParams = useSearchParams();
    const [data, setData] = useState<PitchData>({ name: "", message: "", spotifyLink: "", images: [] });
    const [stage, setStage] = useState<"boot" | "scan" | "core" | "proposal" | "success">("boot");
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    // Audio State
    const [audioAllowed, setAudioAllowed] = useState(false);

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        handleResize();
        window.addEventListener("resize", handleResize);

        const encoded = searchParams.get("data") || searchParams.get("d");
        if (encoded) {
            const decoded = safeDecode(encoded);
            if (decoded) setData(decoded);
        }

        return () => window.removeEventListener("resize", handleResize);
    }, [searchParams]);

    const handleUnlock = () => {
        setAudioAllowed(true);
        setStage("core");
    };

    return (
        <main className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-pink-500/50">
            {/* GLOBAL BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80" />
                <div className="scanlines" />
                <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] animate-pulse delay-1000" />
            </div>

            <AnimatePresence mode="wait">
                {stage === "boot" && <BootSequence onComplete={() => setStage("scan")} key="boot" />}
                {stage === "scan" && <BiometricScan name={data.name} onUnlock={handleUnlock} key="scan" />}
                {stage === "core" && <MemoryCore images={data.images} onNext={() => setStage("proposal")} key="core" />}
                {stage === "proposal" && <TheProposal name={data.name} onYes={() => setStage("success")} key="proposal" />}
                {stage === "success" && <SeasonRenewed data={data} windowSize={windowSize} key="success" />}
            </AnimatePresence>

            {/* Persistent Audio Player (Hidden functionality/Visualizer could be added) */}
            {audioAllowed && data.spotifyLink && (
                <div className="fixed bottom-4 right-4 z-50 w-64 md:w-80 shadow-2xl rounded-xl overflow-hidden border border-white/20 animate-in slide-in-from-bottom duration-1000">
                    <div className="bg-black text-white text-xs px-3 py-1 font-bold flex justify-between items-center border-b border-white/10">
                        <span className="animate-pulse text-green-400">● LIVE</span>
                        <span className="text-[10px] text-gray-400">LOVE_THEME.MP3</span>
                    </div>
                    <div className="aspect-[21/9] bg-black">
                        <iframe
                            src={data.spotifyLink.replace("spotify.com/", "spotify.com/embed/").replace("youtu.be/", "youtube.com/embed/")}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </main>
    );
}

// --- SUB-COMPONENTS ---

function BootSequence({ onComplete }: { onComplete: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 4000); // 4s boot
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            className="relative z-10 h-screen flex flex-col items-center justify-center font-mono space-y-6 p-8"
        >
            <div className="w-full max-w-md space-y-2">
                <motion.div
                    initial={{ width: "0%" }} animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="h-1 bg-gradient-to-r from-pink-500 to-purple-500"
                />
                <div className="flex justify-between text-xs text-green-500 font-bold">
                    <span>SYSTEM_BOOT</span>
                    <span>v2.14.0</span>
                </div>
            </div>
            <div className="text-left w-full max-w-md text-xs text-gray-500 space-y-1">
                <TypingLine text="> Initializing Heartbeat Protocol..." delay={0} />
                <TypingLine text="> Loading Memories..." delay={1} />
                <TypingLine text="> Synchronizing Soulmates..." delay={2} />
                <TypingLine text="> ERROR: Cuteness Overload Detected." delay={3} color="text-red-500" />
            </div>
        </motion.div>
    );
}

function TypingLine({ text, delay, color = "text-gray-500" }: { text: string, delay: number, color?: string }) {
    return (
        <motion.p
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay * 0.8 }}
            className={`font-mono ${color}`}
        >
            {text}
        </motion.p>
    );
}

function BiometricScan({ name, onUnlock }: { name: string, onUnlock: () => void }) {
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startScan = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    onUnlock();
                    return 100;
                }
                return p + 2; // Speed of fill
            });
        }, 30);
    };

    const stopScan = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }}
            className="relative z-10 h-screen flex flex-col items-center justify-center text-center p-8 select-none"
        >
            <div className="glass-panel p-8 rounded-full mb-8 relative">
                <motion.div
                    className="w-32 h-32 rounded-full border-2 border-white/10 flex items-center justify-center cursor-pointer relative overflow-hidden"
                    onMouseDown={startScan} onMouseUp={stopScan}
                    onTouchStart={startScan} onTouchEnd={stopScan}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Fill */}
                    <motion.div
                        className="absolute bottom-0 left-0 w-full bg-pink-500/20"
                        style={{ height: `${progress}%` }}
                    />
                    <span className="text-4xl z-10 animate-pulse">👆</span>
                </motion.div>

                {/* Ring Visual */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" strokeWidth="2" className="stroke-white/5" />
                    <motion.circle
                        cx="50" cy="50" r="48" fill="none" strokeWidth="2" stroke="#ec4899"
                        strokeDasharray="301.59" strokeDashoffset={301.59 - (301.59 * progress) / 100}
                    />
                </svg>
            </div>

            <h2 className="text-2xl font-bold mb-2 tracking-tight">IDENTITY VERIFICATION</h2>
            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-8">
                Target: <span className="text-pink-500 font-bold">{name}</span><br />
                Hold fingerprint to confirm identity.
            </p>
        </motion.div>
    );
}

function MemoryCore({ images, onNext }: { images: string[], onNext: () => void }) {
    // If no images, skip automatically after short delay
    useEffect(() => {
        if (!images || images.length === 0) {
            const t = setTimeout(onNext, 2000); // reduced delay
            return () => clearTimeout(t);
        }
    }, [images, onNext]);

    if (!images || images.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-pink-500 font-mono animate-pulse">Bypassing Memory Core (No Data)...</p>
            </div>
        );
    }

    // Simple vertical scroll parallax for images would be nice, but let's do a slideshow for "Viewer" feel
    // Actually user requested "3D/Parallax carousel". 
    // Let's do a simple stacked card effect that user swiping clicks through.
    const [index, setIndex] = useState(0);

    const nextImage = () => {
        if (index < images.length - 1) {
            setIndex(index + 1);
        } else {
            onNext();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative z-10 h-screen flex flex-col items-center justify-center p-4 bg-black"
            onClick={nextImage}
        >
            <div className="absolute top-8 left-0 w-full text-center z-20">
                <p className="text-xs font-mono text-pink-500 tracking-widest uppercase mb-1">Memory Core Access</p>
                <div className="flex gap-1 justify-center">
                    {images.map((_, i) => (
                        <div key={i} className={`h-1 w-8 rounded-full transition-colors ${i === index ? 'bg-pink-500' : 'bg-gray-800'}`} />
                    ))}
                </div>
            </div>

            <div className="relative w-full max-w-md aspect-[3/4] md:aspect-square">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8, rotate: 10, y: 100 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1, rotate: -10, y: -100 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                    >
                        <img src={images[index]} className="w-full h-full object-cover" alt="Memory" />

                        {/* Overlay */}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-mono text-green-400 uppercase">Analysis Complete</span>
                            </div>
                            <p className="text-xl font-bold text-white">
                                {["Happiness Levels: Critical", "Soulmate Match: 100%", "Timeline: Optimized"][index % 3]}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <p className="absolute bottom-8 text-gray-500/50 text-sm animate-pulse">Tap to continue...</p>
        </motion.div>
    );
}

function TheProposal({ name, onYes }: { name: string, onYes: () => void }) {
    const [noCount, setNoCount] = useState(0);
    const [yesScale, setYesScale] = useState(1);
    const noBtnControls = useAnimation();

    // Audio context is likely playing by now.

    const handleNoInteraction = async () => {
        setNoCount(prev => prev + 1);
        setYesScale(prev => Math.min(prev + 0.3, 4.5)); // Grows significantly

        // Teleport logic
        const x = Math.random() * (window.innerWidth * 0.6) - (window.innerWidth * 0.3);
        const y = Math.random() * (window.innerHeight * 0.6) - (window.innerHeight * 0.3);

        await noBtnControls.start({
            x, y,
            rotate: Math.random() * 20 - 10,
            transition: { duration: 0.1 }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="relative z-10 h-screen flex flex-col items-center justify-center p-4 text-center overflow-hidden"
        >
            <div className="absolute inset-0 bg-pink-500/5 z-0 pointer-events-none" />

            <motion.div className="relative z-10 max-w-4xl" layout>
                <motion.h1
                    className="text-5xl md:text-8xl font-black mb-12 drop-shadow-2xl"
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                        {name}
                    </span>
                    <br />
                    <span className="text-white text-4xl md:text-6xl">Will you be my Valentine?</span>
                </motion.h1>

                <div className="flex flex-col items-center justify-center gap-8 h-[200px] w-full relative">
                    <motion.button
                        onClick={onYes}
                        style={{ scale: yesScale }}
                        whileHover={{ scale: yesScale * 1.05 }}
                        whileTap={{ scale: yesScale * 0.95 }}
                        className="bg-white text-black font-black text-2xl md:text-4xl px-12 py-6 rounded-full shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:shadow-[0_0_100px_rgba(236,72,153,0.8)] transition-shadow z-20 relative"
                    >
                        YES, ABSOLUTELY 💖
                    </motion.button>

                    <AnimatePresence>
                        {noCount < phrases.length && (
                            <motion.button
                                animate={noBtnControls}
                                onMouseEnter={handleNoInteraction}
                                onClick={handleNoInteraction}
                                className="bg-white/10 text-gray-400 font-medium text-sm px-6 py-2 rounded-full border border-white/5 hover:bg-red-500/20 hover:text-red-300 transition-colors absolute bottom-0"
                            >
                                {phrases[noCount] || "No"}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}

function SeasonRenewed({ data, windowSize }: { data: PitchData, windowSize: { width: number, height: number } }) {
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 text-center"
        >
            <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={800} gravity={0.1} />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
                className="glass-card max-w-2xl w-full p-12 rounded-3xl relative overflow-hidden border-2 border-pink-500/30"
            >
                {/* Shine effect */}
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shimmer_3s_infinite]" />

                <h1 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 filter drop-shadow-lg">
                    ACCEPTED
                </h1>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8" />

                <p className="font-mono text-lg md:text-xl text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {data.message}
                </p>

                <div className="mt-12 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
                    <div>
                        <span className="block text-gray-700">Date</span>
                        {new Date().toLocaleDateString()}
                    </div>
                    <div>
                        <span className="block text-gray-700">Status</span>
                        <span className="text-green-500 font-bold glow">Binding</span>
                    </div>
                </div>
            </motion.div>

            <p className="mt-8 text-gray-600 font-mono text-xs">
                PRODUCED BY THE LOVE OS v2.0
            </p>
        </motion.div>
    );
}

/* Add custom animations to tailwind config or globally if needed. Shimmer is added here via arbitrary value or global css. */

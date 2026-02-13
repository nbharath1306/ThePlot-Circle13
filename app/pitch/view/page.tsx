"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Confetti from "react-confetti";
// import { useWindowSize } from "react-use"; // Removed due to missing dependency

// --- TYPES ---
type PitchData = {
    name: string;
    message: string;
    spotifyLink: string;
    images: string[];
};

// --- HELPERS ---
const safeDecode = (str: string) => {
    try {
        return JSON.parse(decodeURIComponent(atob(str)));
    } catch (e) {
        return null;
    }
};

const phrases = [
    "No",
    "Are you sure?",
    "Think again...",
    "Don't do this",
    "I'll give you snacks!",
    "I'll stop singing!",
    "Really?",
    "Pleeeeease?",
    "You're breaking my heart 💔",
    "Last chance!",
    "Okay, I'll cry.",
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
    const [phase, setPhase] = useState<
        "boot" | "scan" | "agreement" | "quiz_1" | "quiz_2" | "final" | "success"
    >("boot");

    const [noCount, setNoCount] = useState(0);
    const [yesScale, setYesScale] = useState(1);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const noBtnControls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);

    // --- INIT ---
    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        handleResize();
        window.addEventListener("resize", handleResize);

        const encoded = searchParams.get("data") || searchParams.get("d");
        if (encoded) {
            const decoded = safeDecode(encoded);
            if (decoded) setData(decoded);
        }

        // Sequence timer
        setTimeout(() => setPhase("scan"), 2000);

        return () => window.removeEventListener("resize", handleResize);
    }, [searchParams]);

    // --- HANDLERS ---
    const handleNoHover = async () => {
        setNoCount((prev) => prev + 1);
        setYesScale((prev) => Math.min(prev + 0.2, 3)); // Cap growth

        // Chaotic movement
        const x = Math.random() * (window.innerWidth - 200) - (window.innerWidth / 2) + 100;
        const y = Math.random() * (window.innerHeight - 100) - (window.innerHeight / 2) + 50;

        await noBtnControls.start({
            x,
            y,
            rotate: Math.random() * 40 - 20,
            transition: { duration: 0.2, type: "spring", stiffness: 300 }
        });
    };

    const getEmbedUrl = (url: string) => {
        if (!url) return null;
        if (url.includes("spotify")) return url.replace("spotify.com/", "spotify.com/embed/");
        if (url.includes("youtube") || url.includes("youtu.be")) {
            let videoId = "";
            if (url.includes("v=")) videoId = url.split("v=")[1]?.split("&")[0];
            else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split("?")[0];
            return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        return null;
    };

    const embedUrl = getEmbedUrl(data.spotifyLink);

    return (
        <main ref={containerRef} className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-pink-500/50">

            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 bg-repeat mix-blend-overlay" />
                {/* Floating Orbs */}
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -100, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ x: [0, -150, 0], y: [0, 100, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"
                />
            </div>

            <AnimatePresence mode="wait">

                {/* PHASE 1: BOOT */}
                {phase === "boot" && (
                    <motion.div
                        key="boot"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                        className="relative z-10 h-screen flex flex-col items-center justify-center font-mono space-y-4"
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "200px" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="h-1 bg-pink-500 rounded-full"
                        />
                        <p className="text-pink-500 text-xs tracking-widest uppercase animate-pulse">
                            Establishing Secure Connection...
                        </p>
                    </motion.div>
                )}

                {/* PHASE 2: SCAN */}
                {phase === "scan" && (
                    <motion.div
                        key="scan"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="relative z-10 h-screen flex flex-col items-center justify-center text-center p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring" }}
                            className="w-32 h-32 border-2 border-dashed border-pink-500/50 rounded-full flex items-center justify-center mb-8 relative"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-t-2 border-pink-500 rounded-full"
                            />
                            <span className="text-4xl">❤️</span>
                        </motion.div>

                        <h2 className="text-3xl font-bold mb-2">Subject Identified: <span className="text-pink-500">{data.name}</span></h2>
                        <p className="text-gray-400 font-mono text-sm mb-8">
                            Cuteness Levels: <span className="text-green-400">CRITICAL (1000%)</span>
                        </p>

                        <button onClick={() => setPhase("agreement")} className="btn-primary">
                            PROCEED
                        </button>
                    </motion.div>
                )}

                {/* PHASE 3: AGREEMENT */}
                {phase === "agreement" && (
                    <motion.div
                        key="agreement"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        className="relative z-10 h-screen flex flex-col items-center justify-center text-center p-6 max-w-lg mx-auto"
                    >
                        <div className="glass-card w-full p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl">
                            <h3 className="text-xl font-bold mb-6 font-mono border-b border-white/10 pb-4">
                                TERMS OF ENDEARMENT
                            </h3>
                            <div className="text-left space-y-4 text-gray-300 text-sm mb-8 font-mono">
                                <p>By proceeding, you agree to the following:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>To accept all compliments unconditionally.</li>
                                    <li>To provide unlimited cuddles (as required).</li>
                                    <li>To acknowledge that I am "simping" hard.</li>
                                </ul>
                            </div>
                            <button onClick={() => setPhase("quiz_1")} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                                I ACCEPT
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* PHASE 4: QUIZ 1 */}
                {phase === "quiz_1" && (
                    <motion.div
                        key="quiz1"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 h-screen flex flex-col items-center justify-center p-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-black mb-12 text-center">
                            Quick Check...<br />Who is the cuter one?
                        </h2>
                        <div className="flex gap-4">
                            <button onClick={() => setPhase("quiz_2")} className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all">
                                Me (Obviously)
                            </button>
                            <button onClick={() => setPhase("quiz_2")} className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-[0_0_30px_rgba(236,72,153,0.4)]">
                                You (Wait, no me)
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* PHASE 5: QUIZ 2 */}
                {phase === "quiz_2" && (
                    <motion.div
                        key="quiz2"
                        initial={{ rotate: -5, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="relative z-10 h-screen flex flex-col items-center justify-center p-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-black mb-12 text-center">
                            Are you ready to be<br />annoyed by me forever?
                        </h2>
                        <div className="flex gap-4">
                            <button onClick={() => setPhase("final")} className="bg-white text-black px-12 py-6 rounded-full font-bold text-2xl hover:scale-110 transition-transform">
                                YES, I'M READY
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* PHASE 6: FINAL BOSS */}
                {phase === "final" && (
                    <motion.div
                        key="final"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 h-screen flex flex-col items-center justify-center p-4 overflow-hidden"
                    >
                        {/* Images in Background Parallax? No, keep it clean for focus */}
                        {data.images?.length > 0 && (
                            <div className="absolute inset-0 pointer-events-none opacity-20 z-0 flex items-center justify-center">
                                <img src={data.images[0]} className="w-full h-full object-cover blur-sm" />
                            </div>
                        )}

                        <h1 className="text-5xl md:text-8xl font-black text-center mb-8 relative z-10 drop-shadow-2xl">
                            <span className="text-pink-500">{data.name}</span>, <br />
                            Will You Be My Valentine?
                        </h1>

                        <div className="relative z-20 flex flex-col items-center gap-8 h-[300px] w-full max-w-3xl justify-center">

                            {/* THE YES BUTTON */}
                            <motion.button
                                onClick={() => setPhase("success")}
                                layout
                                style={{ scale: yesScale }}
                                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-4xl px-12 py-6 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.6)] z-20 hover:shadow-[0_0_80px_rgba(236,72,153,1)] transition-shadow"
                            >
                                YESSSSS! 💖
                            </motion.button>

                            {/* THE NO BUTTON */}
                            <AnimatePresence>
                                {noCount < phrases.length && (
                                    <motion.button
                                        initial={{ opacity: 1 }}
                                        animate={noBtnControls}
                                        onMouseEnter={handleNoHover}
                                        onClick={handleNoHover} // Handle taps too
                                        className="bg-gray-800/80 backdrop-blur text-gray-400 font-bold text-lg px-8 py-3 rounded-full border border-white/10 absolute top-32"
                                    >
                                        {phrases[noCount] || "No"}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        <p className="absolute bottom-8 text-gray-500 font-mono text-xs z-10 uppercase tracking-[0.3em] animate-pulse">
                            Resistance is futile
                        </p>
                    </motion.div>
                )}

                {/* PHASE 7: SUCCESS */}
                {phase === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="fixed inset-0 z-0">
                            <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={500} recycle={false} />
                        </div>

                        <div className="relative z-10 bg-black/40 backdrop-blur-2xl border border-white/10 p-12 rounded-3xl max-w-3xl w-full shadow-2xl">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.6)]"
                            >
                                <svg className="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>

                            <h1 className="text-4xl md:text-7xl font-black mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                OFFICIALLY DATE!
                            </h1>

                            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8 font-mono text-lg leading-relaxed text-gray-200">
                                {data.message}
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 justify-center items-center font-mono text-xs text-gray-500 uppercase tracking-widest border-t border-white/10 pt-8">
                                <div>
                                    Status: <span className="text-green-400">BINDING & IRREVOCABLE</span>
                                </div>
                                <div className="hidden md:block">•</div>
                                <div>
                                    Date: {new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {embedUrl && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="fixed bottom-4 right-4 z-50 w-64 md:w-80 shadow-2xl rounded-xl overflow-hidden border border-white/20"
                            >
                                <div className="bg-black text-white text-xs px-3 py-1 font-bold flex justify-between items-center">
                                    <span>NOW PLAYING</span>
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                </div>
                                <div className="aspect-video bg-black">
                                    <iframe
                                        src={embedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                    />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

            </AnimatePresence>

            <style jsx global>{`
        .btn-primary {
            @apply bg-white text-black font-bold px-8 py-3 rounded-full text-lg hover:scale-105 transition-transform;
        }
        .glass-card {
            @apply bg-white/5 backdrop-blur-lg border border-white/10;
        }
      `}</style>
        </main>
    );
}

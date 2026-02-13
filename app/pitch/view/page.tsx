"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Confetti from "react-confetti";

// Helper for safe decoding
const safeDecode = (str: string) => {
    try {
        return JSON.parse(decodeURIComponent(atob(str)));
    } catch (e) {
        return null;
    }
};

export default function PitchViewer() {
    return (
        <Suspense fallback={<div className="text-white text-center p-20">Loading The Pitch...</div>}>
            <PitchContent />
        </Suspense>
    );
}

function PitchContent() {
    const searchParams = useSearchParams();
    const [data, setData] = useState({ name: "", message: "", spotifyLink: "", images: [] as string[] });
    const [phase, setPhase] = useState<"loading" | "intro" | "montage" | "proposal" | "success" | "glitch">("loading");
    const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    // Framer Motion Scroll Parallax
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

    useEffect(() => {
        // Window resize handler
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        handleResize(); // Init
        window.addEventListener('resize', handleResize);

        // Decode data
        const encoded = searchParams.get("data") || searchParams.get("d");
        if (encoded) {
            const decoded = safeDecode(encoded);
            if (decoded) {
                setData(decoded);
            }
        }

        // Simulate loading
        const timer = setTimeout(() => setPhase("intro"), 1500);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, [searchParams]);

    const handleStart = () => {
        // If we have images, show montage, otherwise skip to proposal
        if (data.images && data.images.length > 0) {
            setPhase("montage");
        } else {
            setPhase("proposal");
        }
    };

    const handleYes = () => {
        setPhase("success");
    };

    const handleNo = () => {
        setPhase("glitch");
        setTimeout(() => setPhase("proposal"), 2000);
    };

    const moveNoButton = () => {
        const maxWidth = windowSize.width - 100; // button width approx
        const maxHeight = windowSize.height - 50; // button height approx

        // Ensure it moves far enough from current mouse
        const newX = Math.random() * (maxWidth - 20) + 10;
        const newY = Math.random() * (maxHeight - 20) + 10;

        setNoBtnPos({ x: newX, y: newY });
    };

    // Embed URL logic
    const getEmbedUrl = (url: string) => {
        if (!url) return null;
        if (url.includes("spotify")) {
            return url.replace("spotify.com/", "spotify.com/embed/");
        }
        if (url.includes("youtube") || url.includes("youtu.be")) {
            let videoId = "";
            if (url.includes("v=")) {
                videoId = url.split("v=")[1]?.split("&")[0];
            } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1]?.split("?")[0];
            }
            return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        return null;
    };

    const embedUrl = getEmbedUrl(data.spotifyLink);

    return (
        <main className={`min-h-screen bg-black text-white relative overflow-hidden font-sans ${phase === "glitch" ? "animate-pulse bg-red-900" : ""}`}>

            {/* Background Noise */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0" />

            <AnimatePresence mode="wait">

                {/* LOADING */}
                {phase === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center h-screen z-10 relative"
                    >
                        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                )}

                {/* INTRO */}
                {phase === "intro" && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="flex flex-col items-center justify-center h-screen z-10 relative p-8 text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
                            A FILM BY <span className="text-pink-500">UNKNOWN</span>
                        </h1>
                        <p className="text-gray-400 mb-12 max-w-md mx-auto font-mono text-sm">
                            I directed a movie about us.
                        </p>
                        <button
                            onClick={handleStart}
                            className="bg-white text-black font-bold px-8 py-4 rounded-full text-xl hover:scale-105 transition-transform"
                        >
                            PREMIERE 🎬
                        </button>
                    </motion.div>
                )}

                {/* MONTAGE (PARALLAX SCROLL) */}
                {phase === "montage" && (
                    <motion.div
                        key="montage"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative min-h-[150vh] z-10 flex flex-col items-center pt-20"
                    >
                        <div className="fixed top-10 right-10 z-50">
                            <button
                                onClick={() => setPhase("proposal")}
                                className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-mono border border-white/20 hover:bg-white/20 transition-all"
                            >
                                SKIP INTRO →
                            </button>
                        </div>

                        <div className="w-full max-w-4xl mx-auto px-4 space-y-32 pb-40">
                            {data.images && data.images.map((img, i) => (
                                <motion.div
                                    key={i}
                                    style={{ y: i === 0 ? y1 : i === 1 ? y2 : y3 }}
                                    className={`relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${i % 2 === 0 ? 'ml-0' : 'ml-auto max-w-2xl'}`}
                                >
                                    <img src={img} alt="Us" className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="fixed bottom-10 left-0 w-full text-center px-4 pointer-events-none">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-white/80 font-serif text-2xl italic max-w-lg mx-auto bg-black/50 p-4 rounded-xl backdrop-blur-sm"
                            >
                                "Scroll to continue..."
                            </motion.p>
                        </div>

                        {/* Trigger Proposal at bottom */}
                        <motion.div
                            onViewportEnter={() => setPhase("proposal")}
                            className="h-20 w-full absolute bottom-0 pointer-events-none"
                        />
                    </motion.div>
                )}

                {/* PROPOSAL (THE TRAP) */}
                {phase === "proposal" && (
                    <motion.div
                        key="proposal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-screen relative z-10 flex flex-col items-center justify-center p-4 text-center"
                    >
                        <h1 className="text-4xl md:text-7xl font-black mb-12 leading-tight">
                            <span className="text-pink-500">{data.name}</span>,<br />will you be my Valentine?
                        </h1>

                        <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full relative min-h-[200px]">
                            <button
                                onClick={handleYes}
                                className="bg-pink-600 hover:bg-pink-500 text-white font-black text-3xl px-16 py-8 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.5)] animate-pulse hover:animate-none hover:scale-105 transition-all z-20"
                            >
                                YES!
                            </button>

                            <motion.button
                                onMouseEnter={moveNoButton}
                                onTouchStart={moveNoButton}
                                onClick={handleNo}
                                animate={{
                                    x: noBtnPos.x ? noBtnPos.x - (window.innerWidth / 2) : 0,
                                    y: noBtnPos.y ? noBtnPos.y - (window.innerHeight / 2) : 0
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                className="bg-gray-800 text-gray-500 font-medium text-lg px-8 py-4 rounded-xl relative md:absolute z-10"
                                style={{
                                    position: noBtnPos.x === 0 ? "relative" : "fixed",
                                    left: noBtnPos.x === 0 ? "auto" : 0,
                                    top: noBtnPos.y === 0 ? "auto" : 0
                                }}
                            >
                                No
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* GLITCH STATE */}
                {phase === "glitch" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-600 text-white font-mono text-center p-4">
                        <h1 className="text-4xl md:text-6xl font-bold glitch-text">
                            ERR: SCRIPT DEVIATION<br />
                            TRY AGAIN
                        </h1>
                    </div>
                )}

                {/* SUCCESS (THE CLIMAX) */}
                {phase === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center min-h-screen z-10 relative p-8 text-center"
                    >
                        <Confetti width={windowSize.width} height={windowSize.height} />

                        <motion.h1
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring" }}
                            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-8"
                        >
                            SEASON RENEWED
                        </motion.h1>

                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl max-w-2xl w-full border border-white/10"
                        >
                            <p className="font-mono text-xl md:text-2xl leading-relaxed whitespace-pre-wrap">
                                {data.message}
                            </p>
                        </motion.div>

                        {embedUrl && (
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="mt-8 w-full max-w-md aspect-video rounded-xl overflow-hidden border border-white/10"
                            >
                                <iframe
                                    src={embedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            </motion.div>
                        )}

                        <div className="mt-12 text-gray-500 text-xs font-mono tracking-widest uppercase">
                            PRODUCED BY THEPLOT.LIVE
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </main>
    );
}

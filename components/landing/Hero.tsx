"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

export default function Hero() {
    const [videoLoaded, setVideoLoaded] = useState(false);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Video Placeholder */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
                {/* Actual video would go here */}
                {/* <video ... /> */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-display"
                >
                    See Your Future Together
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-sans"
                >
                    AI-powered relationship simulation that reveals your compatibility
                    before you commit. Watch your digital twins navigate love, conflict,
                    and life together.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex gap-4 justify-center"
                >
                    <Button
                        className="h-12 px-8 text-lg bg-primary hover:bg-primary/90"
                        onClick={() => window.location.href = '/assess'}
                    >
                        Start Free Simulation →
                    </Button>
                    <Button variant="ghost" className="h-12 px-8 text-lg">
                        Watch Demo
                    </Button>
                </motion.div>

                {/* Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-12 text-gray-400 font-sans"
                >
                    <p className="text-sm">
                        🔥 <strong>50,000+</strong> relationships simulated • ⭐{" "}
                        <strong>4.9/5</strong> rating • 💕 <strong>92%</strong> report better
                        communication
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

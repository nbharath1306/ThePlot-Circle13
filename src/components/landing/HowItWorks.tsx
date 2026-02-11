"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
    {
        number: "01",
        title: "CONNECT",
        description: "Both partners scan the QR code to link devices",
        icon: "⚡",
    },
    {
        number: "02",
        title: "CONFIGURE",
        description: "Players answer personality questions independently",
        icon: "◉",
    },
    {
        number: "03",
        title: "SIMULATE",
        description: "Watch the 7-year relationship timeline unfold",
        icon: "▶",
    },
];

export default function HowItWorks() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 px-4">
            <motion.h2
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                className="text-center text-xs tracking-[0.5em] text-[#00ff00]/40 mb-16"
            >
                PROTOCOL_SEQUENCE
            </motion.h2>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting line */}
                <motion.div
                    className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.5, duration: 1 }}
                    style={{ background: "linear-gradient(90deg, transparent, #003300, #00ff00, #003300, transparent)" }}
                />

                {steps.map((step, i) => (
                    <motion.div
                        key={step.number}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
                        className="relative flex flex-col items-center text-center group"
                    >
                        {/* Icon circle */}
                        <motion.div
                            className="w-20 h-20 border border-[#003300] flex items-center justify-center mb-6 text-2xl relative bg-black"
                            whileHover={{ borderColor: "#00ff00", boxShadow: "0 0 20px rgba(0,255,0,0.2)" }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="text-[#00ff00]/50 group-hover:text-[#00ff00] transition-colors duration-300">
                                {step.icon}
                            </span>
                            {/* Corner accents */}
                            <span className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[#00ff00]/40" />
                            <span className="absolute -top-px -right-px w-3 h-3 border-t border-r border-[#00ff00]/40" />
                            <span className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-[#00ff00]/40" />
                            <span className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-[#00ff00]/40" />
                        </motion.div>

                        <div className="text-xs tracking-[0.3em] text-[#00ff00]/30 mb-2">
                            STEP {step.number}
                        </div>
                        <h3 className="text-lg font-bold tracking-[0.2em] mb-2 group-hover:glow-text transition-all">
                            {step.title}
                        </h3>
                        <p className="text-sm text-[#00ff00]/40 max-w-[200px]">
                            {step.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

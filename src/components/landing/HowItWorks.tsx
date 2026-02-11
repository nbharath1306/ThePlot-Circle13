"use client";

import { motion } from "framer-motion";

const steps = [
    { num: "01", title: "CONNECT", desc: "Both partners scan the QR code to join a synchronized session." },
    { num: "02", title: "CONFIGURE", desc: "Each player privately answers 3 questions about their personality." },
    { num: "03", title: "SIMULATE", desc: "Watch your AI-generated 7-year relationship timeline unfold." },
];

export default function HowItWorks() {
    return (
        <section className="relative z-10 py-16 px-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12 tracking-[0.2em] text-[#00ff00]/70">
                HOW_IT_WORKS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, i) => (
                    <motion.div
                        key={step.num}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 * i }}
                        className="border border-[#003300] p-6 hover:border-[#00ff00]/50 transition-colors duration-300"
                    >
                        <div className="text-4xl font-bold text-[#00ff00]/30 mb-3">{step.num}</div>
                        <h3 className="text-lg font-bold mb-2 tracking-widest">{step.title}</h3>
                        <p className="text-sm text-[#00ff00]/50 leading-relaxed">{step.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

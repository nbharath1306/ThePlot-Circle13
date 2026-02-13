"use client";

import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useRef } from "react";

export default function HomePage() {
  const router = useRouter();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const modes = [
    {
      id: "oracle",
      title: "The Oracle",
      subtitle: "For Couples",
      description: "Allow AI to simulate your next 10 years together. Discover your fate before it happens.",
      emoji: "🔮",
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "bg-purple-500/10",
      path: "/oracle",
      stat: "10 Year Timeline"
    },
    {
      id: "matchmaker",
      title: "The Matchmaker",
      subtitle: "For Singles",
      description: "Design your perfect partner. Our AI will generate them and send you on a virtual date.",
      emoji: "💘",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "bg-pink-500/10",
      path: "/matchmaker",
      stat: "AI Generation"
    },
    {
      id: "pitch",
      title: "The Pitch",
      subtitle: "The Un-Rejectable Proposal",
      description: "Create a cinematic, interactive Valentine's proposal that literally runs away from 'No'.",
      emoji: "🎬",
      gradient: "from-pink-600 via-rose-600 to-red-600",
      bgGradient: "bg-pink-500/10",
      path: "/pitch",
      stat: "Zero Friction"
    },
  ];

  return (
    <main ref={containerRef} className="min-h-screen bg-black text-white selection:bg-purple-500/30 overflow-hidden relative">

      {/* Aurora Background */}
      <div className="aurora-bg fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="aurora-blob aurora-1" />
        <div className="aurora-blob aurora-2" />
        <div className="aurora-blob aurora-3" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-4 min-h-screen">

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass px-4 py-1.5 rounded-full mb-8 flex items-center gap-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">System Online</span>
        </motion.div>

        {/* Hero Typography */}
        <motion.div
          style={{ y }}
          className="text-center space-y-6 max-w-5xl mx-auto mb-20"
        >
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter font-display leading-[0.9]">
            The<span className="text-gradient-purple">Plot</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            The world's first <span className="text-white font-medium">Predictive Relationship Engine</span>.
            <br />
            Simulate your future before you live it.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto w-full px-4">
          {modes.map((mode, i) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + (i * 0.1) }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div onClick={() => router.push(mode.path)} className="cursor-pointer h-full">
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${mode.gradient} opacity-0 group-hover:opacity-30 blur-2xl transition duration-500`} />

                {/* Card Content */}
                <div className="glass-card h-full rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group-hover:border-white/20 transition-colors duration-500">

                  {/* Hover Gradient Overlay */}
                  <div className={`absolute top-0 right-0 w-64 h-64 ${mode.bgGradient} blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-opacity-100 transition duration-700`} />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <span className="text-5xl">{mode.emoji}</span>
                      <span className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded bg-black/20">
                        {mode.stat}
                      </span>
                    </div>

                    <h3 className="text-3xl font-bold mb-2 font-display">{mode.title}</h3>
                    <p className={`text-sm font-mono uppercase tracking-widest mb-4 bg-gradient-to-r ${mode.gradient} bg-clip-text text-transparent opacity-80`}>
                      {mode.subtitle}
                    </p>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {mode.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between group-hover:border-white/10 transition-colors">
                    <span className="text-sm text-gray-400 font-mono group-hover:text-white transition-colors">Initiate Protocol</span>
                    <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="fixed bottom-8 left-0 w-full text-center pointer-events-none hidden md:block"
        >
          <p className="text-xs text-gray-600 font-mono uppercase tracking-[0.2em]">
            Powered by Llama 3.1 70B • Neural Simulation v2.0
          </p>
        </motion.div>

      </div>
    </main>
  );
}

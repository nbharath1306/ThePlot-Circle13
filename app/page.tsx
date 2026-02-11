"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const router = useRouter();

  const modes = [
    {
      id: "oracle",
      title: "The Oracle",
      subtitle: "For Couples",
      description: "See your relationship's future across 10 years. Will you make it?",
      emoji: "🔮",
      color: "from-purple-600 to-pink-600",
      path: "/oracle",
    },
    {
      id: "matchmaker",
      title: "The Matchmaker",
      subtitle: "For Singles",
      description: "Create your dream partner and go on a virtual date. Test compatibility before the real thing.",
      emoji: "💘",
      color: "from-pink-600 to-red-600",
      path: "/matchmaker",
    },
    {
      id: "detective",
      title: "The Detective",
      subtitle: "For Dating",
      description: "Predict where your relationship is headed. Get the intel before you catch feelings.",
      emoji: "🕵️",
      color: "from-blue-600 to-purple-600",
      path: "/detective",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              ThePlot
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
              The AI that predicts your relationship future.
              <br />
              <span className="text-white font-semibold">Choose your path.</span>
            </p>
          </motion.div>

          {/* Mode Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mt-16"
          >
            {modes.map((mode, idx) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300`} />

                <div className="relative bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300">
                  <div className="text-6xl mb-4">{mode.emoji}</div>

                  <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${mode.color} bg-clip-text text-transparent`}>
                    {mode.title}
                  </h3>

                  <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
                    {mode.subtitle}
                  </p>

                  <p className="text-gray-300 mb-6 min-h-[60px]">
                    {mode.description}
                  </p>

                  <Button
                    onClick={() => router.push(mode.path)}
                    className={`w-full bg-gradient-to-r ${mode.color} hover:opacity-90`}
                  >
                    Enter →
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center gap-12 text-center pt-12"
          >
            <div>
              <div className="text-3xl font-bold text-white">10 Years</div>
              <div className="text-sm text-gray-400">Timeline Prediction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">3 Modes</div>
              <div className="text-sm text-gray-400">Every Relationship Stage</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">AI-Powered</div>
              <div className="text-sm text-gray-400">Deep Analysis</div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

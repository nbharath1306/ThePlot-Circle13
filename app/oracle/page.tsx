"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function OraclePage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl text-center space-y-8">
                <div className="text-7xl mb-4">🔮</div>

                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    The Oracle
                </h1>

                <p className="text-xl text-gray-300">
                    See your relationship across <span className="text-white font-bold">10 years</span>.
                    <br />
                    Four critical scenarios. One brutal truth.
                </p>

                <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-6 space-y-4 text-left">
                    <h3 className="text-lg font-semibold text-purple-400">What You'll Experience:</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li>✨ <strong>Year 1:</strong> Moving in together</li>
                        <li>💼 <strong>Year 3:</strong> Career vs. relationship conflict</li>
                        <li>💰 <strong>Year 5:</strong> Financial crisis test</li>
                        <li>🌅 <strong>Year 10:</strong> Long-term vision alignment</li>
                    </ul>
                </div>

                <div className="flex gap-4 justify-center pt-4">
                    <Button
                        onClick={() => router.push("/oracle/assess")}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8"
                    >
                        Start Assessment
                    </Button>
                    <Button
                        onClick={() => router.push("/")}
                        variant="ghost"
                    >
                        Back
                    </Button>
                </div>
            </div>
        </main>
    );
}

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function DetectivePage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl text-center space-y-8">
                <div className="text-7xl mb-4">🕵️</div>

                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    The Detective
                </h1>

                <p className="text-xl text-gray-300">
                    You're dating someone. But where is this going?
                    <br />
                    <span className="text-white font-bold">Get the intel before you catch feelings.</span>
                </p>

                <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6 space-y-4 text-left">
                    <h3 className="text-lg font-semibold text-blue-400">What You'll Learn:</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li>🎯 Predicted relationship lifespan</li>
                        <li>⚠️ Red flags and breaking points</li>
                        <li>📈 Should you level up or exit gracefully?</li>
                        <li>🧠 Strategic advice based on their personality</li>
                    </ul>
                </div>

                <div className="flex gap-4 justify-center pt-4">
                    <Button
                        onClick={() => router.push("/detective/intel")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8"
                    >
                        Analyze Relationship
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

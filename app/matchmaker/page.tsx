"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function MatchmakerPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl text-center space-y-8">
                <div className="text-7xl mb-4">💘</div>

                <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                    The Matchmaker
                </h1>

                <p className="text-xl text-gray-300">
                    Design your dream partner. Go on a virtual date.
                    <br />
                    <span className="text-white font-bold">Test compatibility before the real thing.</span>
                </p>

                <div className="bg-gray-900/50 border border-pink-500/30 rounded-xl p-6 space-y-4 text-left">
                    <h3 className="text-lg font-semibold text-pink-400">How It Works:</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li>💭 Describe your ideal partner (or your crush)</li>
                        <li>🤖 AI creates their digital twin</li>
                        <li>💬 Chat for 10 minutes on a virtual date</li>
                        <li>📊 Get compatibility score + strategy to win them over</li>
                    </ul>
                </div>

                <div className="flex gap-4 justify-center pt-4">
                    <Button
                        onClick={() => router.push("/matchmaker/create")}
                        className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 px-8"
                    >
                        Create Your Match
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

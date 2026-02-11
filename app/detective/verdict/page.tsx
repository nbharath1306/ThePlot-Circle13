"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

export default function DetectiveVerdictPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [verdict, setVerdict] = useState<any>(null);

    useEffect(() => {
        generateVerdict();
    }, []);

    const generateVerdict = async () => {
        const answers = localStorage.getItem("detective_answers");

        if (!answers) {
            router.push("/detective");
            return;
        }

        const parsedAnswers = JSON.parse(answers);

        try {
            const response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a brutally honest relationship detective. Analyze these answers and provide a verdict on where this relationship is headed.

Answers:
${JSON.stringify(parsedAnswers, null, 2)}

Provide a JSON response with:
{
  "verdict": "<SERIOUS_POTENTIAL | CASUAL_VIBES | SITUATIONSHIP | RED_FLAG_CITY | UNCLEAR>",
  "verdictTitle": "<catchy title>",
  "summary": "<2-3 sentence brutally honest summary>",
  "redFlags": ["<flag 1>", "<flag 2>", ...],
  "greenFlags": ["<flag 1>", "<flag 2>", ...],
  "effortBalance": "<analysis of who's putting in more effort>",
  "prediction": "<where this is headed in 3-6 months>",
  "advice": "<honest advice - should they stay or go?>",
  "compatibilityScore": <number 1-100>
}

Be direct, honest, and call out BS. If it's a situationship, say it. If they're being breadcrumbed, say it. If it's actually good, celebrate it.`,
                    },
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.8,
                response_format: { type: "json_object" },
            });

            const analysis = JSON.parse(response.choices[0]?.message?.content || "{}");
            setVerdict(analysis);
        } catch (error) {
            console.error("Error generating verdict:", error);
            setVerdict({
                verdict: "UNCLEAR",
                verdictTitle: "It's Complicated",
                summary: "Based on your answers, this relationship has both positive and concerning signs.",
                redFlags: ["Inconsistent communication", "Effort imbalance"],
                greenFlags: ["Good chemistry", "Emotional connection"],
                effortBalance: "You're putting in more effort than they are.",
                prediction: "This could go either way depending on whether they step up.",
                advice: "Have an honest conversation about where this is going.",
                compatibilityScore: 65,
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-6xl animate-pulse">🕵️</div>
                    <div className="text-2xl">Analyzing the evidence...</div>
                    <div className="text-gray-400">This might sting a little.</div>
                </div>
            </main>
        );
    }

    if (!verdict) {
        return null;
    }

    const getVerdictColor = (v: string) => {
        switch (v) {
            case "SERIOUS_POTENTIAL":
                return { bg: "from-green-600/20 to-emerald-600/20", border: "border-green-500/30", text: "text-green-400" };
            case "CASUAL_VIBES":
                return { bg: "from-blue-600/20 to-cyan-600/20", border: "border-blue-500/30", text: "text-blue-400" };
            case "SITUATIONSHIP":
                return { bg: "from-yellow-600/20 to-orange-600/20", border: "border-yellow-500/30", text: "text-yellow-400" };
            case "RED_FLAG_CITY":
                return { bg: "from-red-600/20 to-pink-600/20", border: "border-red-500/30", text: "text-red-400" };
            default:
                return { bg: "from-gray-600/20 to-gray-600/20", border: "border-gray-500/30", text: "text-gray-400" };
        }
    };

    const colors = getVerdictColor(verdict.verdict);

    return (
        <main className="min-h-screen bg-black text-white p-4">
            <div className="max-w-4xl mx-auto py-8 space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="text-6xl">🕵️</div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        The Verdict
                    </h1>
                </div>

                {/* Main Verdict */}
                <div className={`bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-2xl p-8 text-center`}>
                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                        Relationship Status
                    </div>
                    <div className={`text-4xl font-bold ${colors.text} mb-4`}>
                        {verdict.verdictTitle}
                    </div>
                    <p className="text-gray-300 text-lg">{verdict.summary}</p>
                </div>

                {/* Compatibility Score */}
                <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 text-center">
                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                        Compatibility Score
                    </div>
                    <div className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        {verdict.compatibilityScore}%
                    </div>
                </div>

                {/* Red Flags */}
                {verdict.redFlags && verdict.redFlags.length > 0 && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-red-400 mb-4">🚩 Red Flags</h3>
                        <ul className="space-y-2">
                            {verdict.redFlags.map((flag: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-300">
                                    <span className="text-red-400">•</span>
                                    <span>{flag}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Green Flags */}
                {verdict.greenFlags && verdict.greenFlags.length > 0 && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-green-400 mb-4">💚 Green Flags</h3>
                        <ul className="space-y-2">
                            {verdict.greenFlags.map((flag: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-300">
                                    <span className="text-green-400">•</span>
                                    <span>{flag}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Effort Balance */}
                <div className="bg-gray-900/50 border border-blue-500/30 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-blue-400 mb-3">⚖️ Effort Balance</h3>
                    <p className="text-gray-300">{verdict.effortBalance}</p>
                </div>

                {/* Prediction */}
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">🔮 3-6 Month Prediction</h3>
                    <p className="text-gray-300">{verdict.prediction}</p>
                </div>

                {/* Advice */}
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-blue-400 mb-3">💡 The Detective's Advice</h3>
                    <p className="text-gray-300 text-lg">{verdict.advice}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        onClick={() => router.push("/detective")}
                        variant="ghost"
                        className="flex-1 py-6"
                    >
                        Investigate Another
                    </Button>
                    <Button
                        onClick={() => router.push("/")}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-6"
                    >
                        Back to Home
                    </Button>
                </div>
            </div>
        </main>
    );
}

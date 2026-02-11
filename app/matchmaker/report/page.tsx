"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

export default function MatchmakerReportPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<any>(null);

    useEffect(() => {
        generateReport();
    }, []);

    const generateReport = async () => {
        const conversation = localStorage.getItem("matchmaker_conversation");
        const profile = localStorage.getItem("matchmaker_dream_partner");

        if (!conversation || !profile) {
            router.push("/matchmaker");
            return;
        }

        const messages = JSON.parse(conversation);
        const partnerProfile = JSON.parse(profile);

        try {
            const response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a relationship compatibility analyst. Analyze this virtual date conversation and provide a detailed compatibility report.

Partner Profile:
${JSON.stringify(partnerProfile, null, 2)}

Conversation:
${messages.map((m: any) => `${m.role}: ${m.content}`).join("\n")}

Provide a JSON response with:
{
  "compatibilityScore": <number 1-100>,
  "summary": "<2-3 sentence overview>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "challenges": ["<challenge 1>", "<challenge 2>"],
  "chemistry": "<analysis of conversational chemistry>",
  "recommendation": "<final recommendation>"
}`,
                    },
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                response_format: { type: "json_object" },
            });

            const analysis = JSON.parse(response.choices[0]?.message?.content || "{}");
            setReport(analysis);
        } catch (error) {
            console.error("Error generating report:", error);
            setReport({
                compatibilityScore: 75,
                summary: "You two had great chemistry! The conversation flowed naturally.",
                strengths: ["Good communication", "Shared interests", "Natural chemistry"],
                challenges: ["Need more time to assess deeper compatibility"],
                chemistry: "Strong initial connection with engaging conversation.",
                recommendation: "This looks promising! Consider meeting in real life.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-6xl animate-pulse">💘</div>
                    <div className="text-2xl">Analyzing your date...</div>
                </div>
            </main>
        );
    }

    if (!report) {
        return null;
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "from-green-500 to-emerald-500";
        if (score >= 60) return "from-yellow-500 to-orange-500";
        return "from-red-500 to-pink-500";
    };

    return (
        <main className="min-h-screen bg-black text-white p-4">
            <div className="max-w-4xl mx-auto py-8 space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="text-6xl">💘</div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                        Compatibility Report
                    </h1>
                </div>

                {/* Compatibility Score */}
                <div className="bg-gray-900/50 border border-pink-500/30 rounded-2xl p-8 text-center">
                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                        Compatibility Score
                    </div>
                    <div className={`text-7xl font-bold bg-gradient-to-r ${getScoreColor(report.compatibilityScore)} bg-clip-text text-transparent`}>
                        {report.compatibilityScore}%
                    </div>
                    <p className="text-gray-300 mt-4">{report.summary}</p>
                </div>

                {/* Chemistry Analysis */}
                <div className="bg-gray-900/50 border border-pink-500/30 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-pink-400 mb-3">💫 Chemistry</h3>
                    <p className="text-gray-300">{report.chemistry}</p>
                </div>

                {/* Strengths */}
                <div className="bg-gray-900/50 border border-green-500/30 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-green-400 mb-4">✅ Strengths</h3>
                    <ul className="space-y-2">
                        {report.strengths.map((strength: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-300">
                                <span className="text-green-400">•</span>
                                <span>{strength}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Challenges */}
                {report.challenges && report.challenges.length > 0 && (
                    <div className="bg-gray-900/50 border border-yellow-500/30 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-yellow-400 mb-4">⚠️ Potential Challenges</h3>
                        <ul className="space-y-2">
                            {report.challenges.map((challenge: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-300">
                                    <span className="text-yellow-400">•</span>
                                    <span>{challenge}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Recommendation */}
                <div className="bg-gradient-to-r from-pink-600/20 to-red-600/20 border border-pink-500/30 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-pink-400 mb-3">💡 Recommendation</h3>
                    <p className="text-gray-300">{report.recommendation}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        onClick={() => router.push("/matchmaker")}
                        variant="ghost"
                        className="flex-1 py-6"
                    >
                        Try Another Match
                    </Button>
                    <Button
                        onClick={() => router.push("/")}
                        className="flex-1 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 py-6"
                    >
                        Back to Home
                    </Button>
                </div>
            </div>
        </main>
    );
}

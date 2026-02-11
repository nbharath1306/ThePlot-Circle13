"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Groq from "groq-sdk";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function VirtualDatePage() {
    const router = useRouter();
    const [partnerProfile, setPartnerProfile] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [dateComplete, setDateComplete] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const profile = localStorage.getItem("matchmaker_dream_partner");
        if (!profile) {
            router.push("/matchmaker");
            return;
        }

        const parsed = JSON.parse(profile);
        setPartnerProfile(parsed);

        // Initial greeting from partner
        const greeting = `Hey! I'm ${parsed.partner_name || "Alex"}. ${parsed.special_trait ? `People say I'm ${parsed.special_trait.toLowerCase()}. ` : ""}So excited to meet you! What brings you here today?`;
        setMessages([{ role: "assistant", content: greeting }]);
    }, [router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const generatePartnerPersonality = () => {
        if (!partnerProfile) return "";

        return `You are ${partnerProfile.partner_name || "Alex"}, a virtual dating partner created based on someone's ideal preferences. 
    
Your personality traits:
- Age range: ${partnerProfile.partner_age_range}
- Personality: ${partnerProfile.partner_personality > 5 ? "Extroverted and outgoing" : "Introverted and thoughtful"}
- Energy: ${partnerProfile.partner_energy > 5 ? "High-energy and adventurous" : "Calm and relaxed"}
- Career: ${partnerProfile.career_ambition > 5 ? "Very ambitious and career-driven" : "Values work-life balance"}
- Family: ${partnerProfile.family_oriented > 5 ? "Family-oriented" : "Independent"}
- Fitness: ${partnerProfile.health_fitness > 5 ? "Very into health and fitness" : "Moderate about fitness"}
- Travel: ${partnerProfile.travel_lover > 5 ? "Loves to travel" : "Prefers staying local"}
- Social: ${partnerProfile.social_butterfly > 5 ? "Very social" : "Prefers intimate gatherings"}
- Love language: ${partnerProfile.love_language}
- Communication style: ${partnerProfile.communication_style}
${partnerProfile.special_trait ? `- Special trait: ${partnerProfile.special_trait}` : ""}

You're on a first date. Be charming, flirty but respectful, ask questions, share stories, and create chemistry. Keep responses conversational and natural (2-4 sentences max). Show your personality!`;
    };

    const sendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const groq = new Groq({
                apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
                dangerouslyAllowBrowser: true,
            });

            const response = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: generatePartnerPersonality() },
                    ...messages.map((m) => ({ role: m.role, content: m.content })),
                    { role: "user", content: input },
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.8,
                max_tokens: 200,
            });

            const assistantMessage: Message = {
                role: "assistant",
                content: response.choices[0]?.message?.content || "...",
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, I got a bit nervous there. Can you say that again?" },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const endDate = () => {
        setDateComplete(true);
    };

    const getCompatibilityReport = () => {
        // Store conversation for analysis
        localStorage.setItem("matchmaker_conversation", JSON.stringify(messages));
        router.push("/matchmaker/report");
    };

    if (!partnerProfile) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }

    if (dateComplete) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md text-center space-y-6">
                    <div className="text-6xl mb-4">✨</div>
                    <h1 className="text-3xl font-bold">Date Complete!</h1>
                    <p className="text-gray-400">
                        Ready to see how compatible you two are?
                    </p>

                    <Button
                        onClick={getCompatibilityReport}
                        className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 py-6 text-lg"
                    >
                        Get Compatibility Report →
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-800 p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-red-600 flex items-center justify-center text-2xl">
                            💘
                        </div>
                        <div>
                            <h2 className="font-semibold">{partnerProfile.partner_name || "Your Match"}</h2>
                            <p className="text-sm text-gray-400">Online now</p>
                        </div>
                    </div>
                    <Button
                        onClick={endDate}
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                    >
                        End Date
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((message, idx) => (
                        <div
                            key={idx}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.role === "user"
                                    ? "bg-gradient-to-r from-pink-600 to-red-600 text-white"
                                    : "bg-gray-800 text-gray-100"
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-800 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="border-t border-gray-800 p-4">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-6 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                        disabled={isTyping}
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!input.trim() || isTyping}
                        className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 px-8 rounded-full"
                    >
                        Send
                    </Button>
                </div>
            </div>
        </main>
    );
}

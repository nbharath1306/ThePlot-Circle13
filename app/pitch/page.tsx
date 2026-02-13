"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Copy, Check } from "lucide-react";

export default function PitchCreator() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        message: "",
        spotifyLink: "",
    });
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple Base64 encoding for the payload
        const payload = JSON.stringify(formData);
        const encoded = btoa(encodeURIComponent(payload)); // double encode for safety with emojis

        const link = `${window.location.origin}/pitch/view?d=${encoded}`;
        setGeneratedLink(link);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background Noise */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

            <div className="max-w-xl w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                        THE <span className="text-pink-500">PITCH</span>
                    </h1>
                    <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
                        Create the perfect proposal. No rejection possible.
                    </p>
                </motion.div>

                {!generatedLink ? (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-pink-500 tracking-widest uppercase block">
                                Who is the Co-Star?
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-display text-lg placeholder:text-gray-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-pink-500 tracking-widest uppercase block">
                                The Script
                            </label>
                            <textarea
                                required
                                placeholder="Write your message here..."
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-sans text-lg placeholder:text-gray-600 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-pink-500 tracking-widest uppercase block">
                                The Soundtrack (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="Spotify/YouTube URL"
                                value={formData.spotifyLink}
                                onChange={(e) => setFormData({ ...formData, spotifyLink: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-display text-lg placeholder:text-gray-600"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(236,72,153,0.3)] flex items-center justify-center gap-2"
                        >
                            <span className="tracking-widest uppercase font-mono">Generate Link</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-6 backdrop-blur-xl"
                    >
                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8" />
                        </div>

                        <h2 className="text-2xl font-bold">Pitch Ready using ThePlot 🎬</h2>
                        <p className="text-gray-400 text-sm">
                            Your cinematic proposal has been encoded. Send this link to your co-star.
                        </p>

                        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300 break-all border border-white/5">
                            {generatedLink}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={copyToClipboard}
                                className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy Link"}
                            </button>

                            <button
                                onClick={() => {
                                    setGeneratedLink("");
                                    setFormData({ name: "", message: "", spotifyLink: "" });
                                }}
                                className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors"
                            >
                                New Pitch
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
}

"use client";

import { useState } from "react";

interface ShareButtonsProps {
    outcomeName: string;
}

export default function ShareButtons({ outcomeName }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareText = `I just simulated my relationship on ThePlot! My outcome: "${outcomeName}" 🧪💚 Try it: `;
    const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://theplot.app";

    const handleTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + shareUrl)}`;
        window.open(url, "_blank");
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareText + shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-wrap gap-3">
            <button
                onClick={handleTwitter}
                className="px-4 py-2 border border-[#003300] text-sm hover:border-[#00ff00] hover:bg-[#00ff00]/5 transition-all tracking-widest"
            >
                SHARE_ON_X
            </button>
            <button
                onClick={handleCopy}
                className="px-4 py-2 border border-[#003300] text-sm hover:border-[#00ff00] hover:bg-[#00ff00]/5 transition-all tracking-widest"
            >
                {copied ? "COPIED ✓" : "COPY_LINK"}
            </button>
        </div>
    );
}

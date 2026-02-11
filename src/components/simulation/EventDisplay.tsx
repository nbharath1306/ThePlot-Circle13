"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface EventDisplayProps {
    events: string[];
    onAllDisplayed: () => void;
}

export default function EventDisplay({ events, onAllDisplayed }: EventDisplayProps) {
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        setVisibleCount(0);
    }, [events]);

    useEffect(() => {
        if (visibleCount >= events.length) {
            const timeout = setTimeout(onAllDisplayed, 1500);
            return () => clearTimeout(timeout);
        }

        const timeout = setTimeout(() => {
            setVisibleCount((prev) => prev + 1);
        }, 1200); // 1.2 seconds per event

        return () => clearTimeout(timeout);
    }, [visibleCount, events.length, onAllDisplayed]);

    return (
        <div className="space-y-3 min-h-[200px]">
            {events.slice(0, visibleCount).map((event, i) => (
                <TypewriterLine key={`${event}-${i}`} text={event} />
            ))}
            {visibleCount < events.length && (
                <span className="inline-block w-2 h-5 bg-[#00ff00] animate-pulse" />
            )}
        </div>
    );
}

function TypewriterLine({ text }: { text: string }) {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(interval);
        }, 25);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono"
        >
            <span className="text-[#003300] mr-2">{">"}</span>
            {displayText}
        </motion.div>
    );
}

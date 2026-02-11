"use client";

import { useEffect, useState, useMemo } from "react";

interface EventDisplayProps {
    events: string[];
    emotionalShift?: { trust: number; satisfaction: number; commitment: number };
    onAllDisplayed: () => void;
}

function classifyEvent(event: string, shift?: { trust: number; satisfaction: number; commitment: number }): "positive" | "conflict" | "milestone" {
    const lower = event.toLowerCase();
    const conflictWords = ["argument", "stress", "pressure", "distance", "challenge", "struggle", "crisis", "fight", "disagree", "conflict", "tension", "break"];
    const milestoneWords = ["first", "anniversary", "milestone", "celebrate", "together", "commit", "engaged", "married", "career breakthrough", "plan", "major life"];

    if (conflictWords.some((w) => lower.includes(w)) || (shift && (shift.trust < 0 || shift.satisfaction < -5))) {
        return "conflict";
    }
    if (milestoneWords.some((w) => lower.includes(w))) {
        return "milestone";
    }
    return "positive";
}

function eventIcon(type: "positive" | "conflict" | "milestone"): string {
    switch (type) {
        case "conflict": return "⚡";
        case "milestone": return "❤";
        default: return "▹";
    }
}

export default function EventDisplay({ events, emotionalShift, onAllDisplayed }: EventDisplayProps) {
    const [displayedCount, setDisplayedCount] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [typing, setTyping] = useState(false);

    const classified = useMemo(() => events.map((e) => ({
        text: e,
        type: classifyEvent(e, emotionalShift),
    })), [events, emotionalShift]);

    // Typewriter effect for each event
    useEffect(() => {
        if (displayedCount >= events.length) {
            const timer = setTimeout(onAllDisplayed, 1000);
            return () => clearTimeout(timer);
        }

        const fullText = events[displayedCount];
        setTyping(true);
        setCurrentText("");

        let charIndex = 0;
        const interval = setInterval(() => {
            charIndex++;
            setCurrentText(fullText.slice(0, charIndex));
            if (charIndex >= fullText.length) {
                clearInterval(interval);
                setTyping(false);
                setTimeout(() => setDisplayedCount((prev) => prev + 1), 600);
            }
        }, 25);

        return () => clearInterval(interval);
    }, [displayedCount, events, onAllDisplayed]);

    return (
        <div className="mt-6 space-y-3">
            {/* Already displayed events */}
            {classified.slice(0, displayedCount).map((event, i) => (
                <div
                    key={i}
                    className={`text-sm font-mono flex items-start gap-2 ${event.type === "conflict" ? "event-conflict" :
                            event.type === "milestone" ? "event-milestone" :
                                "event-positive"
                        }`}
                    style={{ opacity: 0.6 }}
                >
                    <span className="flex-shrink-0 mt-0.5">{eventIcon(event.type)}</span>
                    <span>{event.text}</span>
                </div>
            ))}

            {/* Currently typing event */}
            {displayedCount < events.length && (
                <div
                    className={`text-sm font-mono flex items-start gap-2 ${classified[displayedCount]?.type === "conflict" ? "event-conflict" :
                            classified[displayedCount]?.type === "milestone" ? "event-milestone" :
                                "event-positive"
                        }`}
                >
                    <span className="flex-shrink-0 mt-0.5">
                        {eventIcon(classified[displayedCount]?.type || "positive")}
                    </span>
                    <span>
                        {currentText}
                        {typing && (
                            <span
                                className="inline-block w-2 h-4 bg-current ml-0.5 align-middle"
                                style={{ animation: "blink-cursor 0.5s step-end infinite" }}
                            />
                        )}
                    </span>
                </div>
            )}
        </div>
    );
}

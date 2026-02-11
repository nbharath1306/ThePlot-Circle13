"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();

        const chars = "01アイウエオカキクケコサシスセソタチツテト♥∞⚡❤∑λθ";
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops: number[] = Array(columns).fill(1);
        // Random bright columns for visual pop
        const brightCols = new Set<number>();
        for (let i = 0; i < Math.floor(columns * 0.08); i++) {
            brightCols.add(Math.floor(Math.random() * columns));
        }

        let frame = 0;

        function draw() {
            if (!ctx || !canvas) return;

            // Slow fade trail
            ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const y = drops[i] * fontSize;

                if (brightCols.has(i)) {
                    // Bright neon green column
                    ctx.fillStyle = `rgba(0, 255, 0, ${0.5 + Math.sin(frame * 0.03 + i) * 0.3})`;
                    ctx.shadowColor = "#00ff00";
                    ctx.shadowBlur = 8;
                } else if (Math.random() < 0.01) {
                    // Rare cyan flash
                    ctx.fillStyle = "rgba(0, 229, 255, 0.7)";
                    ctx.shadowColor = "#00e5ff";
                    ctx.shadowBlur = 6;
                } else {
                    // Dim green default
                    ctx.fillStyle = "rgba(0, 60, 0, 0.7)";
                    ctx.shadowBlur = 0;
                }

                ctx.fillText(text, i * fontSize, y);
                ctx.shadowBlur = 0;

                // Head of column is always bright
                if (drops[i] > 0 && drops[i] < 3) {
                    ctx.fillStyle = "#00ff00";
                    ctx.shadowColor = "#00ff00";
                    ctx.shadowBlur = 10;
                    ctx.fillText(text, i * fontSize, y);
                    ctx.shadowBlur = 0;
                }

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                    // Occasionally shift bright columns
                    if (Math.random() < 0.05) {
                        brightCols.delete(i);
                        brightCols.add(Math.floor(Math.random() * columns));
                    }
                }
                drops[i]++;
            }

            frame++;
            animId = requestAnimationFrame(draw);
        }

        animId = requestAnimationFrame(draw);

        window.addEventListener("resize", resize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-50"
        />
    );
}

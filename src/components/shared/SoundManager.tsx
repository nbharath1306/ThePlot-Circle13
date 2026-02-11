"use client";

import { useCallback, useEffect, useRef } from "react";

// Synthesized sounds using Web Audio API — no external audio files needed
class SoundEngine {
    private ctx: AudioContext | null = null;

    private getCtx(): AudioContext {
        if (!this.ctx) {
            this.ctx = new AudioContext();
        }
        return this.ctx;
    }

    // Quick click sound for option selection
    click() {
        try {
            const ctx = this.getCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.08);
        } catch { /* silent fail */ }
    }

    // Whoosh sound for year transitions
    whoosh() {
        try {
            const ctx = this.getCtx();
            const bufferSize = ctx.sampleRate * 0.3;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = "bandpass";
            filter.frequency.setValueAtTime(2000, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
            filter.Q.setValueAtTime(2, ctx.currentTime);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            source.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            source.start(ctx.currentTime);
        } catch { /* silent fail */ }
    }

    // Success chime for simulation complete
    success() {
        try {
            const ctx = this.getCtx();
            const notes = [523, 659, 784]; // C5, E5, G5 — major chord arpeggio
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
                gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
                gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.12 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);
                osc.start(ctx.currentTime + i * 0.12);
                osc.stop(ctx.currentTime + i * 0.12 + 0.5);
            });
        } catch { /* silent fail */ }
    }

    // Low ambient hum
    startAmbient(): () => void {
        try {
            const ctx = this.getCtx();
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(55, ctx.currentTime);
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(82, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2);
            osc1.start();
            osc2.start();
            return () => {
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
                setTimeout(() => {
                    osc1.stop();
                    osc2.stop();
                }, 600);
            };
        } catch {
            return () => { };
        }
    }
}

// Singleton
let engineInstance: SoundEngine | null = null;

export function useSoundEngine() {
    const engineRef = useRef<SoundEngine | null>(null);

    useEffect(() => {
        if (!engineInstance) {
            engineInstance = new SoundEngine();
        }
        engineRef.current = engineInstance;
    }, []);

    const click = useCallback(() => engineRef.current?.click(), []);
    const whoosh = useCallback(() => engineRef.current?.whoosh(), []);
    const success = useCallback(() => engineRef.current?.success(), []);
    const startAmbient = useCallback(() => engineRef.current?.startAmbient() || (() => { }), []);

    return { click, whoosh, success, startAmbient };
}

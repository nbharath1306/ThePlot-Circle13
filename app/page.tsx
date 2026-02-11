"use client";

import { useRouter } from "next/navigation";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Disclaimer from "@/components/landing/Disclaimer";
import MatrixRain from "@/components/landing/MatrixRain";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/session/create", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        // Store QR data in sessionStorage for the session page
        sessionStorage.setItem(`qr_${data.sessionId}`, data.qrCodeDataUrl);
        sessionStorage.setItem(`url_${data.sessionId}`, data.qrCodeUrl);
        router.push(`/session/${data.sessionId}`);
      }
    } catch {
      // Fallback: navigate to a demo session
      router.push("/session/demo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <MatrixRain />

      <div className="relative z-10">
        <Hero onStart={loading ? () => { } : handleStart} />
        <HowItWorks />
        <Disclaimer />

        <footer className="text-center py-8 text-xs text-[#00ff00]/20 space-y-1">
          <p>ThePlot v1.0 — A CIRCLE13 EXPERIMENT</p>
          <p>NO PII STORED. ALL DATA EPHEMERAL. SESSIONS EXPIRE IN 30 MIN.</p>
        </footer>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <p className="animate-pulse text-lg tracking-[0.3em]">CREATING SESSION...</p>
        </div>
      )}
    </main>
  );
}

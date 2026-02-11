import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThePlot — AI Relationship Simulation",
  description: "AI-powered relationship simulation. Two players. Seven years. One algorithm. Discover your plot.",
  keywords: ["relationship", "simulation", "AI", "entertainment"],
  openGraph: {
    title: "ThePlot — What's Your Plot?",
    description: "AI-powered relationship simulation. Two players. Seven years. One algorithm.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="crt antialiased">
        {children}
      </body>
    </html>
  );
}

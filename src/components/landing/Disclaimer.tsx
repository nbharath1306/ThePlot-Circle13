"use client";

export default function Disclaimer() {
    return (
        <section className="relative z-10 max-w-2xl mx-auto my-12 px-4">
            <div className="border border-yellow-600/50 bg-yellow-900/10 p-6 text-sm">
                <h3 className="text-yellow-500 font-bold tracking-widest mb-3 text-base">
                    ⚠️ ENTERTAINMENT EXPERIENCE ONLY
                </h3>
                <ul className="space-y-1 text-yellow-500/70">
                    <li>• This is NOT a real prediction of your future</li>
                    <li>• This is NOT based on psychological science</li>
                    <li>• This is NOT relationship advice</li>
                    <li>• This is NOT a reason to make relationship decisions</li>
                </ul>
                <p className="mt-4 text-yellow-500/50 text-xs italic">
                    Relationships are shaped by choices, not algorithms. This is entertainment. Talk to your partner, not just AI.
                </p>
            </div>

            <div className="mt-4 border border-[#003300] p-4 text-xs text-[#00ff00]/40">
                <p className="font-bold mb-1">If you have real relationship concerns:</p>
                <ul className="space-y-0.5">
                    <li>• National Relationship Helpline: 1-800-799-7233</li>
                    <li>• Mental Health Resources: samhsa.gov</li>
                </ul>
            </div>
        </section>
    );
}

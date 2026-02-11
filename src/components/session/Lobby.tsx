"use client";

import { Session } from "@/types";
import QRCodeDisplay from "./QRCode";
import ConnectionStatus from "./ConnectionStatus";

interface LobbyProps {
    session: Session;
    qrCodeDataUrl: string;
    sessionUrl: string;
    onReady: () => void;
}

export default function Lobby({ session, qrCodeDataUrl, sessionUrl, onReady }: LobbyProps) {
    const userAConnected = !!session.users.userA;
    const userBConnected = !!session.users.userB;
    const bothConnected = userAConnected && userBConnected;

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 px-4">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold tracking-[0.2em] mb-2">SESSION_LOBBY</h2>
                <p className="text-sm text-[#00ff00]/50">
                    {bothConnected
                        ? "BOTH NODES CONNECTED. READY TO PROCEED."
                        : "WAITING FOR PARTNER NODE TO CONNECT..."}
                </p>
            </div>

            <ConnectionStatus userAConnected={userAConnected} userBConnected={userBConnected} />

            {!bothConnected && (
                <div className="mt-4">
                    <p className="text-xs text-[#00ff00]/40 text-center mb-4 tracking-widest">
                        SHARE THIS CODE WITH YOUR PARTNER
                    </p>
                    <QRCodeDisplay dataUrl={qrCodeDataUrl} sessionUrl={sessionUrl} />
                </div>
            )}

            {bothConnected && (
                <button
                    onClick={onReady}
                    className="mt-8 px-8 py-3 bg-[#00ff00] text-black font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors"
                >
                    [ INITIALIZE PERSONALITY CORE ]
                </button>
            )}
        </div>
    );
}

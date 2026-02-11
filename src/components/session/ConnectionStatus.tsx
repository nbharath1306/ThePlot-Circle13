"use client";

interface ConnectionStatusProps {
    userAConnected: boolean;
    userBConnected: boolean;
}

export default function ConnectionStatus({ userAConnected, userBConnected }: ConnectionStatusProps) {
    return (
        <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${userAConnected ? "bg-[#00ff00] shadow-[0_0_8px_#00ff00]" : "bg-[#333]"}`} />
                <span className={userAConnected ? "text-[#00ff00]" : "text-[#333]"}>USER_A</span>
            </div>
            <div className="text-[#003300]">──────</div>
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${userBConnected ? "bg-[#00ff00] shadow-[0_0_8px_#00ff00]" : "bg-[#333] animate-pulse"}`} />
                <span className={userBConnected ? "text-[#00ff00]" : "text-[#333]"}>USER_B</span>
            </div>
        </div>
    );
}

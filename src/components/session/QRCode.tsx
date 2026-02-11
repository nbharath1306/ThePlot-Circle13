"use client";

import Image from "next/image";

interface QRCodeDisplayProps {
    dataUrl: string;
    sessionUrl: string;
}

export default function QRCodeDisplay({ dataUrl, sessionUrl }: QRCodeDisplayProps) {
    return (
        <div className="flex flex-col items-center">
            <div className="border border-[#00ff00] p-2 bg-black shadow-[0_0_20px_rgba(0,255,0,0.15)]">
                {dataUrl ? (
                    <Image src={dataUrl} alt="QR Code" width={250} height={250} />
                ) : (
                    <div className="w-[250px] h-[250px] flex items-center justify-center text-[#003300]">
                        GENERATING...
                    </div>
                )}
            </div>
            <p className="mt-4 text-xs text-[#00ff00]/40 max-w-xs text-center break-all select-all cursor-pointer">
                {sessionUrl}
            </p>
        </div>
    );
}

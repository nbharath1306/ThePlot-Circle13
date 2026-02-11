import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get("url");

        if (!url) {
            return NextResponse.json({ error: "URL required" }, { status: 400 });
        }

        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            width: 400,
            margin: 2,
            color: {
                dark: "#8B5CF6", // Purple
                light: "#000000", // Black background
            },
        });

        return NextResponse.json({ qrCode: qrCodeDataUrl });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to generate QR code" },
            { status: 500 }
        );
    }
}

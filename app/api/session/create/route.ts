import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
    try {
        const sessionId = Math.random().toString(36).substring(2, 15);
        const session = await createSession(sessionId);

        return NextResponse.json({ sessionId, session });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to create session" },
            { status: 500 }
        );
    }
}

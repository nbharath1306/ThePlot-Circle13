import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/session";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sessionId, role, answers, ready } = body;

        if (!sessionId || !role) {
            return NextResponse.json(
                { error: "Session ID and role required" },
                { status: 400 }
            );
        }

        const updates: any = {};

        if (role === "creator") {
            if (answers) updates.creatorAnswers = answers;
            if (ready !== undefined) updates.creatorReady = ready;
        } else {
            if (answers) updates.joinerAnswers = answers;
            if (ready !== undefined) updates.joinerReady = ready;
        }

        await updateSession(sessionId, updates);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to update session" },
            { status: 500 }
        );
    }
}

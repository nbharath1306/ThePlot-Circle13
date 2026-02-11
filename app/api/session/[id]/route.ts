import { NextResponse } from 'next/server';
import { getSession } from '@/lib/sessions';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = getSession(id);

    if (!session) {
        return NextResponse.json(
            { success: false, error: 'Session not found', code: 'SESSION_NOT_FOUND' },
            { status: 404 }
        );
    }

    return NextResponse.json({ success: true, session });
}

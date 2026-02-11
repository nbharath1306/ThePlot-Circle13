import { NextResponse } from 'next/server';
import { getSession, updateSession } from '@/lib/sessions';
import { SessionJoinSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId, userId } = SessionJoinSchema.parse(body);

        const session = getSession(sessionId);
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Session not found', code: 'SESSION_NOT_FOUND' },
                { status: 404 }
            );
        }

        if (session.status === 'expired') {
            return NextResponse.json(
                { success: false, error: 'Session expired', code: 'SESSION_EXPIRED' },
                { status: 410 }
            );
        }

        if (session.users.userA && session.users.userB) {
            return NextResponse.json(
                { success: false, error: 'Session already full', code: 'SESSION_FULL' },
                { status: 409 }
            );
        }

        // Assign as userA if empty, else userB
        const now = Date.now();
        if (!session.users.userA) {
            session.users.userA = { userId, answers: [], connected: true, lastSeen: now };
        } else {
            session.users.userB = { userId, answers: [], connected: true, lastSeen: now };
            session.status = 'active';
        }

        updateSession(sessionId, session);
        logger.info('User joined session', { sessionId, userId });

        return NextResponse.json({ success: true, session });
    } catch (error) {
        logger.error('Join session failed', error);
        return NextResponse.json(
            { success: false, error: 'Invalid request', code: 'VALIDATION_ERROR' },
            { status: 400 }
        );
    }
}

import { NextResponse } from 'next/server';
import { getSession, updateSession } from '@/lib/sessions';
import { SessionAnswerSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId, userId, answers } = SessionAnswerSchema.parse(body);

        const session = getSession(sessionId);
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Session not found', code: 'SESSION_NOT_FOUND' },
                { status: 404 }
            );
        }

        // Find which user is submitting
        const isUserA = session.users.userA?.userId === userId;
        const isUserB = session.users.userB?.userId === userId;

        if (!isUserA && !isUserB) {
            return NextResponse.json(
                { success: false, error: 'User not in session', code: 'VALIDATION_ERROR' },
                { status: 400 }
            );
        }

        // Store answers
        if (isUserA && session.users.userA) {
            session.users.userA.answers = answers;
        } else if (isUserB && session.users.userB) {
            session.users.userB.answers = answers;
        }

        updateSession(sessionId, session);

        const bothReady =
            (session.users.userA?.answers?.length ?? 0) === 3 &&
            (session.users.userB?.answers?.length ?? 0) === 3;

        logger.info('Answers submitted', { sessionId, userId, bothReady });

        return NextResponse.json({
            success: true,
            bothUsersReady: bothReady,
            message: bothReady ? 'Answers submitted. Starting simulation...' : 'Answers submitted. Waiting for partner.',
        });
    } catch (error) {
        logger.error('Submit answers failed', error);
        return NextResponse.json(
            { success: false, error: 'Invalid answer format', code: 'VALIDATION_ERROR' },
            { status: 400 }
        );
    }
}

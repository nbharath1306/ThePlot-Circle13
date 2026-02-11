import { NextResponse } from 'next/server';
import { getSession, updateSession } from '@/lib/sessions';
import { SimulateSchema } from '@/lib/validation';
import { runSimulation } from '@/lib/groq';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId } = SimulateSchema.parse(body);

        const session = getSession(sessionId);
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Session not found', code: 'SESSION_NOT_FOUND' },
                { status: 404 }
            );
        }

        if (!session.users.userA || !session.users.userB) {
            return NextResponse.json(
                { success: false, error: 'Both users must be connected', code: 'VALIDATION_ERROR' },
                { status: 400 }
            );
        }

        logger.info('Simulation starting', { sessionId });

        const simulation = await runSimulation(session.users.userA, session.users.userB);

        session.simulation = simulation;
        session.status = 'completed';
        updateSession(sessionId, session);

        logger.info('Simulation completed', { sessionId, outcome: simulation.outcome });

        return NextResponse.json({ success: true, simulation });
    } catch (error) {
        logger.error('Simulation failed', error);
        return NextResponse.json(
            { success: false, error: 'AI service unavailable', code: 'AI_SERVICE_ERROR' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { getSession, updateSession } from '@/lib/sessions';
import { SimulateSchema } from '@/lib/validation';
import { runLifetimeSimulation } from '@/lib/lifetime_engine';
import { buildPersona } from '@/lib/personaBuilder';
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

        // Ensure answers exist
        if (!session.users.userA.answers?.length || !session.users.userB.answers?.length) {
            return NextResponse.json(
                { success: false, error: 'Incomplete assessments', code: 'VALIDATION_ERROR' },
                { status: 400 }
            );
        }

        logger.info('Simulation starting', { sessionId });

        // Build Personas (New Logic)
        const personaA = buildPersona(session.users.userA.answers);
        const personaB = buildPersona(session.users.userB.answers);

        // Run Lifetime Simulation
        const simulation = await runLifetimeSimulation(personaA, personaB);

        session.simulation = simulation;
        session.status = 'completed';
        updateSession(sessionId, session);

        logger.info('Simulation completed', { sessionId, verdict: simulation.verdict.title });

        return NextResponse.json({ success: true, simulation });
    } catch (error) {
        logger.error('Simulation failed', error as unknown as Error);
        return NextResponse.json(
            { success: false, error: 'AI service unavailable', code: 'AI_SERVICE_ERROR' },
            { status: 500 }
        );
    }
}

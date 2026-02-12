import { NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/storage';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const session = await getSession(id);
    if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(session);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, id, role, status, agent } = body;

        if (action === 'create') {
            const newId = Math.random().toString(36).substring(2, 10);
            const session = await saveSession(newId, {
                id: newId,
                created_at: Date.now(),
                status_A: 'answering',
                status_B: 'waiting'
            });
            return NextResponse.json(session);
        }

        if (action === 'update') {
            if (!id || !role) {
                return NextResponse.json({ error: 'Missing id or role' }, { status: 400 });
            }

            // role is "A" or "B"
            const updateData: any = {};
            if (status) updateData[`status_${role}`] = status;
            if (agent) updateData[`agent_${role}`] = agent;
            if (typeof body.progress === 'number') updateData[`progress_${role}`] = body.progress;
            updateData[`last_active_${role}`] = Date.now();

            const session = await saveSession(id, updateData);
            return NextResponse.json(session);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

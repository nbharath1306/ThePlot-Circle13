import { Session } from '@/types';
import { randomUUID } from 'crypto';

// ─── In-Memory Session Store ────────────────────────────────
// Replaces Supabase for cost-cutting. Works for single-server MVP.
// Sessions auto-expire after 30 minutes.

const sessions = new Map<string, Session>();

const TTL_MS = 30 * 60 * 1000; // 30 minutes

// Cleanup expired sessions every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [id, session] of sessions) {
        if (session.expires_at < now) {
            sessions.delete(id);
        }
    }
}, 5 * 60 * 1000);

export function createSession(): Session {
    const id = randomUUID();
    const now = Date.now();
    const session: Session = {
        id,
        created_at: now,
        expires_at: now + TTL_MS,
        status: 'waiting',
        users: { userA: null, userB: null },
    };
    sessions.set(id, session);
    return session;
}

export function getSession(id: string): Session | undefined {
    const session = sessions.get(id);
    if (!session) return undefined;
    if (session.expires_at < Date.now()) {
        session.status = 'expired';
        sessions.delete(id);
        return undefined;
    }
    return session;
}

export function updateSession(id: string, update: Partial<Session>): Session | undefined {
    const session = getSession(id);
    if (!session) return undefined;
    Object.assign(session, update);
    sessions.set(id, session);
    return session;
}

export function deleteSession(id: string): boolean {
    return sessions.delete(id);
}

import { Redis } from '@upstash/redis';

// Initialize Redis client
// For local development, we'll use a mock
const redis = process.env.UPSTASH_REDIS_REST_URL
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

export interface SessionData {
    id: string;
    creatorReady: boolean;
    joinerReady: boolean;
    creatorAnswers: Record<string, any>;
    joinerAnswers: Record<string, any>;
    createdAt: number;
}

export async function createSession(sessionId: string): Promise<SessionData> {
    const session: SessionData = {
        id: sessionId,
        creatorReady: false,
        joinerReady: false,
        creatorAnswers: {},
        joinerAnswers: {},
        createdAt: Date.now(),
    };

    if (redis) {
        await redis.set(`session:${sessionId}`, JSON.stringify(session), {
            ex: 3600, // Expire after 1 hour
        });
    } else {
        // Fallback to localStorage for local dev
        if (typeof window !== 'undefined') {
            localStorage.setItem(`session_${sessionId}`, JSON.stringify(session));
        }
    }

    return session;
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
    if (redis) {
        const data = await redis.get(`session:${sessionId}`);
        return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
    } else {
        // Fallback to localStorage for local dev
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem(`session_${sessionId}`);
            return data ? JSON.parse(data) : null;
        }
    }
    return null;
}

export async function updateSession(sessionId: string, updates: Partial<SessionData>): Promise<void> {
    const session = await getSession(sessionId);
    if (!session) return;

    const updated = { ...session, ...updates };

    if (redis) {
        await redis.set(`session:${sessionId}`, JSON.stringify(updated), {
            ex: 3600,
        });
    } else {
        if (typeof window !== 'undefined') {
            localStorage.setItem(`session_${sessionId}`, JSON.stringify(updated));
        }
    }
}

import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.NODE_ENV === 'production'
    ? '/tmp/sessions.json'
    : path.join(process.cwd(), 'data', 'sessions.json');

export interface SessionData {
    id: string;
    created_at: number;
    status_A: 'answering' | 'done';
    status_B: 'waiting' | 'answering' | 'done';
    progress_A?: number;
    progress_B?: number;
    last_active_A?: number;
    last_active_B?: number;
    agent_A?: any;
    agent_B?: any;
}

// Helper to ensure directory exists
const ensureDb = () => {
    if (process.env.NODE_ENV !== 'production' && !fs.existsSync(path.dirname(DB_PATH))) {
        fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    }
};

async function getFsSessions(): Promise<Record<string, SessionData>> {
    if (!fs.existsSync(DB_PATH)) {
        return {};
    }
    try {
        const data = await fs.promises.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// Helper to get KV config
const getKvConfig = () => {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    return { url, token };
};

export async function getSession(id: string): Promise<SessionData | null> {
    const { url, token } = getKvConfig();

    // KV Implementation
    if (url && token) {
        try {
            // Using Vercel KV REST API commands
            // GET session:{id}
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(["GET", `session:${id}`]),
                cache: 'no-store'
            });

            if (res.ok) {
                const json = await res.json();
                if (json.result) {
                    return typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
                }
                return null;
            }
        } catch (e) {
            console.error("KV Get Error", e);
            return null;
        }
    }

    // FS Implementation
    const sessions = await getFsSessions();
    return sessions[id] || null;
}

export async function saveSession(id: string, data: Partial<SessionData>): Promise<SessionData> {
    const { url, token } = getKvConfig();

    // KV Implementation
    if (url && token) {
        // Fetch current to merge
        let current = await getSession(id);
        if (!current) {
            current = {
                id,
                created_at: Date.now(),
                status_A: 'answering',
                status_B: 'waiting'
            };
        }

        const updated = { ...current, ...data };

        try {
            // SET session:{id} value EX 86400 (24 hours)
            await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(["SET", `session:${id}`, JSON.stringify(updated), "EX", 86400])
            });
        } catch (e) {
            console.error("KV Save Error", e);
        }

        return updated;
    }

    // FS Implementation
    ensureDb();
    const sessions = await getFsSessions();

    const current = sessions[id] || {
        id,
        created_at: Date.now(),
        status_A: 'answering',
        status_B: 'waiting'
    };

    const updated = { ...current, ...data };
    sessions[id] = updated as SessionData;

    await fs.promises.writeFile(DB_PATH, JSON.stringify(sessions, null, 2));
    return updated as SessionData;
}

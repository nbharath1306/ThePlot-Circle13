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

export function getSessions(): Record<string, SessionData> {
    if (!fs.existsSync(DB_PATH)) {
        return {};
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

export function saveSession(id: string, data: Partial<SessionData>) {
    const sessions = getSessions();
    const current = sessions[id] || {
        id,
        created_at: Date.now(),
        status_A: 'answering',
        status_B: 'waiting'
    };

    sessions[id] = { ...current, ...data };

    fs.writeFileSync(DB_PATH, JSON.stringify(sessions, null, 2));
    return sessions[id];
}

export function getSession(id: string): SessionData | null {
    const sessions = getSessions();
    return sessions[id] || null;
}

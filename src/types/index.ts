// ─── Core Data Models ───────────────────────────────────────

export interface Session {
    id: string;
    created_at: number;
    expires_at: number;
    status: SessionStatus;
    users: {
        userA: UserData | null;
        userB: UserData | null;
    };
    simulation?: SimulationResult;
}

export type SessionStatus = 'waiting' | 'active' | 'completed' | 'expired';

export interface UserData {
    userId: string;
    answers: Answer[];
    connected: boolean;
    lastSeen: number;
}

export interface Answer {
    questionId: string;
    value: string;
    timestamp: number;
}

// ─── Simulation ─────────────────────────────────────────────

export interface SimulationResult {
    timeline: YearEvent[];
    outcome: OutcomeType;
    outcomeName: string;
    insights: string[];
    emotionalMetrics: EmotionalState[];
}

export interface YearEvent {
    year: number;
    events: string[];
    emotionalShift: {
        trust: number;
        satisfaction: number;
        commitment: number;
    };
}

export type OutcomeType =
    | 'success_strong'
    | 'success_engaged'
    | 'success_thriving'
    | 'success_growing'
    | 'challenge_break'
    | 'challenge_different_paths'
    | 'challenge_timing';

export const OUTCOME_NAMES: Record<OutcomeType, string> = {
    success_strong: 'Still Together: Strong Foundation',
    success_engaged: 'Engaged: Ready for Next Chapter',
    success_thriving: 'Thriving: Best Friends & Partners',
    success_growing: 'Growing Together: Communication Masters',
    challenge_break: 'Taking a Break: Reassessing Priorities',
    challenge_different_paths: 'Friendly Separation: Different Paths',
    challenge_timing: 'On Pause: Timing Wasn\'t Right',
};

export interface EmotionalState {
    year: number;
    trust: number;
    satisfaction: number;
    commitment: number;
}

// ─── Questions ──────────────────────────────────────────────

export interface Question {
    id: string;
    text: string;
    options: string[];
}

// ─── Session Stage ──────────────────────────────────────────

export type SessionStage = 'lobby' | 'questions' | 'simulation' | 'results';

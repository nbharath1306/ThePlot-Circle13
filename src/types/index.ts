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
    persona?: PersonaProfile;
    connected: boolean;
    lastSeen: number;
}

export interface Answer {
    questionId: string;
    dimension: PsychologicalDimension;
    score: number; // 0-4 scale usually
    value: string; // The text of the selected option
    timestamp: number;
}

// ─── Psychometrics ──────────────────────────────────────────

export type PsychologicalDimension =
    | 'openness'
    | 'conscientiousness'
    | 'extraversion'
    | 'agreeableness'
    | 'neuroticism'
    | 'attachment'
    | 'love_language'
    | 'conflict'
    | 'values'
    | 'emotional_intelligence';

export interface PersonaProfile {
    big5: {
        openness: number;
        conscientiousness: number;
        extraversion: number;
        agreeableness: number;
        neuroticism: number;
    };
    attachmentStyle: 'secure' | 'anxious' | 'avoidant' | 'disorganized';
    loveLanguage: 'words' | 'time' | 'acts' | 'touch' | 'gifts';
    conflictStyle: 'compete' | 'collaborate' | 'compromise' | 'avoid' | 'accommodate';
    values: string[];
    emotionalIntelligence: {
        selfAwareness: number;
        empathy: number;
        regulation: number;
    };
    communicationStyle: 'direct' | 'indirect' | 'analytical' | 'emotional';
    dealBreakers: string[];
    systemPrompt: string;
}

export interface Question {
    id: string;
    text: string;
    dimension: PsychologicalDimension;
    options: Option[];
}

export interface Option {
    label: string;
    score: number; // Mapping to dimension score
    value: string; // Specific trait key if needed
}

// ─── Simulation ─────────────────────────────────────────────

export interface SimulationResult {
    scenarios: ScenarioResult[];
    compatibility: CompatibilityReport;
    timeline: YearEvent[]; // Kept for legacy UI compatibility
    outcome: string; // Kept for legacy UI compatibility
    emotionalMetrics: EmotionalState[]; // Kept for legacy UI compatibility
}

export interface ScenarioResult {
    id: string;
    title: string;
    transcript: DialogueTurn[];
    emotionalShift: EmotionalState;
    analysis: string;
}

export interface DialogueTurn {
    speaker: 'A' | 'B' | 'Narrator';
    content: string;
    emotion?: string;
}

export interface CompatibilityReport {
    overallScore: number;
    dimensions: {
        dimension: PsychologicalDimension;
        score: number; // 0-100 compatibility
        analysis: string;
    }[];
    strengths: string[];
    challenges: string[];
    prediction: string;
}

// ─── Legacy / Mixed Types ───────────────────────────────────

export interface YearEvent {
    year: number;
    events: string[];
    emotionalShift: {
        trust: number;
        satisfaction: number;
        commitment: number;
    };
}

export interface EmotionalState {
    year?: number;
    trust: number;
    satisfaction: number;
    commitment: number;
}

export const DIMENSION_LABELS: Record<PsychologicalDimension, string> = {
    openness: 'Big 5: Openness',
    conscientiousness: 'Big 5: Conscientiousness',
    extraversion: 'Big 5: Extraversion',
    agreeableness: 'Big 5: Agreeableness',
    neuroticism: 'Big 5: Neuroticism',
    attachment: 'Attachment Style',
    love_language: 'Love Language',
    conflict: 'Conflict Resolution',
    values: 'Values & Life Goals',
    emotional_intelligence: 'Emotional Intelligence',
};


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

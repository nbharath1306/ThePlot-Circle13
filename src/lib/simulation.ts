import { Answer, YearEvent, EmotionalState } from '@/types';

export function buildPersonality(answers: Answer[]): string {
    const q1 = answers.find(a => a.questionId === 'q1')?.value ?? 'Unknown';
    const q2 = answers.find(a => a.questionId === 'q2')?.value ?? 'Unknown';
    const q3 = answers.find(a => a.questionId === 'q3')?.value ?? 'Unknown';

    return `Communication Style: ${q1}\nCore Value: ${q2}\nConflict Response: ${q3}`;
}

export function calculateMetrics(years: YearEvent[]): EmotionalState[] {
    let trust = 50;
    let satisfaction = 50;
    let commitment = 50;

    return years.map(year => {
        trust += year.emotionalShift.trust;
        satisfaction += year.emotionalShift.satisfaction;
        commitment += year.emotionalShift.commitment;

        return {
            year: year.year,
            trust: Math.max(0, Math.min(100, trust)),
            satisfaction: Math.max(0, Math.min(100, satisfaction)),
            commitment: Math.max(0, Math.min(100, commitment)),
        };
    });
}

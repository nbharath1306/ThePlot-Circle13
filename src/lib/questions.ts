import { Question } from '@/types';

export const questions: Question[] = [
    {
        id: 'q1',
        text: 'When stressed, I tend to:',
        options: ['Talk it out', 'Need alone time', 'Get irritable', 'Stay calm'],
    },
    {
        id: 'q2',
        text: 'Most important to me in a relationship:',
        options: ['Trust', 'Fun', 'Growth', 'Stability'],
    },
    {
        id: 'q3',
        text: 'If my partner forgot our anniversary, I would:',
        options: [
            'Be hurt but talk about it',
            'Get very upset',
            'Brush it off',
            'Plan something anyway',
        ],
    },
];

export function getQuestions(): Question[] {
    return questions;
}

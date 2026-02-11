import { z } from 'zod';

export const AnswerSchema = z.object({
    questionId: z.string(),
    dimension: z.string(),
    value: z.string(),
    score: z.number(),
    timestamp: z.number(),
});

export const SessionJoinSchema = z.object({
    sessionId: z.string().uuid(),
    userId: z.string().min(1).max(100),
});

export const SessionAnswerSchema = z.object({
    sessionId: z.string().uuid(),
    userId: z.string().min(1).max(100),
    answers: z.array(AnswerSchema).min(1), // Allow incremental updates or full submission
});

export const SimulateSchema = z.object({
    sessionId: z.string().uuid(),
});

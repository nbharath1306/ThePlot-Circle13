import { z } from 'zod';

export const AnswerSchema = z.object({
    questionId: z.string().regex(/^q[1-3]$/),
    value: z.string().min(1).max(200),
    timestamp: z.number(),
});

export const SessionJoinSchema = z.object({
    sessionId: z.string().uuid(),
    userId: z.string().min(1).max(100),
});

export const SessionAnswerSchema = z.object({
    sessionId: z.string().uuid(),
    userId: z.string().min(1).max(100),
    answers: z.array(AnswerSchema).length(3),
});

export const SimulateSchema = z.object({
    sessionId: z.string().uuid(),
});

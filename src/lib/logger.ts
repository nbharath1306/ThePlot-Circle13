/* eslint-disable @typescript-eslint/no-explicit-any */
export const logger = {
    info: (message: string, meta?: Record<string, any>) => {
        console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
    },
    error: (message: string, error?: Error | unknown, meta?: Record<string, any>) => {
        const err = error instanceof Error ? error : undefined;
        console.error(JSON.stringify({
            level: 'error',
            message,
            error: err?.message,
            stack: err?.stack,
            ...meta,
            timestamp: new Date().toISOString(),
        }));
    },
    warn: (message: string, meta?: Record<string, any>) => {
        console.warn(JSON.stringify({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() }));
    },
};

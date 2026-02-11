import { NextResponse } from 'next/server';
import { createSession } from '@/lib/sessions';
import { logger } from '@/lib/logger';
import QRCode from 'qrcode';

export async function POST() {
    try {
        const session = createSession();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const sessionUrl = `${baseUrl}/session/${session.id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(sessionUrl, {
            width: 300,
            margin: 2,
            color: { dark: '#00ff00', light: '#000000' },
        });

        logger.info('Session created', { sessionId: session.id });

        return NextResponse.json({
            success: true,
            sessionId: session.id,
            qrCodeUrl: sessionUrl,
            qrCodeDataUrl,
            expiresAt: session.expires_at,
        });
    } catch (error) {
        logger.error('Failed to create session', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create session', code: 'SESSION_CREATE_FAILED' },
            { status: 500 }
        );
    }
}

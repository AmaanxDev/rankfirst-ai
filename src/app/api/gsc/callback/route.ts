import { NextRequest, NextResponse } from 'next/server';
import { encrypt } from '@/lib/crypto';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
        return NextResponse.redirect(
            new URL('/settings?error=gsc_access_denied', request.url)
        );
    }

    try {
        // 1. Exchange authorization code for tokens with Google
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GSC_CLIENT_ID!,
                client_secret: process.env.GSC_CLIENT_SECRET!,
                redirect_uri: process.env.GSC_REDIRECT_URI!,
                grant_type: 'authorization_code',
            }),
        });

        const tokens = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Token Exchange Error:', tokens);
            return NextResponse.redirect(
                new URL('/settings?error=token_exchange_failed', request.url)
            );
        }

        const { access_token, refresh_token } = tokens;

        // 2. Encrypt tokens using our AES-256-GCM helper
        const encryptedAccessToken = encrypt(access_token);
        const encryptedRefreshToken = refresh_token ? encrypt(refresh_token) : null;

        // Logged for verification until Turso DB client is connected
        console.log('Successfully Encrypted Tokens:', {
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
        });

        // 3. Redirect user back to settings with success status
        return NextResponse.redirect(
            new URL('/settings?status=gsc_connected', request.url)
        );
    } catch (err) {
        console.error('GSC Callback Error:', err);
        return NextResponse.redirect(
            new URL('/settings?error=server_error', request.url)
        );
    }
}
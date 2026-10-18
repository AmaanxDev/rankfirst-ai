import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GSC_CLIENT_ID;
  const redirectUri = process.env.GSC_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'GSC OAuth environment variables are missing.' },
      { status: 500 }
    );
  }

  // Define required Google Search Console scope
  const scope = 'https://www.googleapis.com/auth/webmasters.readonly';

  // Construct Google OAuth URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', scope);
  googleAuthUrl.searchParams.set('access_type', 'offline'); // Ensures we get a refresh_token
  googleAuthUrl.searchParams.set('prompt', 'consent'); // Forces refresh_token issuance

  return NextResponse.redirect(googleAuthUrl.toString());
}
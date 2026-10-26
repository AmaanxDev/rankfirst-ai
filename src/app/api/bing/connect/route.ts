import { NextRequest, NextResponse } from 'next/server';
import { encrypt } from '@/lib/crypto';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { error: 'Bing Webmaster API Key is required.' },
        { status: 400 }
      );
    }

    // 1. Validate the API Key with Bing Webmaster API
    const bingRes = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/GetUserSites?apikey=${encodeURIComponent(apiKey.trim())}`
    );

    if (!bingRes.ok) {
      return NextResponse.json(
        { error: 'Invalid Bing API Key. Please verify your key in Bing Webmaster Tools.' },
        { status: 401 }
      );
    }

    const data = await bingRes.json();
    const sites = data.d || [];

    // 2. Encrypt the API Key using our AES-256-GCM helper
    const encryptedApiKey = encrypt(apiKey.trim());

    console.log('Bing API Key Verified:', {
      siteCount: sites.length,
      encryptedKey: encryptedApiKey,
    });

    return NextResponse.json({
      success: true,
      siteCount: sites.length,
      sites: sites.map((site: { Url: string }) => site.Url),
    });
  } catch (err) {
    console.error('Bing Connection Error:', err);
    return NextResponse.json(
      { error: 'Failed to connect to Bing Webmaster Tools.' },
      { status: 500 }
    );
  }
}
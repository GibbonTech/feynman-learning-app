import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/demo?error=notion_auth_failed', request.url));
  }

  if (!code) {
    // Real OAuth flow
    const notionClientId = process.env.NOTION_CLIENT_ID;
    const redirectUri = process.env.NOTION_REDIRECT_URI;

    if (!notionClientId || !redirectUri) {
      return NextResponse.json(
        {
          error: 'Notion OAuth not configured. Please set NOTION_CLIENT_ID and NOTION_CLIENT_SECRET in your .env.local file.',
          setup_url: '/demo/setup'
        },
        { status: 500 }
      );
    }

    const authUrl = new URL('https://api.notion.com/v1/oauth/authorize');
    authUrl.searchParams.set('client_id', notionClientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('owner', 'user');
    authUrl.searchParams.set('redirect_uri', redirectUri);

    return NextResponse.redirect(authUrl.toString());
  }

  // Exchange code for access token
  try {
    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NOTION_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Store the access token in a cookie or session
    // For demo purposes, we'll redirect with the token as a query parameter
    // In production, you'd want to store this securely
    const response = NextResponse.redirect(new URL('/?notion_connected=true', request.url));
    response.cookies.set('notion_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Notion OAuth error:', error);
    return NextResponse.redirect(new URL('/?error=notion_auth_failed', request.url));
  }
}

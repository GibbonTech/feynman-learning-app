import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirectUrl') || '/demo';

  // For public demo, just redirect to the demo page
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}

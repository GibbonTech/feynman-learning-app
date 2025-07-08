import { NextResponse } from 'next/server';

// Disabled auth for public demo
export async function GET() {
  return NextResponse.redirect(new URL('/demo', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
}

export async function POST() {
  return NextResponse.redirect(new URL('/demo', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
}

import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    console.log('Environment check:');
    console.log('- GROQ_API_KEY exists:', !!groqApiKey);
    console.log('- GROQ_API_KEY length:', groqApiKey?.length);
    console.log('- GROQ_API_KEY starts with gsk_:', groqApiKey?.startsWith('gsk_'));

    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    console.log('Testing Groq API with key:', groqApiKey.substring(0, 10) + '...');

    // Test direct API call to Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      response: data.choices[0]?.message?.content || 'No response',
      usage: data.usage,
    });

  } catch (error) {
    console.error('Groq API test error:', error);
    return NextResponse.json(
      {
        error: 'Failed to test Groq API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

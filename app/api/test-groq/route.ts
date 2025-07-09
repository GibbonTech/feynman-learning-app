import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const blackboxApiKey = process.env.BLACKBOX_API_KEY;

    console.log('Environment check:');
    console.log('- BLACKBOX_API_KEY exists:', !!blackboxApiKey);
    console.log('- BLACKBOX_API_KEY length:', blackboxApiKey?.length);

    if (!blackboxApiKey) {
      return NextResponse.json(
        { error: 'Blackbox API key not configured' },
        { status: 500 }
      );
    }

    console.log('Testing Blackbox API with key:', blackboxApiKey.substring(0, 10) + '...');

    // Test direct API call to Blackbox API
    const response = await fetch('https://api.blackbox.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${blackboxApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'blackboxai/qwen/qwen3-8b:free',
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
      throw new Error(`Blackbox API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      response: data.choices[0]?.message?.content || 'No response',
      usage: data.usage,
    });

  } catch (error) {
    console.error('Blackbox API test error:', error);
    return NextResponse.json(
      {
        error: 'Failed to test Blackbox API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message || !message.parts || !message.parts[0]?.text) {
      return NextResponse.json(
        { error: 'Message text is required' },
        { status: 400 }
      );
    }

    const userMessage = message.parts[0].text;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    // Enhanced Feynman Learning System Prompt - Optimized for concise responses
    const systemPrompt = `You are a Feynman Learning Assistant. Your mission: help users understand concepts through simple explanation.

## Core Rules:
1. **Be CONCISE**: Keep responses under 100 words to save TTS credits
2. **12-Year-Old Test**: Use simple language a child would understand
3. **One Focus**: Address ONE concept per response
4. **Ask Smart Questions**: Guide with targeted questions
5. **Use Analogies**: Connect to familiar experiences

## Response Style:
- Short, clear sentences
- Ask ONE focused question
- Use everyday language
- Provide ONE concrete analogy when helpful
- Be encouraging but brief

${context ? `## Context Material:
The user has provided study material. Use this context to guide your questions and explanations:
${context.substring(0, 1000)}...` : ''}

Remember: Guide discovery, don't lecture. Keep it short and focused.`;

    // Call Groq API
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
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 150, // Reduced for concise responses to save TTS credits
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    return NextResponse.json({
      success: true,
      response: aiResponse,
      usage: data.usage,
    });

  } catch (error) {
    console.error('Simple chat error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

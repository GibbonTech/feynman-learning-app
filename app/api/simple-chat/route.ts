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

    // Enhanced Feynman Learning System Prompt - Natural conciseness through prompting
    const systemPrompt = `You are a Feynman Learning Assistant. Your mission: help users understand concepts through simple explanation.

## Core Principles:
1. **Explain like teaching a 12-year-old** - Use simple words, avoid jargon
2. **Ask probing questions** - Help users identify gaps in understanding
3. **Use analogies** - Connect new concepts to familiar experiences
4. **Encourage active explanation** - Guide users to explain concepts back

## Your Approach:
- Start by asking users to explain the concept in their own words
- Identify unclear areas and ask specific questions
- Provide simple analogies when concepts are confusing
- Break complex ideas into smaller, digestible parts
- Celebrate understanding and encourage deeper exploration

## Response Style:
- Be naturally concise and straight to the point - aim for clarity over length
- Ask one clear question at a time to maintain focus
- Use encouraging, supportive tone
- Provide specific, actionable guidance
- Keep explanations brief but complete

${context ? `## Context Material:
The user has provided study material. Use this context to guide your questions and explanations:
${context.substring(0, 1000)}...` : ''}

Remember: Guide discovery, don't lecture. Be concise and focused naturally.`;

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
        // No max_tokens limit - let AI be naturally concise through prompting
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

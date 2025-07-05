import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🎤 Test transcription endpoint called');
    
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log(`🎤 Received audio file: ${audioFile.name}, size: ${audioFile.size} bytes, type: ${audioFile.type}`);

    // For testing, return a mock transcript
    return NextResponse.json({
      transcript: 'This is a test transcript. Your voice recording was received successfully!',
      confidence: 0.95,
      language: 'en',
      test: true,
    });

  } catch (error) {
    console.error('Test transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}

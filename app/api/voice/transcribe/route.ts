import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🎤 Transcription API called');
  try {
    // For demo purposes, bypass authentication check
    // const session = await auth();
    //
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const requestFormData = await request.formData();
    const audioFile = requestFormData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file type - be more permissive for different browser formats
    const validTypes = [
      'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm', 'audio/ogg',
      'audio/mp4', 'audio/m4a', 'audio/x-wav', 'audio/x-m4a'
    ];

    const isValidType = validTypes.some(type => audioFile.type.includes(type.split('/')[1]));

    if (!isValidType && audioFile.type !== '') {
      console.log('🎤 Received unsupported file type:', audioFile.type);
      return NextResponse.json(
        { error: `Unsupported audio file type: ${audioFile.type}. Supported: WAV, MP3, WebM, OGG, MP4` },
        { status: 400 }
      );
    }

    // Validate file size (max 25MB)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: 'Audio file too large. Maximum size: 25MB' },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'Speech recognition service not configured' },
        { status: 500 }
      );
    }

    console.log('🎤 Processing audio file:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
      sizeInMB: (audioFile.size / (1024 * 1024)).toFixed(2)
    });

    // Prepare form data for Groq Whisper API
    const formData = new FormData();

    // Ensure proper file naming and type for Groq Whisper compatibility
    let fileName = 'recording.webm';
    let fileType = 'audio/webm';

    // Map common types to Groq-supported formats with proper extensions
    const originalType = audioFile.type.toLowerCase();

    if (originalType.includes('webm')) {
      fileName = 'recording.webm';
      fileType = 'audio/webm';
    } else if (originalType.includes('wav')) {
      fileName = 'recording.wav';
      fileType = 'audio/wav';
    } else if (originalType.includes('mp4') || originalType.includes('m4a')) {
      fileName = 'recording.m4a';
      fileType = 'audio/m4a';
    } else if (originalType.includes('ogg')) {
      fileName = 'recording.ogg';
      fileType = 'audio/ogg';
    } else if (originalType.includes('mpeg') || originalType.includes('mp3')) {
      fileName = 'recording.mp3';
      fileType = 'audio/mpeg';
    } else if (originalType === '' || originalType === 'application/octet-stream') {
      // Handle cases where browser doesn't set proper MIME type
      fileName = 'recording.webm';
      fileType = 'audio/webm';
      console.log('🎤 No MIME type detected, defaulting to webm');
    } else {
      // Default to webm for unknown types
      fileName = 'recording.webm';
      fileType = 'audio/webm';
      console.log('🎤 Unknown MIME type, defaulting to webm:', originalType);
    }

    console.log('🎤 Converting file type from', audioFile.type, 'to', fileType, 'with filename', fileName);

    // Create a new file with proper type and name for Groq
    const audioFileForGroq = new File([audioFile], fileName, { type: fileType });

    formData.append('file', audioFileForGroq);
    formData.append('model', 'whisper-large-v3');
    formData.append('response_format', 'json');
    formData.append('temperature', '0.0');

    console.log('🎤 Sending to Groq Whisper API with file:', fileName, 'type:', fileType);

    // Call Groq Whisper API
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);

      // Return a more helpful error message for debugging
      return NextResponse.json({
        transcript: `[DEBUG] Groq API failed with status ${response.status}. Error: ${errorText}`,
        confidence: 0,
        language: 'en',
        debug: true,
        error: errorText
      });
    }

    const transcriptionResult = await response.json();
    console.log('🎤 Transcription successful using Groq Whisper:', transcriptionResult);

    return NextResponse.json({
      transcript: transcriptionResult.text || '[DEBUG] No text returned from Groq',
      confidence: transcriptionResult.confidence || null,
      language: transcriptionResult.language || 'en',
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({
      transcript: `[DEBUG] Server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      confidence: 0,
      language: 'en',
      debug: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

'use client';

import { useState, useRef, useCallback } from 'react';

interface UseVoiceOptions {
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useVoice({ onTranscript, onError }: UseVoiceOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async () => {
    if (isRecording) {
      return;
    }

    setIsRecording(true);

    // Check browser compatibility
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      onError?.('Voice recording not supported in this browser');
      return;
    }

    if (!window.MediaRecorder) {
      onError?.('Audio recording not supported in this browser');
      return;
    }

    try {
      // Check for microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Reset audio chunks
      audioChunksRef.current = [];

      // Create MediaRecorder with Groq Whisper-compatible formats
      let mediaRecorder;
      const options = [
        { mimeType: 'audio/webm;codecs=opus' },
        { mimeType: 'audio/webm' },
        { mimeType: 'audio/ogg;codecs=opus' },
        { mimeType: 'audio/ogg' },
        { mimeType: 'audio/mp4' },
        { mimeType: 'audio/mpeg' },
        { mimeType: 'audio/wav' },
        {} // Fallback to default
      ];

      console.log('🎤 Testing MediaRecorder format support...');
      for (const option of options) {
        try {
          const isSupported = !option.mimeType || MediaRecorder.isTypeSupported(option.mimeType);
          console.log(`🎤 Format ${option.mimeType || 'default'}: ${isSupported ? 'supported' : 'not supported'}`);

          if (isSupported) {
            mediaRecorder = new MediaRecorder(stream, option);
            console.log('🎤 Using audio format:', option.mimeType || 'default');
            break;
          }
        } catch (e) {
          console.log(`🎤 Error testing format ${option.mimeType}:`, e);
          continue;
        }
      }

      if (!mediaRecorder) {
        throw new Error('No supported audio format found');
      }

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        console.log('🎤 Data available:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('🎤 Recording stopped, processing audio...');
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());

        // Process the recorded audio
        await processRecording();
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        onError?.('Recording failed');
        setIsRecording(false);
      };

      // Start recording
      mediaRecorder.start();
      console.log('🎤 Recording started with format:', mediaRecorder.mimeType);

    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false); // Reset recording state on error
      if (error instanceof Error && error.name === 'NotAllowedError') {
        onError?.('Microphone permission denied. Please allow microphone access and try again.');
      } else if (error instanceof Error && error.name === 'NotSecureError') {
        onError?.('Voice recording requires HTTPS. Please use https://localhost:3000 or deploy to a secure server.');
      } else {
        onError?.(`Failed to start recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }, [onTranscript, onError]);

  const processRecording = useCallback(async () => {
    if (audioChunksRef.current.length === 0) {
      onError?.('No audio recorded');
      return;
    }

    setIsProcessing(true);
    console.log('🎤 Processing recording with', audioChunksRef.current.length, 'chunks');

    try {
      // Create audio blob with detected MIME type
      const mimeType = audioChunksRef.current[0]?.type || 'audio/webm';
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

      console.log('🎤 Audio blob created:', {
        size: audioBlob.size,
        type: audioBlob.type,
        mimeType: mimeType
      });

      // Validate audio blob size
      if (audioBlob.size === 0) {
        throw new Error('No audio data recorded');
      }

      // Create form data
      const formData = new FormData();
      const extension = mimeType.includes('wav') ? '.wav' :
                       mimeType.includes('mp4') ? '.mp4' :
                       mimeType.includes('ogg') ? '.ogg' : '.webm';
      formData.append('audio', audioBlob, `recording${extension}`);

      console.log('🎤 Sending to transcription API...');

      // Send to transcription API
      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData,
      });

      console.log('🎤 Transcription API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        console.error('🎤 Transcription API error:', errorData);

        // Provide more specific error messages
        if (response.status === 400) {
          throw new Error(errorData.error || 'Invalid audio format. Please try again.');
        } else if (response.status === 401) {
          throw new Error('API authentication failed. Please check configuration.');
        } else if (response.status === 413) {
          throw new Error('Audio file too large. Please record a shorter message.');
        } else {
          throw new Error(errorData.error || `Transcription failed (${response.status})`);
        }
      }

      const result = await response.json();
      console.log('🎤 Transcription result:', result);

      if (result.transcript && result.transcript.trim()) {
        setTranscript(result.transcript);
        onTranscript?.(result.transcript);
        console.log('🎤 Transcription successful:', result.transcript);
      } else {
        onError?.('No speech detected. Please try speaking more clearly.');
      }

    } catch (error) {
      console.error('🎤 Transcription error:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to transcribe audio');
    } finally {
      setIsProcessing(false);
    }
  }, [onTranscript, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('🎤 Stopping recording...');
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const playText = useCallback(async (text: string) => {
    try {
      setIsPlaying(true);

      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        onError?.('Failed to play audio');
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing text:', error);
      setIsPlaying(false);
      onError?.('Failed to play text');
    }
  }, [onError]);

  const stopPlaying = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  return {
    isRecording,
    isPlaying,
    isProcessing,
    transcript,
    startRecording,
    stopRecording,
    playText,
    stopPlaying,
  };
}

// Extend the Window interface to include speech recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

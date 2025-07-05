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

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
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

    try {
      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

      // Create form data
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      // Send to transcription API (using test endpoint for demo)
      const response = await fetch('/api/voice/test', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      const result = await response.json();

      if (result.transcript && result.transcript.trim()) {
        setTranscript(result.transcript);
        onTranscript?.(result.transcript);
      } else {
        onError?.('No speech detected. Please try speaking more clearly.');
      }

    } catch (error) {
      console.error('Transcription error:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to transcribe audio');
    } finally {
      setIsProcessing(false);
    }
  }, [onTranscript, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
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

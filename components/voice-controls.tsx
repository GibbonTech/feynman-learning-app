'use client';

import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '@/hooks/use-voice';
import { toast } from './toast';

interface VoiceControlsProps {
  onTranscript: (transcript: string) => void;
  lastMessage?: string;
}

export function VoiceControls({ onTranscript, lastMessage }: VoiceControlsProps) {
  const {
    isRecording,
    isPlaying,
    isProcessing,
    startRecording,
    stopRecording,
    playText,
    stopPlaying,
  } = useVoice({
    onTranscript: (transcript) => {
      onTranscript(transcript);
      toast({
        type: 'success',
        description: 'Voice input captured',
      });
    },
    onError: (error) => {
      toast({
        type: 'error',
        description: `Voice error: ${error}`,
      });
    },
  });

  const handleRecordingToggle = () => {

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      stopPlaying();
    } else if (lastMessage) {
      playText(lastMessage);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 animate-in fade-in-50 duration-500">
      {/* Main Voice Button */}
      <button
        onClick={handleRecordingToggle}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isRecording ? '#ef4444' : isProcessing ? '#eab308' : '#3b82f6',
          color: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s',
          zIndex: 99999,
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isRecording ? (
          <MicOff className="w-6 h-6 animate-bounce" />
        ) : isProcessing ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      {/* Action Text */}
      <div className="text-center space-y-1">
        <p className="text-sm font-medium transition-colors duration-200">
          {isRecording ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to speak'}
        </p>
        <p className="text-xs text-muted-foreground">
          {isRecording
            ? 'Explain your concept or ask a question'
            : isProcessing
            ? 'Converting speech to text...'
            : 'Voice input ready'
          }
        </p>
      </div>

      {/* Playback Controls */}
      {lastMessage && (
        <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-300">
          <Button
            type="button"
            variant={isPlaying ? "destructive" : "outline"}
            size="sm"
            onClick={handlePlayToggle}
            disabled={isRecording}
            className="flex items-center gap-2 focus-ring button-hover"
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4 animate-pulse" />
                Stop Audio
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Play Response
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

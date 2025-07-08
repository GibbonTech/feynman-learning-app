'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Send, Loader2, Volume2, VolumeX, Upload, FileText, BookOpen, X } from 'lucide-react';
import { VoiceControls } from './voice-controls';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function SimpleDemoChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [context, setContext] = useState<string>('');
  const [contextTitle, setContextTitle] = useState<string>('');
  const [showContextPanel, setShowContextPanel] = useState(false);
  const [notionPages] = useState<any[]>([]);


  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/simple-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            parts: [
              {
                type: 'text',
                text: messageText.trim(),
              }
            ]
          },
          context: context || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      if (data.success && data.response) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
    sendMessage(transcript);
  };

  const playText = async (text: string) => {
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
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsPlaying(false);
    }
  };

  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop()?.content;

  const loadNotionPage = (pageId: string, title: string) => {
    // Placeholder function for Notion page loading
    console.log('Loading Notion page:', pageId, title);
  };



  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['.md', '.markdown'];
    const isAllowed = allowedTypes.some(type => file.name.toLowerCase().endsWith(type));

    if (!isAllowed) {
      toast.error('Please upload Markdown files (.md or .markdown) only');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setContext(content);
        setContextTitle(file.name);
        setShowContextPanel(true);
        toast.success(`Loaded "${file.name}" for context`);
      }
    };
    reader.readAsText(file);
  };



  // Clear context
  const clearContext = () => {
    setContext('');
    setContextTitle('');
    setShowContextPanel(false);
    toast.success('Context cleared');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Clean Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Feynman Learning</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Learn by explaining simply</p>
              </div>
            </div>

            {/* Context & Upload Controls */}
            <div className="flex items-center gap-2">
              {context && (
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300 max-w-32 truncate">
                    {contextTitle}
                  </span>
                  <button
                    onClick={clearContext}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <input
                type="file"
                accept=".md,.markdown"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Markdown
              </label>

              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                Export Notion → Upload here
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notion Pages Panel */}
      {notionPages.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notion Pages</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {notionPages.slice(0, 10).map((page) => (
                <button
                  key={page.id}
                  onClick={() => loadNotionPage(page.id, page.title)}
                  className="flex-shrink-0 px-3 py-1 text-xs bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
                >
                  {page.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col h-[calc(100vh-88px)]">

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Ready to learn?</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {context
                  ? `Ask me to explain concepts from "${contextTitle}"`
                  : "Upload study materials above, then ask me to explain concepts using the Feynman Technique"
                }
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-blue-600'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {message.role === 'user' ? (
                    <span className="text-white text-sm font-medium">You</span>
                  ) : (
                    <Brain className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

                  {/* Audio Button for Assistant Messages */}
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => playText(message.content)}
                      disabled={isPlaying}
                      className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      {isPlaying ? (
                        <VolumeX className="w-3 h-3" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                      {isPlaying ? 'Playing...' : 'Listen'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-600 dark:text-gray-300">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Voice Controls */}
        <div className="flex justify-center mb-4">
          <VoiceControls
            onTranscript={handleVoiceTranscript}
            lastMessage={lastAssistantMessage}
          />
        </div>

        {/* Input Area */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 shadow-sm">
          <form onSubmit={handleSubmit} className="flex items-end gap-3 p-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to explain something..."
              className="flex-1 min-h-[20px] max-h-32 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-0 px-4 py-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

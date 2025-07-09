'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, ArrowRight, Upload, BookOpen, FileAudio, Sparkles, MessageSquare, Mic, Volume2, Zap, Target, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BentoLandingPage() {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16 animate-in fade-in-50 duration-700">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <Brain className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
              Feynman Learning
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Master any concept by explaining it simply. AI-powered learning through the Feynman Technique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleStartLearning}
                size="lg"
                className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Try Demo Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No signup required • Free to use
              </p>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">

            {/* Main Feature - AI Explanations */}
            <Card className="lg:col-span-2 lg:row-span-2 group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-700/20 backdrop-blur-sm"></div>
              <CardContent className="p-8 relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">AI-Powered Explanations</h3>
                  </div>
                  <p className="text-blue-100 text-lg leading-relaxed mb-6">
                    Get complex concepts explained in simple, 12-year-old friendly language. Our AI breaks down difficult topics into digestible explanations.
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-200" />
                    <span className="text-sm text-blue-200">Example explanation:</span>
                  </div>
                  <p className="text-sm text-white/90 italic">
                    "Think of quantum physics like a magic coin that can be heads AND tails at the same time..."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Audio Features */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <FileAudio className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Audio Transcription</h3>
                  <p className="text-green-100 text-sm leading-relaxed">
                    Upload audio files and convert speech to text for seamless learning.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 text-green-200">
                  <Mic className="w-4 h-4" />
                  <span className="text-xs">Demo feature</span>
                </div>
              </CardContent>
            </Card>

            {/* Text-to-Speech */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Listen & Learn</h3>
                  <p className="text-orange-100 text-sm leading-relaxed">
                    Hear explanations read aloud with natural-sounding AI voices.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 text-orange-200">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs">Demo feature</span>
                </div>
              </CardContent>
            </Card>

            {/* File Upload Showcase */}
            <Card className="lg:col-span-2 group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
              <CardContent className="p-8 h-full flex flex-col justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Import Study Materials</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Upload markdown files from Obsidian, Notion exports, or any text editor to start learning
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-6 py-3 inline-flex items-center gap-2">
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 text-sm">Available in demo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Instant Learning</h3>
                  <p className="text-purple-100 text-sm leading-relaxed">
                    Get explanations in seconds, not hours of research.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 text-purple-200">
                  <Target className="w-4 h-4" />
                  <span className="text-xs">Feynman Technique</span>
                </div>
              </CardContent>
            </Card>

            {/* Study Method */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Proven Method</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    Based on Nobel laureate Richard Feynman's learning technique.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 text-indigo-200">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">Scientifically proven</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center animate-in fade-in-50 duration-700 delay-500">
            <Card className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 border-0 text-white">
              <CardContent className="p-12">
                <h3 className="text-3xl font-bold mb-4">
                  Ready to master any concept?
                </h3>
                <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                  Join thousands of learners using the Feynman Technique to understand complex topics through simple explanations.
                </p>
                <Button
                  onClick={handleStartLearning}
                  size="lg"
                  className="text-xl px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Learning Now
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>


    </div>
  );
}

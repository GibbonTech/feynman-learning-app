'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, ArrowRight, Upload, BookOpen, Mic2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FileUpload } from './file-upload';

export function FeynmanLandingPage() {
  const router = useRouter();
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleContentImport = (content: string, title: string) => {
    // Navigate to chat with imported content
    const chatId = Math.random().toString(36).substring(7);
    router.push(`/chat/${chatId}?content=${encodeURIComponent(content)}&title=${encodeURIComponent(title)}`);
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Explanations",
      description: "Get concepts explained in simple, 12-year-old friendly language",
    },
    {
      icon: Mic2,
      title: "Voice Interaction",
      description: "Speak your questions and listen to AI responses",
    },
    {
      icon: BookOpen,
      title: "Study Material Import",
      description: "Upload markdown files from Obsidian, Notion, or any text editor",
    }
  ];

  const handleStartLearning = () => {
    router.push('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Hero Section */}
          <div className="text-center space-y-8 animate-in fade-in-50 duration-700">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Feynman Learning Demo
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Learn any concept by explaining it simply. Upload your study materials and get AI-powered explanations using the Feynman Technique.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleStartLearning}
                size="lg"
                className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Try Demo Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No signup required • Free to use
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-8 animate-in fade-in-50 duration-700 delay-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What makes this demo special?</h2>
              <p className="text-gray-600 dark:text-gray-300">Experience the Feynman Technique with AI assistance</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Import Content Section */}
          <div className="space-y-8 animate-in fade-in-50 duration-700 delay-400">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Import Your Study Materials</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Upload markdown files from Obsidian, Notion exports, or any text editor to start learning
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                💡 <strong>Tip:</strong> Export your notes from Notion or Obsidian as .md files, then upload them here
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Markdown Files</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Upload .md files from Obsidian, Notion exports, or any markdown editor
                    </p>
                    <Button
                      variant={showFileUpload ? 'default' : 'outline'}
                      onClick={() => setShowFileUpload(prev => !prev)}
                      className="w-full mt-4"
                    >
                      {showFileUpload ? 'Hide File Upload' : 'Upload Files'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* File Upload Component */}
            {showFileUpload && (
              <div className="animate-in fade-in-50 duration-300 max-w-2xl mx-auto">
                <FileUpload onFileContent={handleContentImport} />
              </div>
            )}
          </div>

          {/* Demo CTA */}
          <div className="text-center space-y-6 animate-in fade-in-50 duration-700 delay-500">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Ready to experience the Feynman Technique?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Start with the demo or import your study materials above
              </p>
              <Button
                onClick={handleStartLearning}
                size="lg"
                className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Launch Demo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ✨ AI-powered explanations • 🎤 Voice interaction • 📝 Markdown support
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

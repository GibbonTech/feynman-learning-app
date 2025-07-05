'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Lightbulb, MessageSquare, Mic, ArrowRight, FileText, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NotionConnector } from './notion-connector';
import { FileUpload } from './file-upload';

export function FeynmanLandingPage() {
  const router = useRouter();
  const [showImports, setShowImports] = useState<'notion' | 'files' | false>(false);

  const handleContentImport = (content: string, title: string) => {
    // Navigate to chat with imported content
    const chatId = Math.random().toString(36).substring(7);
    router.push(`/chat/${chatId}?content=${encodeURIComponent(content)}&title=${encodeURIComponent(title)}`);
  };

  const examples = [
    {
      icon: Brain,
      title: "Explain a Complex Concept",
      description: "Break down difficult topics into simple terms",
    },
    {
      icon: Lightbulb,
      title: "Test Your Understanding",
      description: "Check if you really understand what you've learned",
    },
    {
      icon: MessageSquare,
      title: "Learn Through Analogies",
      description: "Use everyday examples to grasp new ideas",
    },
    {
      icon: Mic,
      title: "Practice Speaking",
      description: "Use voice to practice explaining concepts aloud",
    }
  ];

  const handleStartLearning = () => {
    router.push('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">

          {/* Hero Section */}
          <div className="space-y-6 animate-in fade-in-50 duration-700">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Brain className="w-16 h-16 text-primary animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Feynman Learning Assistant
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master any concept by explaining it in simple terms. If you can't explain it simply, you don't understand it well enough.
            </p>
          </div>

          {/* How it Works */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border shadow-lg animate-in fade-in-50 duration-700 delay-200">
            <h2 className="text-2xl font-bold mb-8">How the Feynman Technique Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">1</div>
                <h3 className="text-lg font-semibold">Choose a Concept</h3>
                <p className="text-muted-foreground">Pick something you want to learn</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">2</div>
                <h3 className="text-lg font-semibold">Explain Simply</h3>
                <p className="text-muted-foreground">Teach it like you're talking to a child</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">3</div>
                <h3 className="text-lg font-semibold">Fill the Gaps</h3>
                <p className="text-muted-foreground">Identify and study what you don't know</p>
              </div>
            </div>
          </div>

          {/* Learning Approaches */}
          <div className="space-y-8 animate-in fade-in-50 duration-700 delay-400">
            <h2 className="text-2xl font-bold">Try these learning approaches:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examples.map((example, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <example.icon className="w-8 h-8 text-primary mt-1 flex-shrink-0 transition-transform duration-200" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-200">{example.title}</h3>
                        <p className="text-muted-foreground">{example.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Voice Feature Highlight */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 border animate-in fade-in-50 duration-700 delay-600">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mic className="w-8 h-8 text-primary animate-pulse" />
              <h3 className="text-xl font-semibold">Voice-First Learning</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Use natural voice input for a more engaging learning conversation. Speak your thoughts and get instant feedback.
            </p>
          </div>

          {/* Import Content Section */}
          <div className="space-y-6 animate-in fade-in-50 duration-700 delay-700">
            <h2 className="text-2xl font-bold">Import Your Study Materials</h2>
            <p className="text-muted-foreground">
              Start learning from your existing notes, documents, or Notion pages
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <FileText className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                    <div className="space-y-3 flex-1">
                      <h3 className="text-lg font-semibold">Import from Notion</h3>
                      <p className="text-muted-foreground text-sm">Connect your Notion workspace and import pages for learning</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowImports(prev => prev === 'notion' ? false : 'notion')}
                        className="w-full"
                      >
                        {showImports === 'notion' ? 'Hide' : 'Connect Notion'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Upload className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                    <div className="space-y-3 flex-1">
                      <h3 className="text-lg font-semibold">Upload Files</h3>
                      <p className="text-muted-foreground text-sm">Upload PDFs, documents, or text files to learn from</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowImports(prev => prev === 'files' ? false : 'files')}
                        className="w-full"
                      >
                        {showImports === 'files' ? 'Hide' : 'Upload Files'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Import Components */}
            {showImports === 'notion' && (
              <div className="animate-in fade-in-50 duration-300">
                <NotionConnector onPageSelect={handleContentImport} />
              </div>
            )}

            {showImports === 'files' && (
              <div className="animate-in fade-in-50 duration-300">
                <FileUpload onFileContent={handleContentImport} />
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="pt-8 animate-in fade-in-50 duration-700 delay-700">
            <Button
              onClick={handleStartLearning}
              size="lg"
              className="text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Start Learning with AI
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No signup required • Free to use • Voice-enabled
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

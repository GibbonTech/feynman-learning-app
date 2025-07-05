'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Lightbulb, MessageSquare, Mic } from 'lucide-react';

interface FeynmanWelcomeProps {
  onExampleClick: (example: string) => void;
}

export function FeynmanWelcome({ onExampleClick }: FeynmanWelcomeProps) {
  const examples = [
    {
      icon: Brain,
      title: "Explain a Complex Concept",
      description: "Break down difficult topics into simple terms",
      prompt: "I want to understand quantum physics. Can you help me explain it as if I'm teaching it to a 12-year-old?"
    },
    {
      icon: Lightbulb,
      title: "Test Your Understanding",
      description: "Check if you really understand what you've learned",
      prompt: "I've been studying photosynthesis. Let me try to explain it simply and you can ask me questions to test my understanding."
    },
    {
      icon: MessageSquare,
      title: "Learn Through Analogies",
      description: "Use everyday examples to grasp new ideas",
      prompt: "I'm struggling with how neural networks work. Can you help me find good analogies to explain it?"
    },
    {
      icon: Mic,
      title: "Practice Speaking",
      description: "Use voice to practice explaining concepts aloud",
      prompt: "I want to practice explaining the water cycle out loud. Can you listen and ask me follow-up questions?"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 smooth-scroll">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Welcome Header */}
        <div className="space-y-4 animate-in fade-in-50 duration-700">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-12 h-12 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Feynman Learning Assistant
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Master any concept by explaining it in simple terms. If you can't explain it simply, you don't understand it well enough.
          </p>
        </div>

        {/* How it Works */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-6 border">
          <h2 className="text-lg font-semibold mb-4">How the Feynman Technique Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">1</div>
              <p className="font-medium">Choose a Concept</p>
              <p className="text-muted-foreground">Pick something you want to learn</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">2</div>
              <p className="font-medium">Explain Simply</p>
              <p className="text-muted-foreground">Teach it like you're talking to a child</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">3</div>
              <p className="font-medium">Fill the Gaps</p>
              <p className="text-muted-foreground">Identify and study what you don't know</p>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="space-y-4 animate-in fade-in-50 duration-700 delay-300">
          <h2 className="text-xl font-semibold">Try these learning approaches:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examples.map((example, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/20 group">
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-0 text-left focus-ring"
                    onClick={() => onExampleClick(example.prompt)}
                  >
                    <div className="flex items-start gap-3">
                      <example.icon className="w-5 h-5 text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                      <div className="space-y-1">
                        <h3 className="font-medium group-hover:text-primary transition-colors duration-200">{example.title}</h3>
                        <p className="text-sm text-muted-foreground">{example.description}</p>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Voice Prompt */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl p-4 border animate-in fade-in-50 duration-700 delay-500 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Mic className="w-4 h-4 animate-pulse" />
            <span>Try using voice input for a more natural learning conversation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Scale, 
  Atom, 
  Code, 
  Calculator, 
  Microscope, 
  Dna,
  BookOpen 
} from 'lucide-react';
import { detectDomain } from '@/lib/ai/prompts';

interface DomainDisplayProps {
  content: string;
  className?: string;
}

const domainIcons = {
  medicine: Brain,
  law: Scale,
  physics: Atom,
  programming: Code,
  mathematics: Calculator,
  chemistry: Microscope,
  biology: Dna,
  general: BookOpen,
};

const domainColors = {
  medicine: 'bg-red-100 text-red-800 border-red-200',
  law: 'bg-blue-100 text-blue-800 border-blue-200',
  physics: 'bg-purple-100 text-purple-800 border-purple-200',
  programming: 'bg-green-100 text-green-800 border-green-200',
  mathematics: 'bg-orange-100 text-orange-800 border-orange-200',
  chemistry: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  biology: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  general: 'bg-gray-100 text-gray-800 border-gray-200',
};

const domainDescriptions = {
  medicine: 'Medical concepts and healthcare topics',
  law: 'Legal principles and jurisprudence',
  physics: 'Physical laws and scientific phenomena',
  programming: 'Code, algorithms, and software development',
  mathematics: 'Mathematical concepts and problem-solving',
  chemistry: 'Chemical processes and molecular interactions',
  biology: 'Biological systems and life sciences',
  general: 'General knowledge and mixed topics',
};

export function DomainDisplay({ content, className = '' }: DomainDisplayProps) {
  const domain = detectDomain(content);
  const Icon = domainIcons[domain as keyof typeof domainIcons];
  const colorClass = domainColors[domain as keyof typeof domainColors];
  const description = domainDescriptions[domain as keyof typeof domainDescriptions];

  if (!content.trim()) {
    return null;
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">Detected Domain:</span>
          </div>
          <Badge 
            variant="outline" 
            className={`${colorClass} capitalize`}
          >
            {domain}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

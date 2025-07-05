'use client';

import { Brain } from 'lucide-react';
import { memo } from 'react';
import type { Session } from 'next-auth';

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
  session,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: any;
  isReadonly: boolean;
  session: Session;
}) {

  return (
    <header className="flex sticky top-0 bg-background/95 backdrop-blur-sm border-b py-3 items-center px-4 gap-4 z-50 shadow-sm">
      {/* Feynman Learning Assistant Branding */}
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center gap-2 group">
          <Brain className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-200" />
          <h1 className="text-xl font-semibold text-foreground bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Feynman Learning Assistant
          </h1>
        </div>
        <div className="text-sm text-muted-foreground hidden md:block font-medium">
          Learn by explaining concepts in simple terms
        </div>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});

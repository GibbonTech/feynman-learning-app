'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from './toast';

interface FileUploadProps {
  onFileContent: (content: string, filename: string) => void;
}

export function FileUpload({ onFileContent }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onFileContent(content, file.name);
        setUploadedFiles(prev => [...prev, file.name]);
        toast({
          type: 'success',
          description: `Loaded "${file.name}" for Feynman learning`,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.name.endsWith('.md') || file.name.endsWith('.markdown') || file.type === 'text/plain') {
        handleFileRead(file);
      } else {
        toast({
          type: 'error',
          description: `Please upload markdown files (.md, .markdown) only. Export from Obsidian or Notion as markdown.`,
        });
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearFiles = () => {
    setUploadedFiles([]);
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Markdown Files
        </CardTitle>
        <CardDescription>
          Upload .md files from Obsidian, Notion exports, or any markdown editor to start learning with the Feynman Technique.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            Drag and drop markdown files here, or click to select
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Supports .md and .markdown files from Obsidian, Notion, etc.
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Markdown Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".md,.markdown"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Uploaded Files:</span>
              <Button variant="ghost" size="sm" onClick={clearFiles}>
                <X className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-1">
              {uploadedFiles.map((filename, index) => (
                <div key={index} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  {filename}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, Calendar } from 'lucide-react';
import { toast } from './toast';

interface NotionPage {
  id: string;
  title: string;
  url: string;
  last_edited: string;
  created: string;
}

interface NotionConnectorProps {
  onPageSelect: (content: string, title: string) => void;
}

export function NotionConnector({ onPageSelect }: NotionConnectorProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  useEffect(() => {
    // Check if already connected
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/notion/simple');
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages || []);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking Notion connection:', error);
    }
  };

  const connectToNotion = () => {
    alert(`To connect Notion:
1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Give it a name, select your workspace
4. Copy the "Internal Integration Token"
5. Add it to your .env.local as NOTION_TOKEN=your-token
6. Share pages with your integration in Notion
7. Refresh this page`);
  };

  const loadPageContent = async (pageId: string, title: string) => {
    setLoading(true);
    setSelectedPage(pageId);

    try {
      const response = await fetch('/api/notion/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pageId }),
      });

      if (!response.ok) {
        throw new Error('Failed to load page content');
      }

      const data = await response.json();
      onPageSelect(data.page.content, title);

      toast({
        type: 'success',
        description: `Loaded "${title}" from Notion`,
      });
    } catch (error) {
      console.error('Error loading page content:', error);
      toast({
        type: 'error',
        description: 'Failed to load page content',
      });
    } finally {
      setLoading(false);
      setSelectedPage(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Connect to Notion
          </CardTitle>
          <CardDescription>
            Connect your Notion workspace to import study notes and materials for learning with the Feynman Technique.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={connectToNotion} className="w-full">
            Connect Notion Workspace
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Your Notion Pages
          <Badge variant="secondary">Connected</Badge>
        </CardTitle>
        <CardDescription>
          Select a page to import for Feynman learning. The content will be analyzed to help you explain concepts simply.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pages.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No pages found in your Notion workspace.
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{page.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(page.last_edited)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(page.url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => loadPageContent(page.id, page.title)}
                    disabled={loading && selectedPage === page.id}
                  >
                    {loading && selectedPage === page.id ? 'Loading...' : 'Import'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

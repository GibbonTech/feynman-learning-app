'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function NotionSetupGuide() {
  const [step, setStep] = useState(1);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const redirectUri = `${window.location.origin}/api/notion/auth`;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🔗 Notion OAuth Setup</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          To enable Notion integration, you need to create a public OAuth integration. This allows users to securely connect their Notion workspaces.
        </div>

        {/* Step 1 */}
        <div className={`border rounded-lg p-4 ${step >= 1 ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/20' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <h3 className="font-medium">Create Notion Integration</h3>
          </div>
          <div className="ml-8 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Go to Notion integrations and create a new public integration.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.notion.so/my-integrations', '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Notion Integrations
            </Button>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`border rounded-lg p-4 ${step >= 2 ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/20' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <h3 className="font-medium">Configure Integration</h3>
          </div>
          <div className="ml-8 space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                1. Click "New integration"
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                2. Choose "Public integration"
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                3. Fill in the details:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 ml-4 space-y-1">
                <li>• Name: "Feynman Learning Assistant"</li>
                <li>• Description: "AI learning assistant using the Feynman Technique"</li>
                <li>• Website: Your app URL</li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                4. Add this redirect URI:
              </p>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono">
                <span className="flex-1">{redirectUri}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(redirectUri)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className={`border rounded-lg p-4 ${step >= 3 ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/20' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
            <h3 className="font-medium">Copy Credentials</h3>
          </div>
          <div className="ml-8 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              After creating the integration, copy the Client ID and Client Secret to your <code>.env.local</code> file:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono">
              <div>NOTION_CLIENT_ID=your-client-id-here</div>
              <div>NOTION_CLIENT_SECRET=your-client-secret-here</div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className={`border rounded-lg p-4 ${step >= 4 ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 4 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              4
            </div>
            <h3 className="font-medium">Restart & Test</h3>
          </div>
          <div className="ml-8 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Restart your development server and test the "Connect Notion" button.
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setStep(Math.min(4, step + 1))}
            disabled={step === 4}
          >
            {step === 4 ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Complete
              </span>
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

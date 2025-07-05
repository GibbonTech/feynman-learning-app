import { NotionSetupGuide } from '@/components/notion-setup-guide';

export default function DemoSetupPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Feynman Learning Demo Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Set up Notion integration to allow users to connect their workspaces and import study materials.
          </p>
        </div>
        
        <NotionSetupGuide />
        
        <div className="text-center mt-8">
          <a 
            href="/demo" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Demo
          </a>
        </div>
      </div>
    </div>
  );
}

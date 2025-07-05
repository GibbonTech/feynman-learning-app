# Feynman Learning App - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd feynman-learning-app
npm install
# or
pnpm install
```

### 2. Configure Environment Variables
Copy the environment template and add your API keys:
```bash
cp .env.example .env.local
```

Edit `.env.local` and replace the placeholder values with your actual API keys.

### 3. Start Development Server
```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000` to see your app!

---

## 🔑 Required API Keys

### 1. Groq API Key (REQUIRED)
- **Purpose**: AI chat functionality using Mistral models
- **Get it**: https://console.groq.com/
- **Free tier**: Yes, generous limits
- **Add to**: `GROQ_API_KEY=your-key-here`

### 2. ElevenLabs API Key (REQUIRED for voice)
- **Purpose**: Text-to-speech for voice output
- **Get it**: https://elevenlabs.io/
- **Free tier**: 10,000 characters/month
- **Add to**: `ELEVENLABS_API_KEY=your-key-here`

---

## 🔧 Optional Integrations

### Notion Integration
For importing study materials from Notion:

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name it "Feynman Learning App"
4. Select your workspace
5. Copy the credentials:
   ```
   NOTION_CLIENT_ID=your-client-id
   NOTION_CLIENT_SECRET=your-client-secret
   ```

### File Storage (Vercel Blob)
For uploading PDFs and documents:

1. Go to https://vercel.com/dashboard
2. Create a new Blob store
3. Copy the token:
   ```
   BLOB_READ_WRITE_TOKEN=your-token-here
   ```

### Database (PostgreSQL)
For chat history and user data:

1. Create a PostgreSQL database (Vercel, Supabase, etc.)
2. Add the connection string:
   ```
   POSTGRES_URL=your-postgres-url
   ```

---

## ✨ Features Implemented

### ✅ Voice Input (Server-Side)
- **New**: Server-side speech recognition using Groq Whisper
- **Improved**: Better error handling and user feedback
- **Works**: In all modern browsers with microphone access

### ✅ AI Provider (Groq + Mistral)
- **Changed**: Switched from xAI to Groq
- **Models**: Using Mistral-8x7B for optimal performance
- **Fast**: Groq provides very fast inference

### ✅ Feynman Technique Prompts
- **Enhanced**: Specialized system prompts for learning
- **Focus**: "Explain to a 12-year-old" methodology
- **Interactive**: Guides users to simplify complex concepts

### ✅ File Upload Support
- **Fixed**: Now supports text files, PDFs, documents
- **Types**: TXT, MD, PDF, DOC, DOCX, JPEG, PNG
- **Size**: Up to 10MB per file

### ✅ Notion Integration
- **Enhanced**: Better error handling and user feedback
- **OAuth**: Secure workspace connection
- **Import**: Extract content from Notion pages

---

## 🎯 How to Use

### Voice Learning
1. Click the "Tap to speak" button
2. Explain a concept you're learning
3. The AI will help you simplify and clarify
4. Listen to responses with text-to-speech

### Import Content
1. **From Notion**: Connect your workspace and select pages
2. **From Files**: Upload PDFs, documents, or text files
3. **Learn**: The AI helps you break down complex concepts

### Feynman Technique
1. Choose a concept to learn
2. Explain it in simple terms (as if to a 12-year-old)
3. Identify gaps in your understanding
4. Simplify and use analogies
5. Teach it back to confirm understanding

---

## 🐛 Troubleshooting

### Voice Not Working
- Ensure microphone permissions are granted
- Check that you're using HTTPS (required for microphone access)
- Verify your Groq API key is valid

### Notion Connection Failed
- Check your Notion OAuth credentials
- Ensure the integration has access to your workspace
- Verify the redirect URI matches exactly

### AI Responses Not Working
- Verify your Groq API key is correct
- Check the console for error messages
- Ensure you have sufficient API credits

---

## 📝 Environment Variables Reference

```bash
# Required
GROQ_API_KEY=your-groq-key
ELEVENLABS_API_KEY=your-elevenlabs-key
AUTH_SECRET=your-auth-secret

# Optional
NOTION_CLIENT_ID=your-notion-id
NOTION_CLIENT_SECRET=your-notion-secret
BLOB_READ_WRITE_TOKEN=your-blob-token
POSTGRES_URL=your-db-url
REDIS_URL=your-redis-url
```

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
- Ensure Node.js 18+ support
- Set all environment variables
- Configure HTTPS for voice features

---

Need help? Check the console logs for detailed error messages!

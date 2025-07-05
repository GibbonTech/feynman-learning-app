# Feynman Learning Demo - Enhanced Features

## 🚀 New Features Added

### 1. **Context-Aware Learning**
- Upload `.txt` or `.md` files to provide study material context
- AI uses your uploaded content to guide explanations and questions
- Context appears in the header with easy removal option

### 2. **Notion Integration**
- Connect your Notion workspace to import study notes
- Browse and select from your recent Notion pages
- Seamlessly load page content as learning context

### 3. **Optimized for ElevenLabs TTS**
- **Concise Responses**: AI responses limited to ~100 words to save TTS credits
- **Focused Explanations**: One concept per response for clarity
- **Smart Prompting**: Enhanced Feynman technique prompts for efficiency

### 4. **Enhanced UI/UX**
- Clean, modern chat interface inspired by ChatGPT
- Context indicators in header
- File upload and Notion buttons
- Responsive design for all devices

## 🔧 Setup Instructions

### Basic Setup
1. Copy `.env.example` to `.env.local`
2. Add your API keys:
   ```
   GROQ_API_KEY=your-groq-api-key
   ELEVENLABS_API_KEY=your-elevenlabs-api-key
   ```

### Notion Integration (Optional)
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name and select your workspace
4. Copy the "Internal Integration Token"
5. Add to `.env.local`:
   ```
   NOTION_TOKEN=your-notion-integration-token
   ```
6. Share your Notion pages with the integration:
   - Open any Notion page
   - Click "Share" → "Invite"
   - Search for your integration name and add it

## 📝 How to Use

### File Upload
1. Click the "File" button in the header
2. Select a `.txt` or `.md` file with study material
3. The AI will use this context for explanations

### Notion Integration
1. Click the "Notion" button to load your pages
2. Select a page from the dropdown that appears
3. The page content becomes your learning context

### Learning with Context
- Ask: "Explain this concept like I'm 12"
- Ask: "What's the main idea here?"
- Ask: "How does this work in simple terms?"

## 🎯 Feynman Technique Features

### Optimized Prompting
- **Concise**: Responses under 100 words
- **Simple**: 12-year-old level explanations
- **Focused**: One concept at a time
- **Interactive**: Guided questions and analogies

### TTS Optimization
- Shorter responses = fewer ElevenLabs credits used
- Clear, spoken explanations
- Play button on each AI response

## 🔍 Example Workflow

1. **Upload Study Material**: Upload your lecture notes or textbook chapter
2. **Ask for Explanation**: "Explain photosynthesis from my notes like I'm 12"
3. **Get Focused Response**: AI gives concise, simple explanation
4. **Listen**: Click play to hear the explanation
5. **Follow Up**: Ask clarifying questions about specific parts

## 🛠 Technical Details

### API Endpoints
- `/api/simple-chat` - Enhanced chat with context support
- `/api/notion/simple` - Notion page fetching and content extraction
- `/api/voice/tts` - Text-to-speech using ElevenLabs

### Context Processing
- Files are read client-side and sent as context
- Notion pages are fetched server-side and processed
- Context is included in AI prompts for relevant responses

### Performance
- Reduced token limits for faster, cheaper responses
- Client-side file processing for immediate feedback
- Efficient Notion API usage with caching

## 🎨 UI Improvements

### Clean Design
- Removed cluttered cards and excessive borders
- Modern chat bubbles with avatars
- Sticky header with context indicators
- Responsive layout for mobile and desktop

### User Experience
- Instant file upload feedback
- Loading states for all operations
- Toast notifications for actions
- Clear context management

---

**Ready to learn more effectively with the Feynman Technique!** 🧠✨

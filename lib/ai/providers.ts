import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { createGroq } from '@ai-sdk/groq';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// Initialize Groq with API key
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': groq('llama3-8b-8192'),
        'chat-model-reasoning': wrapLanguageModel({
          model: groq('llama3-8b-8192'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': groq('llama3-8b-8192'),
        'artifact-model': groq('llama3-8b-8192'),
      },
    });

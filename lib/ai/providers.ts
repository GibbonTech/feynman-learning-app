import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import {createOpenAICompatible} from "@ai-sdk/openai-compatible"
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// Initialize Blackbox AI with API key
const blackbox = createOpenAICompatible({
  name: "Blackbox",
  baseURL: "https://api.blackbox.ai",
  apiKey: process.env.BLACKBOX_API_KEY
})

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
        'chat-model': blackbox('blackboxai/qwen/qwen3-8b:free'),
        'chat-model-reasoning': wrapLanguageModel({
          model: blackbox('blackboxai/qwen/qwen3-8b:free'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': blackbox('blackboxai/qwen/qwen3-8b:free'),
        'artifact-model': blackbox('blackboxai/qwen/qwen3-8b:free'),
      },
    });

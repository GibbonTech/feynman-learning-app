import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
} from 'ai';
import { auth, type UserType } from '@/app/(auth)/auth';
import { type RequestHints, systemPrompt } from '@/lib/ai/prompts';
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import { convertToUIMessages, generateUUID } from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';
import { entitlementsByUserType } from '@/lib/ai/entitlements';
import { postRequestBodySchema, type PostRequestBody } from './schema';
import { geolocation } from '@vercel/functions';
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from 'resumable-stream';
import { after } from 'next/server';
import { ChatSDKError } from '@/lib/errors';
import type { ChatMessage } from '@/lib/types';
import type { ChatModel } from '@/lib/ai/models';
import type { VisibilityType } from '@/components/visibility-selector';

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      });
    } catch (error: any) {
      if (error.message.includes('REDIS_URL')) {
        console.log(
          ' > Resumable streams are disabled due to missing REDIS_URL',
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  try {
    const {
      id,
      message,
      selectedChatModel,
      selectedVisibilityType,
    }: {
      id: string;
      message: ChatMessage;
      selectedChatModel: ChatModel['id'];
      selectedVisibilityType: VisibilityType;
    } = requestBody;

    // For demo purposes, bypass authentication
    // const session = await auth();
    // if (!session?.user) {
    //   return new ChatSDKError('unauthorized:chat').toResponse();
    // }

    // Create a mock session for demo
    const session = {
      user: {
        id: 'demo-user',
        type: 'guest' as UserType,
        email: 'demo@example.com',
        name: 'Demo User'
      }
    };

    const userType: UserType = session.user.type;

    // Skip rate limiting for demo
    // const messageCount = await getMessageCountByUserId({
    //   id: session.user.id,
    //   differenceInHours: 24,
    // });
    // if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
    //   return new ChatSDKError('rate_limit:chat').toResponse();
    // }

    // Skip database operations for demo
    // const chat = await getChatById({ id });
    // if (!chat) {
    //   const title = await generateTitleFromUserMessage({
    //     message,
    //   });
    //   await saveChat({
    //     id,
    //     userId: session.user.id,
    //     title,
    //     visibility: selectedVisibilityType,
    //   });
    // } else {
    //   if (chat.userId !== session.user.id) {
    //     return new ChatSDKError('forbidden:chat').toResponse();
    //   }
    // }

    // Skip database message retrieval for demo
    // const messagesFromDb = await getMessagesByChatId({ id });
    const uiMessages = [message];

    // Extract user content for domain detection
    const userContent = uiMessages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.parts.map(part => part.type === 'text' ? part.text : '').join(' '))
      .join(' ');

    // For demo, use default geolocation values
    const geo = geolocation(request);
    const requestHints: RequestHints = {
      longitude: geo?.longitude || '0',
      latitude: geo?.latitude || '0',
      city: geo?.city || 'Unknown',
      country: geo?.country || 'Unknown',
    };

    // Skip saving user message for demo
    // await saveMessages({
    //   messages: [
    //     {
    //       chatId: id,
    //       id: message.id,
    //       role: 'user',
    //       parts: message.parts,
    //       attachments: [],
    //       createdAt: new Date(),
    //     },
    //   ],
    // });

    const streamId = generateUUID();
    // Skip creating stream ID for demo
    // await createStreamId({ streamId, chatId: id });

    console.log(JSON.stringify(uiMessages, null, 2));

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel, requestHints, userContent }),
          messages: convertToModelMessages(uiMessages),
          stopWhen: stepCountIs(5),
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning'
              ? []
              : [
                  'getWeather',
                  'createDocument',
                  'updateDocument',
                  'requestSuggestions',
                ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          tools: {
            getWeather,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
            }),
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
        });

        result.consumeStream();

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          }),
        );
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        // Skip saving messages for demo
        // await saveMessages({
        //   messages: messages.map((message) => ({
        //     id: message.id,
        //     role: message.role,
        //     parts: message.parts,
        //     createdAt: new Date(),
        //     attachments: [],
        //     chatId: id,
        //   })),
        // });
      },
      onError: (error) => {
        console.log(error);
        return 'Oops, an error occurred!';
      },
    });

    // For demo, use simple streaming without Redis
    return new Response(stream.pipeThrough(new JsonToSseTransformStream()), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  const chat = await getChatById({ id });

  if (chat.userId !== session.user.id) {
    return new ChatSDKError('forbidden:chat').toResponse();
  }

  const deletedChat = await deleteChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}

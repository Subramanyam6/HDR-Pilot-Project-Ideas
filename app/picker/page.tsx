'use client';

import * as React from 'react';
import { ChatPanel } from '@/components/picker/ChatPanel';
import { RecommendationList } from '@/components/picker/RecommendationList';
import { useChat } from '@/components/chat/ChatProvider';

export default function PickerPage() {
  const { messages, recommendations, isProcessing, sendMessage } = useChat();

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      await sendMessage(content, 'pilot-picker');
    },
    [sendMessage]
  );

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Chat panel */}
      <div className="flex-1 border-r flex flex-col h-[50vh] lg:h-full">
        <div className="border-b border-border/50 p-6 bg-muted/10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
              Ask Me Anything
            </h1>
            <p className="text-muted-foreground">
              I&apos;m your AI assistant for pilot recommendations.
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* Recommendations panel */}
      <div className="lg:w-96 xl:w-[28rem] bg-card border-l flex-shrink-0 overflow-y-auto h-[50vh] lg:h-full">
        <RecommendationList recommendations={recommendations} />
      </div>
    </div>
  );
}

// TODO: Real LLM/RAG integration steps:
// 1. Set up OpenAI/Anthropic API key in environment variables
// 2. Create API route (/api/picker/chat) to handle chat requests server-side
// 3. Implement RAG pipeline:
//    - Generate embeddings for user query
//    - Search vector DB for relevant pilots
//    - Include pilot context in LLM prompt
//    - Stream response back to client
// 4. Add error handling, rate limiting, token usage tracking
// 5. Consider caching common queries for cost optimization

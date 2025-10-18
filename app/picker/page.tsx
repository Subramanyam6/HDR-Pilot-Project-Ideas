'use client';

import * as React from 'react';
import { ChatPanel, type Message } from '@/components/picker/ChatPanel';
import { RecommendationList } from '@/components/picker/RecommendationList';
import { scorePilots, type ScoredPilot } from '@/lib/pilots';

export default function PickerPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [recommendations, setRecommendations] = React.useState<ScoredPilot[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSendMessage = async (content: string) => {
    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsProcessing(true);

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock assistant response
      // TODO: Replace with real LLM API call
      const scored = scorePilots(content);
      const topN = scored.slice(0, 3);

      let assistantContent = `Based on your request, here are my top recommendations:\n\n`;
      topN.forEach((sp, idx) => {
        assistantContent += `${idx + 1}. **${sp.pilot.title}**\n`;
        assistantContent += `   Match: ${Math.round(sp.score * 100)}%\n`;
        if (sp.reasons.length > 0) {
          assistantContent += `   Why: ${sp.reasons[0]}\n`;
        }
        assistantContent += `\n`;
      });

      assistantContent += `See the recommended pilots in the right panel for full details.`;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setRecommendations(topN);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Chat panel */}
      <div className="flex-1 border-r flex flex-col h-[50vh] lg:h-full">
        <div className="border-b p-6 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
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

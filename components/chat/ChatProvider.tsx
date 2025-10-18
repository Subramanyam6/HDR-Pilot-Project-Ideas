'use client';

import * as React from 'react';
import { scorePilots, type ScoredPilot } from '@/lib/pilots';
import { logChatMessage } from '@/lib/chat-logger';
import type { ChatMessage } from '@/lib/chat-types';

interface ChatContextValue {
  messages: ChatMessage[];
  recommendations: ScoredPilot[];
  isProcessing: boolean;
  sendMessage: (content: string, source: string) => Promise<void>;
}

const ChatContext = React.createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [recommendations, setRecommendations] = React.useState<ScoredPilot[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const sendMessage = React.useCallback(async (content: string, source: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      await logChatMessage(trimmed, source);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const scored = scorePilots(trimmed);
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

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setRecommendations(topN);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: ChatMessage = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      messages,
      recommendations,
      isProcessing,
      sendMessage,
    }),
    [messages, recommendations, isProcessing, sendMessage]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isProcessing?: boolean;
}

export function ChatPanel({ messages, onSendMessage, isProcessing = false }: ChatPanelProps) {
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground p-8">
            <div className="max-w-md">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Hi! I&apos;m your AI Assistant</h3>
                <p className="text-sm leading-relaxed">
                  Ask me anything about pilot projects! I can help you find the perfect pilot based on your needs, constraints, or goals.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-3">Try asking:</p>
                <div className="text-xs space-y-1">
                  <p className="bg-accent/20 px-3 py-2 rounded-lg">&quot;What&apos;s a low-risk pilot I can build solo?&quot;</p>
                  <p className="bg-accent/20 px-3 py-2 rounded-lg">&quot;Show me energy sector pilots&quot;</p>
                  <p className="bg-accent/20 px-3 py-2 rounded-lg">&quot;I need something for carbon tracking&quot;</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card
                  className={`max-w-[80%] p-4 shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground'
                      : 'bg-card border-primary/20'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </Card>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <Card className="max-w-[80%] p-4 bg-card">
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse">Thinking...</div>
                  </div>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about pilot projects... (e.g., 'What's a low-risk pilot for carbon tracking?')"
            className="flex-1 min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isProcessing}
            aria-label="Chat input"
          />
          <Button type="submit" disabled={!input.trim() || isProcessing}>
            Send
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}

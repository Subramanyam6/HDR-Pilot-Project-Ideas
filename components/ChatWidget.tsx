'use client';

import * as React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { scorePilots, type ScoredPilot } from '@/lib/pilots';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="pointer-events-none bg-transparent" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed bottom-[5.5rem] right-4 z-50 flex h-[70vh] max-h-[85vh] w-[min(90vw,24rem)] sm:w-[min(90vw,28rem)] md:w-[min(90vw,36rem)] lg:w-[min(90vw,64rem)] xl:w-[min(80vw,72rem)] flex-col overflow-hidden rounded-2xl border border-primary/10 bg-background p-0 shadow-2xl',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
ChatDialogContent.displayName = 'ChatDialogContent';

export function ChatWidget() {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [recommendations, setRecommendations] = React.useState<ScoredPilot[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      handleSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <>
      {!mounted ? (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Open chat"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      ) : (
        <Dialog open={open} onOpenChange={setOpen} modal={false}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              data-chat-trigger
              className="fixed bottom-4 right-4 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Open chat"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </DialogTrigger>
      <ChatDialogContent
        onPointerDownOutside={(event) => {
          const target = event.target as HTMLElement | null;
          if (target?.closest('[data-chat-trigger]')) {
            event.preventDefault();
            return;
          }
          setOpen(false);
        }}
        onEscapeKeyDown={() => setOpen(false)}
      >
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Pilot Assistant
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Chat panel - Left side */}
          <div className="flex-1 border-r flex flex-col">
            <div className="border-b p-6 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="text-center">
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  Ask Me Anything
                </h2>
                <p className="text-muted-foreground text-sm">
                  I&apos;m your AI assistant for pilot recommendations. Ask me anything about pilot projects!
                </p>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center text-muted-foreground p-8">
                      <div className="max-w-md">
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
            </div>
          </div>

          {/* Recommendations panel - Right side */}
          <div className="lg:w-96 xl:w-[28rem] bg-card border-l flex-shrink-0 overflow-y-auto flex flex-col">
            {recommendations.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-center text-muted-foreground p-8">
                <div className="space-y-2 max-w-sm mx-auto">
                  <p className="text-lg font-semibold">💡 No recommendations yet</p>
                  <p className="text-sm text-pretty">
                    Send a message describing your needs, and I&apos;ll find the best pilots for you.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4 flex-1">
                <div className="sticky top-0 bg-background pb-2 border-b">
                  <h2 className="text-lg font-semibold">Recommended Pilots</h2>
                  <p className="text-sm text-muted-foreground">Based on your requirements</p>
                </div>

                <div className="space-y-4">
                  {recommendations.map((scored, index) => (
                    <Card key={scored.pilot.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/10 bg-gradient-to-br from-card to-background">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-sm shadow-md">
                              #{index + 1}
                            </div>
                            <h3 className="text-base font-semibold">{scored.pilot.title}</h3>
                          </div>
                          <Badge variant="default" className="shrink-0">
                            {Math.round(scored.score * 100)}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{scored.pilot.oneLiner}</p>

                        <div className="space-y-3">
                          {/* Why this pilot */}
                          {scored.reasons.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Why this pilot:</p>
                              <ul className="text-xs space-y-0.5">
                                {scored.reasons.map((reason, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-primary mr-1">•</span>
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Quick stats */}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                            <div>
                              <span className="font-semibold text-muted-foreground">Sector:</span>{' '}
                              <Badge variant="secondary" className="text-xs ml-1">
                                {scored.pilot.sector}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-semibold text-muted-foreground">Risk:</span>{' '}
                              <span
                                className={
                                  scored.pilot.wheelRisk <= 4
                                    ? 'text-green-600 dark:text-green-400'
                                    : scored.pilot.wheelRisk <= 7
                                    ? 'text-yellow-600 dark:text-yellow-400'
                                    : 'text-red-600 dark:text-red-400'
                                }
                              >
                                {scored.pilot.wheelRisk}/10
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-muted-foreground">Feasibility:</span>{' '}
                              <span>
                                {scored.pilot.feasibility === 'solo-90-day' ? 'Solo 90-day' : 'Configure'}
                              </span>
                            </div>
                          </div>

                          {/* CTA */}
                          <Link href={`/pilots/${scored.pilot.id}`}>
                            <Button variant="outline" size="sm" className="w-full mt-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                              View Full Details →
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>
        </ChatDialogContent>
        </Dialog>
      )}
    </>
  );
}

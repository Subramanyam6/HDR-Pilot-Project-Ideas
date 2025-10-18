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
import Link from 'next/link';
import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useChat } from '@/components/chat/ChatProvider';
import type { ChatMessage } from '@/lib/chat-types';

const ChatDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="pointer-events-none bg-transparent" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed bottom-[5.5rem] right-2 sm:right-4 z-50 flex h-[75vh] sm:h-[70vh] max-h-[85vh] w-[calc(100vw-1rem)] sm:w-[min(90vw,28rem)] md:w-[min(85vw,36rem)] lg:w-[min(85vw,64rem)] xl:w-[min(80vw,72rem)] flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-primary/10 bg-background p-0 shadow-2xl',
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
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const { messages, recommendations, isProcessing, sendMessage } = useChat();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      await sendMessage(content, 'chat-widget');
    },
    [sendMessage]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      const trimmed = input.trim();
      setInput('');
      await handleSendMessage(trimmed);
    }
  };

  return (
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

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* Chat panel - Full width on small, left side on large */}
          <div className="flex-1 lg:border-r flex flex-col min-h-0">
            <div className="border-b p-3 sm:p-4 md:p-6 bg-gradient-to-r from-primary/5 to-accent/5 flex-shrink-0">
              <div className="text-center">
                <h2 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1 sm:mb-2">
                  Ask Me Anything
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">
                  I&apos;m your AI assistant for pilot recommendations. Ask me anything about pilot projects!
                </p>
              </div>
            </div>
            
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3 md:space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4 sm:p-6 md:p-8">
                    <div className="max-w-md w-full">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground mb-2 sm:mb-3">Try asking:</p>
                        <div className="text-xs space-y-1">
                          <p className="bg-accent/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">&quot;What&apos;s a low-risk pilot I can build solo?&quot;</p>
                          <p className="bg-accent/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">&quot;Show me energy sector pilots&quot;</p>
                          <p className="bg-accent/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">&quot;I need something for carbon tracking&quot;</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                      {messages.map((message: ChatMessage) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <Card
                          className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 md:p-4 shadow-md ${
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground'
                              : 'bg-card border-primary/20'
                          }`}
                        >
                          <div className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.content}</div>
                          <div className="text-[10px] sm:text-xs mt-1 sm:mt-2 opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </Card>
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex justify-start">
                        <Card className="max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 md:p-4 bg-card">
                          <div className="flex items-center gap-2">
                            <div className="animate-pulse text-xs sm:text-sm">Thinking...</div>
                          </div>
                        </Card>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <form onSubmit={handleSubmit} className="border-t p-2 sm:p-3 md:p-4 bg-background flex-shrink-0">
                <div className="flex gap-1.5 sm:gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 min-h-[50px] sm:min-h-[60px] resize-none text-xs sm:text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    disabled={isProcessing}
                    aria-label="Chat input"
                  />
                  <Button type="submit" disabled={!input.trim() || isProcessing} size="sm" className="sm:size-default">
                    Send
                  </Button>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 hidden sm:block">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </form>
            </div>
          </div>

          {/* Recommendations panel - Hidden on small screens, right side on large */}
          <div className="hidden lg:flex lg:w-96 xl:w-[28rem] bg-card border-l flex-shrink-0 overflow-y-auto flex-col min-h-0">
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
                          <Link href={`/pilots/${scored.pilot.id}`} onClick={() => setOpen(false)}>
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
  );
}

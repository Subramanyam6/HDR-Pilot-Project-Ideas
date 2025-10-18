'use client';

import * as React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export function FeedbackButton() {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [feedback, setFeedback] = React.useState('');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('HDR Pilot Navigator Feedback');
    const body = encodeURIComponent(`Name: ${name}\n\nFeedback:\n${feedback}`);
    window.location.href = `mailto:feedback@example.com?subject=${subject}&body=${body}`;
    setOpen(false);
    setName('');
    setFeedback('');
  };

  return (
    <>
      {!mounted ? (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Send feedback"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Send feedback"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            We&apos;d love to hear your thoughts about the HDR Pilot Navigator. Your feedback helps us improve!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback-name" className="text-sm font-medium mb-2 block">
              Name (optional)
            </label>
            <Input
              id="feedback-name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Your name"
            />
          </div>
          <div>
            <label htmlFor="feedback-message" className="text-sm font-medium mb-2 block">
              Feedback *
            </label>
            <Textarea
              id="feedback-message"
              placeholder="Tell us what you think..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              rows={4}
              aria-label="Your feedback"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!feedback.trim()}>
              Send
            </Button>
          </div>
        </form>
      </DialogContent>
        </Dialog>
      )}
    </>
  );
}

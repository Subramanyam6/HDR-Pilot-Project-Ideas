'use client';

import { ExternalLink } from 'lucide-react';

interface Competitor {
  name: string;
  url: string;
}

interface CompetitorsProps {
  competitors: Competitor[];
  className?: string;
}

export function Competitors({ competitors, className = '' }: CompetitorsProps) {
  if (!competitors || competitors.length === 0) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <span className="text-xs font-semibold text-muted-foreground">Competitors:</span>
        <span className="text-xs text-primary font-bold animate-pulse">Be the first!</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold text-muted-foreground">Competitors:</span>
      <ul className="text-xs list-disc pl-4 space-y-1 text-primary">
        {competitors.map((competitor, index) => (
          <li key={index}>
            <a
              href={competitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary/80 underline inline-flex items-center gap-1"
            >
              {competitor.name}
              <ExternalLink className="h-3 w-3" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

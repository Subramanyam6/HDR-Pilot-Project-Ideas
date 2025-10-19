import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SourcesProps {
  sources: string[];
  className?: string;
}

export function Sources({ sources, className = '' }: SourcesProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-xs font-semibold text-muted-foreground">Sources (WIP):</span>
      {(!sources || sources.length === 0) ? (
        <span className="text-xs text-muted-foreground">-</span>
      ) : (
        <div className="flex items-center gap-1 flex-wrap">
          {sources.map((source, index) => (
            <a
              key={index}
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-1 py-0 h-auto text-primary hover:text-primary/80 underline inline-flex items-center gap-1"
            >
              {index + 1}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

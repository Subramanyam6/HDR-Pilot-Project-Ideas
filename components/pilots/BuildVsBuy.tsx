import { Check, ExternalLink } from 'lucide-react';

interface BuildVsBuyProps {
  recommendation: 'Build' | 'Buy';
  buyUrl?: string;
  className?: string;
}

export function BuildVsBuy({ recommendation, buyUrl = '', className = '' }: BuildVsBuyProps) {
  const isBuild = recommendation === 'Build';
  const hasBuyUrl = buyUrl && buyUrl.trim() !== '';
  const buyActive = !isBuild && hasBuyUrl;

  const basePill =
    'inline-flex items-center gap-1 rounded-md border text-xs font-medium px-2 py-1 h-auto transition-none';
  const activePill =
    'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/40';
  const inactivePill = 'bg-muted/30 text-muted-foreground border-border/50 pointer-events-none';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs font-semibold text-muted-foreground">Build vs Buy:</span>
      <div className="flex items-center gap-1">
        <span
          className={`${basePill} ${isBuild ? `${activePill} pointer-events-none` : inactivePill}`}
          aria-pressed={isBuild}
        >
          Build
          {isBuild && <Check className="h-3 w-3" />}
        </span>
        {buyActive ? (
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${basePill} ${activePill}`}
          >
            Buy
            <Check className="h-3 w-3" />
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className={`${basePill} ${inactivePill}`}>
            Buy
          </span>
        )}
      </div>
    </div>
  );
}

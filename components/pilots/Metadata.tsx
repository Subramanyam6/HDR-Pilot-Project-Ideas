'use client';

import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import type { Pilot } from '@/lib/pilots';
import { getSectorIcon } from '@/lib/sector-icons';
import type { SectorType } from '@/lib/sector-icons';
import { BuildVsBuy } from './BuildVsBuy';
import { Sources } from './Sources';
import { Competitors } from './Competitors';

interface MetadataProps {
  pilot: Pilot;
}

export function Metadata({ pilot }: MetadataProps) {
  const parsedPick = typeof pilot.overallPick === 'number' ? pilot.overallPick : parseFloat(String(pilot.overallPick));
  const overallPick = Number.isFinite(parsedPick) ? parsedPick : 5;
  
  const SectorIcon = getSectorIcon(pilot.sector as SectorType);

  return (
    <div className="space-y-6">
      {/* Sector */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Sector</h3>
        <Badge variant="outline" className="font-semibold text-sm px-3 py-1.5 border-2 flex items-center gap-2 w-fit">
          <SectorIcon className="h-4 w-4" />
          {pilot.sector}
        </Badge>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Tags</h3>
        <div className="flex flex-wrap gap-1.5">
          {pilot.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

    {/* Competitors */}
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">Competitors</h3>
      <Competitors competitors={pilot.competitors} />
    </div>

      {/* Overall Pick */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Overall Pick</h3>
        <div className="flex items-center gap-3">
          <span
            className={`text-2xl font-bold ${
              overallPick >= 7
                ? 'text-green-600 dark:text-green-400'
                : overallPick >= 4
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {overallPick}/10
          </span>
          <div className="flex-1">
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  overallPick >= 7
                    ? 'bg-green-600 dark:bg-green-400'
                    : overallPick >= 4
                    ? 'bg-yellow-600 dark:bg-yellow-400'
                    : 'bg-red-600 dark:bg-red-400'
                }`}
                style={{ width: `${(overallPick / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overallPick >= 7 ? 'Highly recommended' : overallPick >= 4 ? 'Recommended' : 'Consider carefully'}
            </p>
          </div>
        </div>
      </div>

      {/* Pain Points */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Pain Points</h3>
        <div className="text-sm space-y-1">
          {pilot.painPoints.map((painPoint, idx) => (
            <div key={idx} className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <a
                href={painPoint.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline inline-flex items-center gap-1"
              >
                {painPoint.name}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Target KPIs */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Target KPIs</h3>
        <ul className="text-sm space-y-1">
          {pilot.kpis.map((kpi, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>{kpi}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Capabilities */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Key Capabilities</h3>
        <div className="flex flex-wrap gap-1.5">
          {pilot.stack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

    {/* Build vs Buy */}
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">Build vs Buy</h3>
      <BuildVsBuy recommendation={pilot.buildVsBuy} buyUrl={pilot.buyUrl} />
    </div>

    {/* Sources */}
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">Sources</h3>
      <Sources sources={pilot.sources} />
    </div>
    </div>
  );
}

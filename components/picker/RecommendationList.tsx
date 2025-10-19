import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ScoredPilot } from '@/lib/pilots';
import { getSectorIcon } from '@/lib/sector-icons';
import type { SectorType } from '@/lib/sector-icons';
import { BuildVsBuy } from '@/components/pilots/BuildVsBuy';
import { Sources } from '@/components/pilots/Sources';

interface RecommendationListProps {
  recommendations: ScoredPilot[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center text-muted-foreground p-8">
        <div>
          <p className="text-lg font-semibold mb-2">No recommendations yet</p>
          <p className="text-sm">
            Send a message describing your needs, and I&apos;ll find the best pilots for you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="sticky top-0 bg-background pb-2 border-b">
        <h2 className="text-lg font-semibold">Recommended Pilots</h2>
        <p className="text-sm text-muted-foreground">Based on your requirements</p>
      </div>

      <div className="space-y-4">
        {recommendations.map((scored, index) => {
          const SectorIcon = getSectorIcon(scored.pilot.sector as SectorType);
          return (
            <Card key={scored.pilot.id} className="shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border/50 bg-card">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-sm border-2 border-primary/20">
                      #{index + 1}
                    </div>
                    <CardTitle className="text-base font-bold">{scored.pilot.title}</CardTitle>
                  </div>
                  <Badge variant="default" className="shrink-0 font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/30">
                    {Math.round(scored.score * 100)}% match
                  </Badge>
                </div>
                <CardDescription>{scored.pilot.oneLiner}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
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
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-muted-foreground">Sector:</span>{' '}
                    <Badge variant="secondary" className="text-xs ml-1 flex items-center gap-1">
                      <SectorIcon className="h-3 w-3" />
                      {scored.pilot.sector}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Overall Pick:</span>{' '}
                    <span
                      className={
                        scored.pilot.overallPick >= 7
                          ? 'text-green-600 dark:text-green-400'
                          : scored.pilot.overallPick >= 4
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {scored.pilot.overallPick}/10
                    </span>
                  </div>
                </div>

                {/* Build vs Buy and Sources */}
    <div className="space-y-2">
      <BuildVsBuy recommendation={scored.pilot.buildVsBuy} buyUrl={scored.pilot.buyUrl} />
      <Sources sources={scored.pilot.sources} />
    </div>

                {/* CTA */}
                <Link href={`/pilots/${scored.pilot.id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 border-border shadow-sm hover:shadow-md font-medium">
                    View Full Details →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


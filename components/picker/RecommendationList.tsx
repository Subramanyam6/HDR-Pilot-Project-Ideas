import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ScoredPilot } from '@/lib/pilots';

interface RecommendationListProps {
  recommendations: ScoredPilot[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center text-muted-foreground p-8">
        <div>
          <p className="text-lg font-semibold mb-2">💡 No recommendations yet</p>
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
        {recommendations.map((scored, index) => (
          <Card key={scored.pilot.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/10 bg-gradient-to-br from-card to-background">
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-sm shadow-md">
                    #{index + 1}
                  </div>
                  <CardTitle className="text-base">{scored.pilot.title}</CardTitle>
                </div>
                <Badge variant="default" className="shrink-0">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


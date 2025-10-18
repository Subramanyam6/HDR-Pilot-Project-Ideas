"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Pilot } from "@/lib/pilots";

interface PilotCardProps {
  pilot: Pilot;
  showCTA?: boolean;
}

export function PilotCard({ pilot, showCTA = true }: PilotCardProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllStack, setShowAllStack] = useState(false);
  const parsedRisk = typeof pilot.wheelRisk === "number" ? pilot.wheelRisk : parseFloat(String(pilot.wheelRisk));
  const riskScore = Number.isFinite(parsedRisk) ? parsedRisk : 0;

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border/50 bg-card backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg leading-tight font-bold">{pilot.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0 max-w-full truncate font-medium bg-secondary/80 text-secondary-foreground">
            {pilot.sector}
          </Badge>
        </div>
        <CardDescription>{pilot.oneLiner}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="flex flex-wrap gap-2">
          {(showAllTags ? pilot.tags : pilot.tags.slice(0, 3)).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-medium px-2.5 py-0.5 bg-muted/60 text-foreground border border-border/30">
              {tag}
            </Badge>
          ))}
          {pilot.tags.length > 3 && (
            <Badge 
              variant="secondary" 
              className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-medium px-2.5 py-0.5 bg-muted/60 border border-border/30"
              onClick={() => setShowAllTags(!showAllTags)}
            >
              {showAllTags ? '−' : `+${pilot.tags.length - 3}`}
            </Badge>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Key Outcomes:</p>
          <ul className="text-xs space-y-0.5">
            {pilot.kpis.slice(0, 2).map((kpi, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-primary mr-1">•</span>
                <span>{kpi}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1.5">Stack:</p>
          <div className="flex flex-wrap gap-2">
            {(showAllStack ? pilot.stack : pilot.stack.slice(0, 3)).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs font-medium px-2.5 py-0.5 bg-muted/60 text-foreground border border-border/30">
                {tech}
              </Badge>
            ))}
            {pilot.stack.length > 3 && (
              <Badge 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-medium px-2.5 py-0.5 bg-muted/60 border border-border/30"
                onClick={() => setShowAllStack(!showAllStack)}
              >
                {showAllStack ? '−' : `+${pilot.stack.length - 3}`}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs pt-2 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-muted-foreground">Feasibility:</span>
            <Badge variant={pilot.feasibility === "solo-90-day" ? "default" : "secondary"} className="text-xs font-medium px-2 py-0.5">
              {pilot.feasibility === "solo-90-day" ? "Solo 90-day" : "Configure"}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-muted-foreground">Risk:</span>
            <Badge 
              variant="secondary"
              className={`text-xs font-medium px-2 py-0.5 ${
                riskScore <= 4 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                  : riskScore <= 7 
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {riskScore}/10
            </Badge>
          </div>
        </div>
      </CardContent>

      {showCTA && (
        <CardFooter className="pt-4">
          <Link href={`/pilots/${pilot.id}`} className="w-full">
            <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 border-border shadow-sm hover:shadow-md font-medium">
              View Details →
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

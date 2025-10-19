"use client";

import Link from "next/link";
import { useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Pilot } from "@/lib/pilots";
import { getSectorIcon } from "@/lib/sector-icons";
import type { SectorType } from "@/lib/sector-icons";
import { BuildVsBuy } from "./BuildVsBuy";
import { Sources } from "./Sources";
import { Competitors } from "./Competitors";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PilotCardProps {
  pilot: Pilot;
  showCTA?: boolean;
  isTopPilot?: boolean;
}

export function PilotCard({ pilot, showCTA = true, isTopPilot = false }: PilotCardProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllStack, setShowAllStack] = useState(false);
  const pickScore = typeof pilot.overallPick === "number" ? pilot.overallPick : parseFloat(String(pilot.overallPick));
  const overallPick = Number.isFinite(pickScore) ? pickScore : 5;
  
  const SectorIcon = getSectorIcon(pilot.sector as SectorType);

  return (
    <Card className="relative flex flex-col h-full shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border/50 bg-card backdrop-blur-sm">
      {isTopPilot && (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="absolute top-3 right-3 z-10 inline-flex h-6 w-6 items-center justify-center">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="left">Bala&apos;s Pick</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg leading-tight font-bold pr-8">{pilot.title}</CardTitle>
          <Badge 
            variant="secondary" 
            className="shrink-0 max-w-full truncate font-semibold text-sm px-3 py-1 bg-primary/15 text-primary border-2 border-primary/30 flex items-center gap-1.5"
          >
            <SectorIcon className="h-4 w-4" />
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
          <p className="text-xs font-semibold text-muted-foreground mb-1">Pain Points:</p>
          <div className="text-xs space-y-0.5">
            {pilot.painPoints.slice(0, 2).map((painPoint, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-red-500 mr-1">•</span>
                <a
                  href={painPoint.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline inline-flex items-center gap-1"
                >
                  {painPoint.name}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Target KPIs:</p>
          <ul className="text-xs space-y-0.5">
            {pilot.kpis.slice(0, 2).map((kpi, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-emerald-500 mr-1">•</span>
                <span>{kpi}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1.5">Key Capabilities:</p>
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

        <div className="flex flex-col gap-2 text-xs pt-2 border-t border-border/30">
          <Competitors competitors={pilot.competitors} />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-muted-foreground">Overall Pick:</span>
            <Badge 
              variant="secondary"
              className={`text-xs font-medium px-2 py-0.5 ${
                overallPick >= 7 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                  : overallPick >= 4 
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {overallPick}/10
            </Badge>
          </div>
      <BuildVsBuy recommendation={pilot.buildVsBuy} buyUrl={pilot.buyUrl} />
      <Sources sources={pilot.sources} />
        </div>
      </CardContent>

      {showCTA && (
        <CardFooter className="pt-4">
          <Button variant="outline" asChild className="w-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 border-border shadow-sm hover:shadow-md font-medium">
            <Link href={`/pilots/${pilot.id}`}>
              View Details →
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

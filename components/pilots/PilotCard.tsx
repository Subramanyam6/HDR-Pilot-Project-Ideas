import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Pilot } from "@/lib/pilots";

interface PilotCardProps {
  pilot: Pilot;
  showCTA?: boolean;
}

export function PilotCard({ pilot, showCTA = true }: PilotCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/10 bg-gradient-to-br from-card to-background">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg">{pilot.title}</CardTitle>
          <Badge variant="outline" className="shrink-0">
            {pilot.sector}
          </Badge>
        </div>
        <CardDescription>{pilot.oneLiner}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {pilot.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {pilot.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{pilot.tags.length - 3}
            </Badge>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Key Outcomes:</p>
          <ul className="text-xs space-y-0.5">
            {pilot.kpis.slice(0, 2).map((kpi, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-primary mr-1">✓</span>
                <span>{kpi}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Stack:</p>
          <div className="flex flex-wrap gap-1.5">
            {pilot.stack.slice(0, 4).map((tech) => (
              <span key={tech} className="text-xs px-2 py-0.5 bg-accent rounded">
                {tech}
              </span>
            ))}
            {pilot.stack.length > 4 && (
              <span className="text-xs px-2 py-0.5 bg-accent rounded">
                +{pilot.stack.length - 4}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="font-semibold text-muted-foreground">Feasibility:</span>{" "}
            <span className={pilot.feasibility === "solo-90-day" ? "text-green-600 dark:text-green-400" : ""}>
              {pilot.feasibility === "solo-90-day" ? "Solo 90-day" : "Configure"}
            </span>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Risk:</span>{" "}
            <span className={pilot.wheelRisk <= 4 ? "text-green-600 dark:text-green-400" : pilot.wheelRisk <= 7 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}>
              {pilot.wheelRisk}/10
            </span>
          </div>
        </div>
      </CardContent>

      {showCTA && (
        <CardFooter>
          <Link href={`/pilots/${pilot.id}`} className="w-full">
            <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200 border-primary/30">
              View Details →
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

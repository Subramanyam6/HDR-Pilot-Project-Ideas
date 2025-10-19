import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Metadata } from '@/components/pilots/Metadata';
import { getAllPilots, getPilotById } from '@/lib/pilots';
import { ExternalLink } from 'lucide-react';

interface PilotDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  const pilots = getAllPilots();
  return pilots.map((pilot) => ({
    id: pilot.id,
  }));
}

export default function PilotDetailPage({ params }: PilotDetailPageProps) {
  const pilot = getPilotById(params.id);

  if (!pilot) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/pilots" className="hover:text-foreground">
              Pilots
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{pilot.title}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 space-y-8">
          {/* Header */}
          <div className="pb-6 border-b border-border/50">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground tracking-tight leading-tight">{pilot.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">{pilot.oneLiner}</p>
          </div>

          {/* Problem */}
          <Card className="border border-border/50 shadow-md bg-card">
            <CardHeader className="bg-destructive/5 border-b border-border/30">
              <CardTitle className="text-xl font-bold tracking-tight text-destructive">
                <span className="inline-flex items-center rounded-md bg-destructive/10 px-3 py-1">
                  The Problem
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground leading-relaxed">{pilot.problem}</p>
            </CardContent>
          </Card>

          {/* Pain Points */}
          {pilot.painPoints && pilot.painPoints.length > 0 && (
            <Card className="border border-border/50 shadow-md bg-card">
              <CardHeader className="bg-destructive/5 border-b border-border/30">
                <CardTitle className="text-xl font-bold tracking-tight text-destructive">
                  <span className="inline-flex items-center rounded-md bg-destructive/10 px-3 py-1">
                    Pain Points
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {pilot.painPoints.map((painPoint, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-red-500 text-lg mt-0.5 font-bold">•</span>
                      <a
                        href={painPoint.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline inline-flex items-center gap-1"
                      >
                        {painPoint.name}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Approach */}
          <Card className="border border-border/50 shadow-md bg-card">
            <CardHeader className="bg-primary/5 border-b border-border/30">
              <CardTitle className="text-xl font-bold tracking-tight text-primary">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1">
                  Our Approach
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground leading-relaxed">{pilot.approach}</p>
            </CardContent>
          </Card>

          {/* 1-Week Scope Sprint */}
          <Card className="border border-border/50 shadow-md bg-card">
            <CardHeader className="bg-amber-500/10 border-b border-border/30">
              <CardTitle className="text-xl font-bold tracking-tight text-amber-600">
                <span className="inline-flex items-center rounded-md bg-amber-500/15 px-3 py-1">
                  1-Week Scope Sprint
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground leading-relaxed">{pilot.oneWeek}</p>
            </CardContent>
          </Card>

          {/* 90-Day Pilot */}
          <Card className="border border-border/50 shadow-md bg-card">
            <CardHeader className="bg-emerald-500/10 border-b border-border/30">
              <CardTitle className="text-xl font-bold tracking-tight text-emerald-600">
                <span className="inline-flex items-center rounded-md bg-emerald-500/15 px-3 py-1">
                  90-Day Pilot Deliverables
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground leading-relaxed">{pilot.ninetyDay}</p>
            </CardContent>
          </Card>

          {/* Key Capabilities */}
          {pilot.stack && pilot.stack.length > 0 && (
            <Card className="border border-border/50 shadow-md bg-card">
              <CardHeader className="bg-muted/10 border-b border-border/30">
                <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                  <span className="inline-flex items-center rounded-md bg-muted/40 px-3 py-1">
                    Key Capabilities
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {pilot.stack.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* KPIs */}
          <Card className="border border-border/50 shadow-md bg-card">
            <CardHeader className="bg-sky-500/10 border-b border-border/30">
              <CardTitle className="text-xl font-bold tracking-tight text-sky-600">
                <span className="inline-flex items-center rounded-md bg-sky-500/15 px-3 py-1">
                  Key Performance Indicators
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {pilot.kpis.map((kpi, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-primary text-lg mt-0.5 font-bold">•</span>
                    <span className="leading-relaxed">{kpi}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Risks & Guardrails */}
          <Card className="border border-border/50 shadow-md bg-card">
            <CardHeader className="bg-rose-500/10 border-b border-border/30">
              <CardTitle className="text-xl font-bold tracking-tight text-rose-600">
                <span className="inline-flex items-center rounded-md bg-rose-500/15 px-3 py-1">
                  Risks & Guardrails
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {pilot.risks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-destructive text-lg mt-0.5 font-bold">•</span>
                    <span className="leading-relaxed">{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Buy vs Build */}
          <Card className="border border-border/50 shadow-md bg-card">
            <CardHeader className="bg-indigo-500/10 border-b border-border/30">
              <CardTitle className="text-xl font-bold tracking-tight text-indigo-600">
                <span className="inline-flex items-center rounded-md bg-indigo-500/15 px-3 py-1">
                  Buy vs. Build
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground leading-relaxed">{pilot.buyVsBuild}</p>
            </CardContent>
          </Card>

        </div>

        {/* Sidebar metadata */}
        <aside className="lg:w-80 shrink-0">
          <div className="sticky top-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pilot Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <Metadata pilot={pilot} />
              </CardContent>
            </Card>

            <div className="mt-4 space-y-2">
              <Link href="/picker" className="block">
                <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                  Ask AI for Recommendations →
                </Button>
              </Link>
              <Link href="/pilots" className="block">
                <Button variant="ghost" className="w-full">
                  ← Back to All Pilots
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

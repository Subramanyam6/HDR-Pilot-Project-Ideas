import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Metadata } from '@/components/pilots/Metadata';
import { getAllPilots, getPilotById } from '@/lib/pilots';

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
              <CardTitle className="text-foreground font-bold text-xl tracking-tight">
                The Problem
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground leading-relaxed">{pilot.problem}</p>
            </CardContent>
          </Card>

          {/* Approach */}
          <Card className="border border-border/50 shadow-md bg-card">
            <CardHeader className="bg-primary/5 border-b border-border/30">
              <CardTitle className="text-foreground font-bold text-xl tracking-tight">
                Our Approach
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground leading-relaxed">{pilot.approach}</p>
            </CardContent>
          </Card>

          {/* 1-Week Scope Sprint */}
          <Card className="border border-border/50 shadow-md bg-accent/5">
            <CardHeader className="bg-accent/10 border-b border-border/30">
              <CardTitle className="text-foreground font-bold text-xl tracking-tight">
                1-Week Scope Sprint
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground leading-relaxed">{pilot.oneWeek}</p>
            </CardContent>
          </Card>

          {/* 90-Day Pilot */}
          <Card className="border border-border/50 shadow-md bg-primary/5">
            <CardHeader className="bg-primary/10 border-b border-border/30">
              <CardTitle className="text-foreground font-bold text-xl tracking-tight">
                90-Day Pilot Deliverables
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground leading-relaxed">{pilot.ninetyDay}</p>
            </CardContent>
          </Card>

          {/* KPIs */}
          <Card className="border border-border/50 shadow-md bg-card">
            <CardHeader className="bg-muted/10 border-b border-border/30">
              <CardTitle className="text-foreground font-bold text-xl tracking-tight">
                Key Performance Indicators
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
            <CardHeader className="bg-destructive/5 border-b border-border/30">
              <CardTitle className="text-foreground font-bold text-xl tracking-tight">
                Risks & Guardrails
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
            <CardHeader className="bg-muted/10 border-b border-border/30">
              <CardTitle className="text-foreground font-bold text-xl tracking-tight">
                Buy vs. Build
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground leading-relaxed">{pilot.buyVsBuild}</p>
            </CardContent>
          </Card>

          {/* TODO: PDF export placeholder */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              📄 PDF export feature coming soon
            </p>
            <Button variant="outline" disabled>
              Export Pilot Brief (PDF)
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              TODO: Integrate PDF generation library (e.g., jsPDF, Puppeteer)
            </p>
          </div>
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
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
          <div className="pb-6 border-b border-primary/20">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">{pilot.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{pilot.oneLiner}</p>
          </div>

          {/* Problem */}
          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-primary">🎯</span>
                The Problem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{pilot.problem}</p>
            </CardContent>
          </Card>

          {/* Approach */}
          <Card className="border-accent/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-accent">💡</span>
                Our Approach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{pilot.approach}</p>
            </CardContent>
          </Card>

          {/* 1-Week Scope Sprint */}
          <Card className="border-accent/30 shadow-md bg-gradient-to-br from-accent/5 to-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <span className="bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">1-Week Scope Sprint</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{pilot.oneWeek}</p>
            </CardContent>
          </Card>

          {/* 90-Day Pilot */}
          <Card className="border-primary/30 shadow-md bg-gradient-to-br from-primary/5 to-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">90-Day Pilot Deliverables</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{pilot.ninetyDay}</p>
            </CardContent>
          </Card>

          {/* KPIs */}
          <Card className="border-success/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-success">📊</span>
                Key Performance Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pilot.kpis.map((kpi, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">✓</span>
                    <span>{kpi}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Risks & Guardrails */}
          <Card className="border-warning/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-warning">⚠️</span>
                Risks & Guardrails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pilot.risks.map((risk, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5">⚠️</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Buy vs Build */}
          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-primary">⚖️</span>
                Buy vs. Build
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  Find Similar Pilots →
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
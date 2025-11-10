import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PilotCard } from '@/components/pilots/PilotCard';
import { getTopPilots } from '@/lib/pilots';

export default function HomePage() {
  const topPilots = getTopPilots();

  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-20 text-center shadow-lg md:px-16">
          <div className="space-y-8">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
              HDR Pilot Ideas
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-2xl md:leading-relaxed">
              15 launch-ready pilots to align stakeholders, de-risk delivery, and deliver fast.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row">
              <Button asChild className="bg-primary px-8 py-6 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-2xl">
                <Link href="/pilots">
                  Explore the Pilot Library
                </Link>
              </Button>
              <Button asChild
                className="px-8 py-6 text-base font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl btn-picker-gradient focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
              >
                <Link href="/picker">
                  Start with Pilot Picker
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Top 3 Pilots */}
        <section>
          <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Top 3 Pilots</h2>
              <p className="text-muted-foreground mt-2 text-base">Bala&apos;s Recommendations</p>
            </div>
            <Button asChild className="bg-primary px-6 py-2 text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl">
              <Link href="/pilots">
                Browse All Pilots
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {topPilots.map((pilot, index) => (
              <PilotCard key={pilot.id} pilot={pilot} isTopPilot={true} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="space-y-6 rounded-2xl border border-border bg-card py-16 text-center shadow-lg">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Not sure where to start?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Let the <span className="text-primary font-bold">Pilot Picker</span> surface initiatives that match your timelines, teams, and risk appetite—no guesswork required.
          </p>
          <div className="mt-4">
            <Button
              asChild
              className="px-8 py-6 text-base font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl btn-picker-gradient focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
            >
              <Link href="/picker">
                Launch Pilot Picker →
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

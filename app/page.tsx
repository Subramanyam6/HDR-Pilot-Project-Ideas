import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PilotCard } from '@/components/pilots/PilotCard';
import { getTopPilots } from '@/lib/pilots';

export default function HomePage() {
  const topPilots = getTopPilots();

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-6 py-16 px-4">
        <div className="inline-block">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Pilot Project Ideas for HDR
          </h1>
          <div className="h-1.5 bg-primary mt-6 rounded-full shadow-sm"></div>
        </div>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Discover <span className="text-primary font-semibold">15 actionable pilot projects</span> across Transportation, Water, Energy, Buildings, 
          Environmental, and Internal sectors—each scoped for rapid execution.
        </p>
      </section>

      {/* Top 3 Pilots */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Top 3 Pilots</h2>
            <p className="text-muted-foreground mt-2 text-base">
              Our most impactful, ready-to-launch pilots
            </p>
          </div>
          <Link href="/pilots">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-xl transition-all duration-300 font-semibold">
              Browse All Pilots
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {topPilots.map((pilot) => (
            <PilotCard key={pilot.id} pilot={pilot} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 space-y-6 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Not sure where to start?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Use our <span className="text-primary font-bold">Pilot Picker</span> to get personalized recommendations based on 
          your needs, constraints, and goals.
        </p>
        <div className="mt-4">
          <Link href="/picker">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-base px-8 py-6 font-semibold">
              Try Pilot Picker →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

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
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
            Pilot Project Ideas for HDR
          </h1>
          <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mt-4"></div>
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Top 3 Pilots</h2>
            <p className="text-muted-foreground mt-1">
              Our most impactful, ready-to-launch pilots
            </p>
          </div>
          <Link href="/pilots">
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300">
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
      <section className="text-center py-16 space-y-6 bg-gradient-to-b from-transparent via-primary/5 to-transparent rounded-2xl">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Not sure where to start?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Use our <span className="text-accent font-semibold">Pilot Picker (AI Powered)</span> chatbot to get personalized recommendations based on 
          your needs, constraints, and goals.
        </p>
        <Link href="/picker">
          <Button size="lg" className="bg-gradient-to-r from-accent to-warning hover:from-accent/90 hover:to-warning/90 text-accent-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 text-base px-8 py-6">
            Try Pilot Picker →
          </Button>
        </Link>
      </section>
    </div>
  );
}


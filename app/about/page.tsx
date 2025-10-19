import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Pilot Library',
    detail:
      'Curated set of launch-ready pilot concepts with sector tags, KPIs, risks, build-vs-buy recommendations, and competitive landscape.',
  },
  {
    title: 'Filtering & Discovery',
    detail:
      'Interactive filters for sector, tags, and scoring help teams surface pilots that match their needs without leaving the page.',
  },
  {
    title: 'AI Pilot Assistant',
    detail:
      'Embedded chat experience that combines keyword and semantic search to suggest relevant pilots and highlight supporting reasons.',
  },
  {
    title: 'Pilot Detail Briefs',
    detail:
      'Structured detail pages outline the problem, execution approach, sprints, KPIs, and risks so stakeholders can align quickly.',
  },
];

const stack = [
  {
    title: 'Interface & Framework',
    items: [
      'Next.js App Router with React Server Components',
      'Tailwind CSS design system with shadcn/ui primitives',
      'Framer Motion for micro-interactions and animations',
    ],
  },
  {
    title: 'Data & Business Logic',
    items: [
      'Static pilot catalog stored as structured JSON and validated with Zod',
      'Typed helper utilities for sorting, filtering, and scoring',
      'APIs for search and chat orchestration built on Next.js route handlers',
    ],
  },
  {
    title: 'AI Chatbot',
    items: [
      "Responses are generated with OpenAI's gpt-4o model wired through serverless route handlers.",
      'Retrieval-augmented generation flow that blends keyword filtering with embedding similarity over the pilot catalog',
      'Scoring logic balances tag overlap, title and one-liner relevance, and overall pick scores to rank candidates',
      'Chat APIs orchestrate search and answer endpoints so responses include both narrative guidance and pilot IDs',
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">About HDR Pilot Ideas</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            HDR Pilot Ideas is an internal discovery tool that showcases a vetted set of innovation pilots. It helps
            teams quickly understand the problem each pilot tackles, how to execute it, and the resources required to
            move from concept to delivery.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="border border-border/50 shadow-md bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Technology Overview</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {stack.map((area) => (
              <Card key={area.title} className="border border-border/50 shadow-md bg-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                    {area.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card className="border border-border/50 shadow-md bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Project Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Provide HDR teams with a single source of truth for pilot opportunities, summarizing the core problem,
                approach, timelines, KPIs, and risks in a consistent format that supports planning discussions.
              </p>
              <p>
                Pair the catalog with an assistant that suggests relevant pilots using transparent retrieval and ranking
                logic, so users can move from a question to actionable recommendations without manual research.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

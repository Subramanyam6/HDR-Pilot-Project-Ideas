'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PilotCard } from '@/components/pilots/PilotCard';
import { getTopPilots } from '@/lib/pilots';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const topPilots = getTopPilots();

  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Hero */}
        <motion.section
          className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-20 text-center shadow-lg md:px-16"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="space-y-8">
            <motion.h1 
              className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl"
              variants={fadeInUp}
            >
              HDR Pilot Ideas
            </motion.h1>
            <motion.p
              className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-2xl md:leading-relaxed"
              variants={fadeInUp}
            >
15 launch-ready pilots to align stakeholders, de-risk delivery, and deliver fast.
            </motion.p>
            <motion.div className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row" variants={fadeInUp}>
              <Link href="/pilots">
                <Button className="bg-primary px-8 py-6 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-2xl">
                  Explore the Pilot Library
                </Button>
              </Link>
              <Link href="/picker">
                <Button
                  variant="outline"
                  className="border-primary/40 px-8 py-6 text-base font-semibold text-primary shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary/10"
                >
                  Start with Pilot Picker
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Top 3 Pilots */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between" variants={fadeInUp}>
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Top 3 Pilots</h2>
              <p className="text-muted-foreground mt-2 text-base">Bala&apos;s Recommendations</p>
            </div>
            <Link href="/pilots">
              <Button className="bg-primary px-6 py-2 text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl">
                Browse All Pilots
              </Button>
            </Link>
          </motion.div>
          <motion.div className="grid gap-6 md:grid-cols-3" variants={staggerContainer}>
            {topPilots.map((pilot, index) => (
              <motion.div key={pilot.id} variants={fadeInUp} transition={{ delay: index * 0.1 }}>
                <PilotCard pilot={pilot} isTopPilot={true} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="space-y-6 rounded-2xl border border-border bg-card py-16 text-center shadow-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight" variants={fadeInUp}>
            Not sure where to start?
          </motion.h2>
          <motion.p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed" variants={fadeInUp}>
            Let the <span className="text-primary font-bold">Pilot Picker</span> surface initiatives that match your timelines, teams, and risk appetite—no guesswork required.
          </motion.p>
          <motion.div className="mt-4" variants={fadeInUp}>
            <Link href="/picker">
              <Button
                size="lg"
                className="bg-primary px-10 py-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-2xl"
              >
                Launch Pilot Picker →
              </Button>
            </Link>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}

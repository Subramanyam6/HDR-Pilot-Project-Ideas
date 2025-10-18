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
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <motion.section 
        className="text-center space-y-6 py-16 px-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div className="inline-block" variants={fadeInUp}>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Pilot Project Ideas for HDR
          </h1>
          <motion.div 
            className="h-1.5 bg-primary mt-6 rounded-full shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          variants={fadeInUp}
        >
          Discover <span className="text-primary font-semibold">15 actionable pilot projects</span> across Transportation, Water, Energy, Buildings, 
          Environmental, and Internal sectors—each scoped for rapid execution.
        </motion.p>
      </motion.section>

      {/* Top 3 Pilots */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.div className="flex items-center justify-between mb-8" variants={fadeInUp}>
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Top 3 Pilots</h2>
            <p className="text-muted-foreground mt-2 text-base">
              Bala's Recommendations
            </p>
          </div>
          <Link href="/pilots">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-xl transition-all duration-300 font-semibold">
              Browse All Pilots
            </Button>
          </Link>
        </motion.div>
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
        >
          {topPilots.map((pilot, index) => (
            <motion.div
              key={pilot.id}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <PilotCard pilot={pilot} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA */}
      <motion.section 
        className="text-center py-16 space-y-6 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight"
          variants={fadeInUp}
        >
          Not sure where to start?
        </motion.h2>
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          variants={fadeInUp}
        >
          Use our <span className="text-primary font-bold">Pilot Picker</span> to get personalized recommendations based on 
          your needs, constraints, and goals.
        </motion.p>
        <motion.div className="mt-4" variants={fadeInUp}>
          <Link href="/picker">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-base px-8 py-6 font-semibold">
              Try Pilot Picker →
            </Button>
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}

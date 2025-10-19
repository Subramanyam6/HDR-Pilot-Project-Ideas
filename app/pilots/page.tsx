'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { PilotCard } from '@/components/pilots/PilotCard';
import { Filters, type FilterState } from '@/components/pilots/Filters';
import { getAllPilots, getTopPilots } from '@/lib/pilots';

// Animated Pilot Card Component
interface AnimatedPilotCardProps {
  pilot: any;
  isTopPilot: boolean;
  index: number;
}

const AnimatedPilotCard: React.FC<AnimatedPilotCardProps> = ({ pilot, isTopPilot, index }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: false });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="cursor-pointer"
    >
      <PilotCard pilot={pilot} isTopPilot={isTopPilot} />
    </motion.div>
  );
};

export default function PilotsPage() {
  const allPilots = getAllPilots();
  const topPilots = getTopPilots();
  const topPilotIds = React.useMemo(() => topPilots.map(p => p.id), [topPilots]);

  const [filters, setFilters] = React.useState<FilterState>({
    sectors: [],
    overallPickMin: 1,
    tags: [],
    search: '',
    sortBy: 'relevance',
  });

  const [isMounted, setIsMounted] = React.useState(false);

  // Ensure component is mounted before applying client-side filters
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Apply filters
  const filteredPilots = React.useMemo(() => {
    let result = [...allPilots];

    // Filter by sectors
    if (filters.sectors.length > 0) {
      result = result.filter((p) => filters.sectors.includes(p.sector));
    }

    // Filter by overall pick
    result = result.filter((p) => p.overallPick >= filters.overallPickMin);

    // Filter by tags
    if (filters.tags.length > 0) {
      result = result.filter((p) =>
        filters.tags.some((tag) => p.tags.includes(tag))
      );
    }

    // Filter by search
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.oneLiner.toLowerCase().includes(searchLower) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    if (filters.sortBy === 'overallPick') {
      result.sort((a, b) => b.overallPick - a.overallPick); // Higher first
    }

    return result;
  }, [allPilots, filters]);

  const availableTags = React.useMemo(() => {
    const tagOrder: string[] = [];
    const seen = new Set<string>();

    filteredPilots.forEach((pilot) => {
      pilot.tags.forEach((tag) => {
        if (!seen.has(tag)) {
          seen.add(tag);
          tagOrder.push(tag);
        }
      });
    });

    filters.tags.forEach((tag) => {
      if (!seen.has(tag)) {
        seen.add(tag);
        tagOrder.push(tag);
      }
    });

    return tagOrder;
  }, [filteredPilots, filters.tags]);

  // Show total count initially, filtered count after component mounts and filters are applied
  const displayCount = isMounted ? filteredPilots.length : allPilots.length;
  const hasActiveFilters = filters.sectors.length > 0 || filters.tags.length > 0 || filters.search.trim() || filters.overallPickMin > 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">All Pilots</h1>
          <motion.p 
            className="text-muted-foreground mt-2 text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-primary font-bold text-lg">{displayCount}</span> <span className="font-medium">pilot{displayCount !== 1 ? 's' : ''} {hasActiveFilters ? 'found' : 'available'}</span>
          </motion.p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <motion.aside 
          className="lg:w-80 shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="sticky top-4">
            <Filters filters={filters} onChange={setFilters} availableTags={availableTags} />
          </div>
        </motion.aside>

        {/* Pilots grid */}
        <div className="flex-1">
          <motion.div
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredPilots.map((pilot, index) => (
              <AnimatedPilotCard
                key={pilot.id}
                pilot={pilot}
                isTopPilot={topPilotIds.includes(pilot.id)}
                index={index}
              />
            ))}
          </motion.div>
          {filteredPilots.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg text-muted-foreground">No pilots match your filters.</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filter criteria.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

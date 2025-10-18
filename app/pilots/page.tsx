'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PilotCard } from '@/components/pilots/PilotCard';
import { Filters, type FilterState } from '@/components/pilots/Filters';
import { getAllPilots } from '@/lib/pilots';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function PilotsPage() {
  const allPilots = getAllPilots();
  
  const [filters, setFilters] = React.useState<FilterState>({
    sectors: [],
    feasibility: 'all',
    wheelRiskMax: 10,
    tags: [],
    search: '',
    sortBy: 'relevance',
  });

  // Apply filters
  const filteredPilots = React.useMemo(() => {
    let result = [...allPilots];

    // Filter by sectors
    if (filters.sectors.length > 0) {
      result = result.filter((p) => filters.sectors.includes(p.sector));
    }

    // Filter by feasibility
    if (filters.feasibility !== 'all') {
      result = result.filter((p) => p.feasibility === filters.feasibility);
    }

    // Filter by wheel risk
    result = result.filter((p) => p.wheelRisk <= filters.wheelRiskMax);

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
    if (filters.sortBy === 'wheelRisk') {
      result.sort((a, b) => a.wheelRisk - b.wheelRisk);
    } else if (filters.sortBy === 'feasibility') {
      result.sort((a, b) => {
        if (a.feasibility === 'solo-90-day' && b.feasibility !== 'solo-90-day') return -1;
        if (a.feasibility !== 'solo-90-day' && b.feasibility === 'solo-90-day') return 1;
        return 0;
      });
    }

    return result;
  }, [allPilots, filters]);

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
            <span className="text-primary font-bold text-lg">{filteredPilots.length}</span> <span className="font-medium">pilot{filteredPilots.length !== 1 ? 's' : ''} found</span>
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
            <Filters filters={filters} onChange={setFilters} />
          </div>
        </motion.aside>

        {/* Pilots grid */}
        <div className="flex-1">
          <motion.div 
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredPilots.map((pilot, index) => (
              <motion.div
                key={pilot.id}
                variants={fadeInUp}
                transition={{ delay: index * 0.03 }}
              >
                <PilotCard pilot={pilot} />
              </motion.div>
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
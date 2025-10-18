'use client';

import * as React from 'react';
import { PilotCard } from '@/components/pilots/PilotCard';
import { Filters, type FilterState } from '@/components/pilots/Filters';
import { getAllPilots } from '@/lib/pilots';

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">All Pilots</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            <span className="text-primary font-semibold">{filteredPilots.length}</span> pilot{filteredPilots.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-80 shrink-0">
          <div className="sticky top-4">
            <Filters filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Pilots grid */}
        <div className="flex-1">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPilots.map((pilot) => (
              <PilotCard key={pilot.id} pilot={pilot} />
            ))}
          </div>
          {filteredPilots.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No pilots match your filters.</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
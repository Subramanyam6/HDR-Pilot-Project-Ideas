'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SectorOptions, type Sector } from '@/lib/pilots';
import { getAllTags } from '@/lib/pilots';

export interface FilterState {
  sectors: Sector[];
  feasibility: 'all' | 'solo-90-day' | 'configure';
  wheelRiskMax: number;
  tags: string[];
  search: string;
  sortBy: 'relevance' | 'wheelRisk' | 'feasibility';
}

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function Filters({ filters, onChange }: FiltersProps) {
  const allTags = React.useMemo(() => getAllTags(), []);

  const handleSectorToggle = (sector: Sector) => {
    const newSectors = filters.sectors.includes(sector)
      ? filters.sectors.filter((s) => s !== sector)
      : [...filters.sectors, sector];
    onChange({ ...filters, sectors: newSectors });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onChange({ ...filters, tags: newTags });
  };

  const handleReset = () => {
    onChange({
      sectors: [],
      feasibility: 'all',
      wheelRiskMax: 10,
      tags: [],
      search: '',
      sortBy: 'relevance',
    });
  };

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Filters</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset} 
            className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <label htmlFor="filter-search" className="text-sm font-semibold mb-2 block">
            Search
          </label>
          <Input
            id="filter-search"
            type="search"
            placeholder="Keywords..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            aria-label="Search pilots by keywords"
          />
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="filter-sort" className="text-sm font-semibold mb-2 block">
            Sort By
          </label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => onChange({ ...filters, sortBy: value as any })}
          >
            <SelectTrigger id="filter-sort" aria-label="Sort pilots by">
              <SelectValue placeholder="Select sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="wheelRisk">Risk (Low to High)</SelectItem>
              <SelectItem value="feasibility">Feasibility (Solo first)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sectors */}
        <div>
          <label className="text-sm font-semibold mb-2 block">Sectors</label>
          <div className="space-y-2">
            {SectorOptions.map((sector) => (
              <label key={sector} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.sectors.includes(sector)}
                  onCheckedChange={() => handleSectorToggle(sector)}
                  aria-label={`Filter by ${sector} sector`}
                />
                <span className="text-sm">{sector}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Feasibility */}
        <div>
          <label htmlFor="filter-feasibility" className="text-sm font-semibold mb-2 block">
            Feasibility
          </label>
          <Select
            value={filters.feasibility}
            onValueChange={(value) => onChange({ ...filters, feasibility: value as any })}
          >
            <SelectTrigger id="filter-feasibility" aria-label="Filter by feasibility">
              <SelectValue placeholder="Select feasibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="solo-90-day">Solo 90-day</SelectItem>
              <SelectItem value="configure">Configure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Wheel Risk */}
        <div>
          <label htmlFor="filter-risk" className="text-sm font-semibold mb-2 block">
            Max Risk: {filters.wheelRiskMax}/10
          </label>
          <Slider
            id="filter-risk"
            min={0}
            max={10}
            step={1}
            value={[filters.wheelRiskMax]}
            onValueChange={(value) => onChange({ ...filters, wheelRiskMax: value[0] })}
            aria-label={`Maximum risk level: ${filters.wheelRiskMax} out of 10`}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-semibold mb-2 block">
            Tags ({filters.tags.length} selected)
          </label>
          <div className="max-h-48 overflow-y-auto space-y-2 border border-border rounded-md p-3">
            {allTags.map((tag) => (
              <label key={tag} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.tags.includes(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                  aria-label={`Filter by ${tag} tag`}
                />
                <span className="text-sm">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

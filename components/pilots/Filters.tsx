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
  overallPickMin: number;
  tags: string[];
  search: string;
  sortBy: 'relevance' | 'overallPick';
}

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableTags?: string[];
}

function mergeTags(base: string[], selected: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of base) {
    if (!seen.has(tag)) {
      seen.add(tag);
      result.push(tag);
    }
  }

  for (const tag of selected) {
    if (!seen.has(tag)) {
      seen.add(tag);
      result.push(tag);
    }
  }

  return result;
}

export function Filters({ filters, onChange, availableTags }: FiltersProps) {
  const allTags = React.useMemo(() => {
    const base = availableTags && availableTags.length > 0 ? availableTags : getAllTags();
    return mergeTags(base, filters.tags);
  }, [availableTags, filters.tags]);

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
      overallPickMin: 1,
      tags: [],
      search: '',
      sortBy: 'relevance',
    });
  };

  return (
    <Card className="border border-border/50 shadow-md bg-card">
      <CardHeader className="bg-muted/20 border-b border-border/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">
            <span className="text-foreground">Filters</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset} 
            className="hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring transition-colors font-medium"
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
              <SelectItem value="relevance">Relevance (Default)</SelectItem>
              <SelectItem value="overallPick">Overall Pick (High to Low)</SelectItem>
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

        {/* Overall Pick */}
        <div>
          <label htmlFor="filter-pick" className="text-sm font-semibold mb-2 block">
            Min Overall Pick: {filters.overallPickMin}/10
          </label>
          <Slider
            id="filter-pick"
            min={1}
            max={10}
            step={1}
            value={[filters.overallPickMin]}
            onValueChange={(value) => onChange({ ...filters, overallPickMin: value[0] })}
            aria-label={`Minimum overall pick level: ${filters.overallPickMin} out of 10`}
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

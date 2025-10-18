import { z } from 'zod';
import pilotsData from '../data/pilots.json';

// Zod schema for pilot validation
export const PilotSchema = z.object({
  id: z.string(),
  title: z.string(),
  sector: z.enum(['Transportation', 'Water', 'Energy', 'Buildings', 'Environmental', 'Internal']),
  tags: z.array(z.string()),
  oneLiner: z.string(),
  stack: z.array(z.string()),
  kpis: z.array(z.string()),
  feasibility: z.enum(['solo-90-day', 'configure']),
  wheelRisk: z.number().min(0).max(10),
  problem: z.string(),
  approach: z.string(),
  oneWeek: z.string(),
  ninetyDay: z.string(),
  risks: z.array(z.string()),
  buyVsBuild: z.string(),
  emb: z.array(z.number()),
});

export type Pilot = z.infer<typeof PilotSchema>;

export const SectorOptions = ['Transportation', 'Water', 'Energy', 'Buildings', 'Environmental', 'Internal'] as const;
export type Sector = typeof SectorOptions[number];

// Load all pilots
export function getAllPilots(): Pilot[] {
  try {
    return pilotsData as Pilot[];
  } catch (error) {
    console.error('Error loading pilots data:', error);
    return [];
  }
}

// Get pilot by ID
export function getPilotById(id: string): Pilot | undefined {
  try {
    return getAllPilots().find(p => p.id === id);
  } catch (error) {
    console.error('Error finding pilot by ID:', error);
    return undefined;
  }
}

// Get top 3 pinned pilots (manually selected for landing page)
export function getTopPilots(): Pilot[] {
  const allPilots = getAllPilots();
  // First 3 from JSON are the "top" pilots
  return allPilots.slice(0, 3);
}

// Filter options
export interface FilterOptions {
  sectors?: Sector[];
  feasibility?: 'solo-90-day' | 'configure' | 'all';
  wheelRiskMax?: number;
  tags?: string[];
  search?: string;
}

// Filter pilots
export function filterPilots(options: FilterOptions): Pilot[] {
  let pilots = getAllPilots();

  if (options.sectors && options.sectors.length > 0) {
    pilots = pilots.filter(p => options.sectors!.includes(p.sector as Sector));
  }

  if (options.feasibility && options.feasibility !== 'all') {
    pilots = pilots.filter(p => p.feasibility === options.feasibility);
  }

  if (options.wheelRiskMax !== undefined) {
    pilots = pilots.filter(p => p.wheelRisk <= options.wheelRiskMax!);
  }

  if (options.tags && options.tags.length > 0) {
    pilots = pilots.filter(p => 
      options.tags!.some(tag => p.tags.some(ptag => 
        ptag.toLowerCase().includes(tag.toLowerCase())
      ))
    );
  }

  if (options.search && options.search.trim()) {
    const searchLower = options.search.toLowerCase().trim();
    pilots = pilots.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.oneLiner.toLowerCase().includes(searchLower) ||
      p.tags.some(t => t.toLowerCase().includes(searchLower))
    );
  }

  return pilots;
}

// Sort options
export type SortOption = 'relevance' | 'wheelRisk' | 'feasibility';

export function sortPilots(pilots: Pilot[], sortBy: SortOption): Pilot[] {
  const sorted = [...pilots];
  
  switch (sortBy) {
    case 'wheelRisk':
      return sorted.sort((a, b) => a.wheelRisk - b.wheelRisk);
    case 'feasibility':
      return sorted.sort((a, b) => {
        // solo-90-day first
        if (a.feasibility === 'solo-90-day' && b.feasibility !== 'solo-90-day') return -1;
        if (a.feasibility !== 'solo-90-day' && b.feasibility === 'solo-90-day') return 1;
        return 0;
      });
    case 'relevance':
    default:
      return sorted;
  }
}

// Scoring function for recommendations
export interface ScoredPilot {
  pilot: Pilot;
  score: number;
  reasons: string[];
}

export function scorePilots(query: string, pilots: Pilot[] = getAllPilots()): ScoredPilot[] {
  try {
    const queryLower = query.toLowerCase();
    const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 2);

    return pilots.map(pilot => {
      let score = 0;
      const reasons: string[] = [];

      // Tag matching (0.6 weight)
      const tagMatches = pilot.tags.filter(tag =>
        queryTokens.some(token => tag.toLowerCase().includes(token))
      );
      if (tagMatches.length > 0) {
        const tagScore = 0.6 * (tagMatches.length / pilot.tags.length);
        score += tagScore;
        reasons.push(`Matches tags: ${tagMatches.join(', ')}`);
      }

      // Title/oneliner matching
      const titleMatch = queryTokens.some(token => pilot.title.toLowerCase().includes(token));
      const onelinerMatch = queryTokens.some(token => pilot.oneLiner.toLowerCase().includes(token));
      if (titleMatch || onelinerMatch) {
        score += 0.3;
        reasons.push('Relevant to your query');
      }

      // Feasibility bonus (0.2 weight)
      if (pilot.feasibility === 'solo-90-day') {
        score += 0.2;
        reasons.push('Can be built solo in 90 days');
      }

      // Low wheel risk bonus (0.2 weight)
      const riskScore = 0.2 * ((10 - pilot.wheelRisk) / 10);
      score += riskScore;
      if (pilot.wheelRisk <= 4) {
        reasons.push(`Low implementation risk (${pilot.wheelRisk}/10)`);
      }

      // Hybrid retrieval: simple cosine similarity over embeddings
      // (In real app, would use proper vector DB. Here we just add a small bonus.)
      if (pilot.emb && pilot.emb.length > 0) {
        // Fake embedding for query (just use average of pilot embeddings as proxy)
        const avgEmb = 0.5;
        const embSimilarity = pilot.emb.reduce((sum, val) => sum + val * avgEmb, 0) / pilot.emb.length;
        score += embSimilarity * 0.1; // small semantic bonus
      }

      return { pilot, score, reasons };
    })
    .filter(sp => sp.score > 0)
    .sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error scoring pilots:', error);
    return [];
  }
}

// Get all unique tags
export function getAllTags(): string[] {
  const pilots = getAllPilots();
  const tagSet = new Set<string>();
  pilots.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

// TODO: Real LLM/RAG integration would replace scorePilots with:
// - Embedding generation via OpenAI/Cohere
// - Vector DB (Pinecone, Weaviate, etc.) for similarity search
// - LLM call to generate personalized recommendations and reasons


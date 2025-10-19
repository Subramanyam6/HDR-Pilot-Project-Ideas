import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import pilotsData from '@/data/pilots.json';

// Types
interface Pilot {
  id: string;
  title: string;
  sector: string;
  tags: string[];
  painPoints: Array<{name: string; url: string}>;
  kpis: string[];
  competitors: Array<{name: string; url: string}>;
  overallPick: number;
  buildVsBuy: 'Build' | 'Buy';
  buyUrl: string;
  sources: string[];
}

interface PilotEmbedding {
  id: string;
  searchableText: string;
  embedding: number[];
}

interface SearchResult {
  id: string;
  score: number;
  reasons: string[];
}

// Helper: Cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Helper: Apply boosts to score
function applyBoosts(
  pilot: Pilot,
  baseScore: number,
  query: string
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let finalScore = baseScore;
  
  // Get config from env (with defaults)
  const tagBoost = parseFloat(process.env.RAG_TAG_BOOST || '0.2');
  const sectorBoost = parseFloat(process.env.RAG_SECTOR_BOOST || '0.2');
  const pickBoost = parseFloat(process.env.RAG_OVERALLPICK_BOOST || '0.4');
  
  const queryLower = query.toLowerCase();
  
  // Sector match boost
  if (queryLower.includes(pilot.sector.toLowerCase())) {
    finalScore += sectorBoost;
    reasons.push(`Matches ${pilot.sector} sector`);
  }
  
  // Tag match boost
  const matchingTags = pilot.tags.filter(tag => 
    queryLower.includes(tag.toLowerCase()) || tag.toLowerCase().includes(queryLower)
  );
  if (matchingTags.length > 0) {
    finalScore += tagBoost * Math.min(matchingTags.length, 3);
    reasons.push(`Relevant tags: ${matchingTags.slice(0, 3).join(', ')}`);
  }
  
  // Overall pick bonus (higher = better)
  const pickFactor = pilot.overallPick / 10;
  finalScore += pickFactor * pickBoost;
  if (pilot.overallPick >= 7) {
    reasons.push(`Highly recommended (${pilot.overallPick}/10 overall pick)`);
  }
  
  return { score: Math.min(finalScore, 1), reasons };
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Check if RAG is enabled
    const ragEnabled = process.env.RAG_ENABLED !== 'false';
    if (!ragEnabled) {
      return NextResponse.json(
        { error: 'RAG search is disabled', fallback: true },
        { status: 503 }
      );
    }
    
    // Check API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'placeholder' || apiKey === 'your_openai_api_key_here') {
      console.warn('⚠️ OpenAI API key not configured, using fallback');
      return NextResponse.json(
        { error: 'OpenAI API key not configured', fallback: true },
        { status: 503 }
      );
    }
    
    // Initialize OpenAI
    const openai = new OpenAI({ apiKey });
    const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
    
    // Generate query embedding
    const embeddingResponse = await openai.embeddings.create({
      model: embeddingModel,
      input: query,
      encoding_format: 'float'
    });
    
    const queryEmbedding = embeddingResponse.data[0].embedding;
    
    // Load pilot embeddings
    let embeddings: PilotEmbedding[];
    try {
      embeddings = require('@/data/pilots-embeddings.json');
    } catch (error) {
      console.error('❌ Error loading embeddings file:', error);
      return NextResponse.json(
        { error: 'Embeddings file not found. Please run: npm run generate-embeddings', fallback: true },
        { status: 503 }
      );
    }
    
    // Compute similarities and apply boosts
    const pilots = pilotsData as Pilot[];
    const topK = parseInt(process.env.RAG_TOP_K || '3');
    
    const results: SearchResult[] = embeddings.map(emb => {
      const pilot = pilots.find(p => p.id === emb.id);
      if (!pilot) return null;
      
      const baseSimilarity = cosineSimilarity(queryEmbedding, emb.embedding);
      const { score, reasons } = applyBoosts(pilot, baseSimilarity, query);
      
      return {
        id: pilot.id,
        score,
        reasons
      };
    })
    .filter((r): r is SearchResult => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
    
    return NextResponse.json({
      pilots: results,
      query,
      model: embeddingModel
    });
    
  } catch (error) {
    console.error('❌ Search API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Search failed',
        fallback: true
      },
      { status: 500 }
    );
  }
}


import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// This script generates embeddings for all pilots
// Run with: npx ts-node scripts/generate-embeddings.ts

interface Pilot {
  id: string;
  title: string;
  oneLiner: string;
  tags: string[];
  problem: string;
  approach: string;
  sector: string;
}

interface PilotEmbedding {
  id: string;
  searchableText: string;
  embedding: number[];
}

async function generateEmbeddings() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is not set');
    console.log('\nPlease set your OpenAI API key:');
    console.log('  export OPENAI_API_KEY=your_key_here');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  // Read pilots data
  const pilotsPath = path.join(process.cwd(), 'data', 'pilots.json');
  const pilots: Pilot[] = JSON.parse(fs.readFileSync(pilotsPath, 'utf-8'));

  console.log(`📚 Found ${pilots.length} pilots`);
  console.log('🔄 Generating embeddings...\n');

  const embeddings: PilotEmbedding[] = [];

  for (let i = 0; i < pilots.length; i++) {
    const pilot = pilots[i];
    
    // Create searchable text (title + oneLiner + tags + problem + approach)
    const searchableText = [
      pilot.title,
      pilot.oneLiner,
      pilot.tags.join(' '),
      pilot.problem,
      pilot.approach,
      `Sector: ${pilot.sector}`
    ].join(' ');

    try {
      console.log(`  [${i + 1}/${pilots.length}] ${pilot.title}...`);
      
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: searchableText,
        encoding_format: 'float'
      });

      embeddings.push({
        id: pilot.id,
        searchableText,
        embedding: response.data[0].embedding
      });

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Error generating embedding for ${pilot.id}:`, error);
      throw error;
    }
  }

  // Save embeddings to file
  const outputPath = path.join(process.cwd(), 'data', 'pilots-embeddings.json');
  fs.writeFileSync(outputPath, JSON.stringify(embeddings, null, 2));

  console.log('\n✅ Done!');
  console.log(`📁 Saved ${embeddings.length} embeddings to: ${outputPath}`);
  console.log(`📊 Embedding dimension: ${embeddings[0].embedding.length}`);
}

generateEmbeddings().catch(console.error);


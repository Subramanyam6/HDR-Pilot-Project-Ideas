import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import pilotsData from '@/data/pilots.json';

interface Pilot {
  id: string;
  title: string;
  oneLiner: string;
  sector: string;
  tags: string[];
  problem: string;
  approach: string;
  feasibility: string;
  wheelRisk: number;
}

interface AnswerRequest {
  query: string;
  pilotIds: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { query, pilotIds } = await request.json() as AnswerRequest;
    
    if (!query || !pilotIds || !Array.isArray(pilotIds) || pilotIds.length === 0) {
      return NextResponse.json(
        { error: 'Query and pilotIds are required' },
        { status: 400 }
      );
    }
    
    // Check if RAG is enabled
    const ragEnabled = process.env.RAG_ENABLED !== 'false';
    if (!ragEnabled) {
      return NextResponse.json(
        { error: 'RAG answer is disabled', fallback: true },
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
    
    // Get pilots data
    const pilots = pilotsData as Pilot[];
    const selectedPilots = pilots.filter(p => pilotIds.includes(p.id));
    
    if (selectedPilots.length === 0) {
      return NextResponse.json(
        { error: 'No matching pilots found' },
        { status: 404 }
      );
    }
    
    // Build context from top pilots
    const context = selectedPilots.map((pilot, idx) => `
Pilot ${idx + 1}: ${pilot.title}
ID: ${pilot.id}
Sector: ${pilot.sector}
Description: ${pilot.oneLiner}
Problem: ${pilot.problem}
Approach: ${pilot.approach}
Feasibility: ${pilot.feasibility}
Risk Level: ${pilot.wheelRisk}/10
Tags: ${pilot.tags.join(', ')}
`).join('\n---\n');
    
    // Initialize OpenAI
    const openai = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    
    // Create prompt
    const systemPrompt = `You are the Pilot Navigator assistant for HDR. You can use:
• RAG context: top-K pilot snippets (titles, one-liners, risks, plans).
• Your own pretrained knowledge for general questions.

INTENT DETECTION - Classify the query first:
- RECOMMEND: user explicitly asks for pilot recommendations, "which pilot", "suggest a project", "what fits"
- BUDGET: user asks about cost, funding, budget, pricing
- GENERAL: questions about companies, competitors, industry, technology, HDR itself, or any non-pilot topic
- CHITCHAT: greetings, thanks, hello

RESPONSE RULES BY INTENT:

1) RECOMMEND
  - Use ONLY the provided pilot context
  - Output 2–3 sentences citing pilot IDs like [pilot-id]
  - Explain WHY each pilot fits

2) BUDGET  
  - Use pilot fields (feasibility, wheelRisk) plus your knowledge of typical project costs
  - Output one line with a numeric range (e.g., "$45k–$60k")
  - Include up to 2 cited pilots [pilot-id] if relevant

3) GENERAL
  - FIRST: Answer the question using your own pretrained knowledge (1-2 sentences)
  - THEN: If the provided pilot context is relevant, add: "Related pilot: [pilot-id] - brief reason"
  - If no relevant pilot exists, just answer the question without mentioning pilots

4) CHITCHAT
  - Be brief and friendly

CRITICAL: For GENERAL questions, always answer using your knowledge FIRST, then optionally add a pilot if relevant.

FORMAT
- RECOMMEND/BUDGET: must include pilot IDs
- GENERAL: answer first, pilot optional
- CHITCHAT: no pilot IDs`;

    const userPrompt = `User Query: "${query}"

Available Pilot Context:
${context}

Follow the intent detection rules above and respond accordingly.`;
    
    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });
    
    const summary = completion.choices[0]?.message?.content || 'Unable to generate recommendation.';
    
    // Extract pilot IDs mentioned in the response (simple regex)
    const citationRegex = /\[([a-z0-9-]+)\]/g;
    const citations: string[] = [];
    let match;
    while ((match = citationRegex.exec(summary)) !== null) {
      if (!citations.includes(match[1])) {
        citations.push(match[1]);
      }
    }
    
    return NextResponse.json({
      summary,
      citations,
      pilots: pilotIds,
      model
    });
    
  } catch (error) {
    console.error('❌ Answer API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Answer generation failed',
        fallback: true
      },
      { status: 500 }
    );
  }
}


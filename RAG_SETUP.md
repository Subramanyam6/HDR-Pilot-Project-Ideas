# RAG Setup Guide

This guide explains how to set up and use the RAG (Retrieval-Augmented Generation) chat system for the Pilot Navigator.

## Quick Start

### 1. Set Up Environment Variables

Copy the example file and add your OpenAI API key:

```bash
# Create .env.local file
cp env.example .env.local

# Edit .env.local and add your key:
OPENAI_API_KEY=sk-your-actual-key-here
```

**Important**: Never commit `.env.local` to git. It's already in `.gitignore`.

### 2. Generate Embeddings

Run the embeddings generation script (one-time setup):

```bash
npx ts-node scripts/generate-embeddings.ts
```

This will:
- Read all 15 pilots from `data/pilots.json`
- Create searchable text for each pilot
- Generate embeddings using OpenAI's `text-embedding-3-small`
- Save to `data/pilots-embeddings.json` (commit this file)

**Cost**: ~$0.02 for 15 pilots (very cheap!)

### 3. Start Development Server

```bash
npm run dev
```

The RAG system will automatically activate if:
- ✅ `OPENAI_API_KEY` is set
- ✅ `data/pilots-embeddings.json` exists  
- ✅ `RAG_ENABLED` is not set to `false`

## How It Works

### Architecture

```
User Query → /api/search → OpenAI Embeddings → Cosine Similarity →
→ Apply Boosts → Top-K Pilots → /api/answer → GPT-4o-mini →
→ Summary + Citations → Frontend
```

### Search API (`/api/search`)

**Input**: `{ query: string }`

**Output**: 
```json
{
  "pilots": [
    { "id": "pilot-id", "score": 0.85, "reasons": ["Match reason"] }
  ],
  "query": "user query",
  "model": "text-embedding-3-small"
}
```

**Features**:
- Semantic search using embeddings
- Ranking boosts:
  - Sector match: +20%
  - Tag matches: +20% per tag (max 3)
  - Solo-90-day: +20%
  - Low risk: up to +20%

### Answer API (`/api/answer`)

**Input**: `{ query: string, pilotIds: string[] }`

**Output**:
```json
{
  "summary": "AI-generated recommendation",
  "citations": ["pilot-id-1", "pilot-id-2"],
  "pilots": ["pilot-id-1", "pilot-id-2", "pilot-id-3"],
  "model": "gpt-5"
}
```

**Features**:
- Contextual recommendations
- Cites specific pilots using `[pilot-id]` format
- Explains WHY each pilot fits

### Fallback Behavior

If RAG fails (no API key, embeddings missing, etc.), the system automatically falls back to keyword search using the existing `scorePilots` function.

## Configuration

All configuration is optional with sensible defaults:

```bash
# Model Selection (defaults shown)
OPENAI_MODEL=gpt-5
OPENAI_FALLBACK_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# RAG Settings
RAG_ENABLED=true
RAG_TOP_K=3

# Ranking Boosts (0.0 to 1.0)
RAG_TAG_BOOST=0.2
RAG_SECTOR_BOOST=0.2
RAG_FEASIBILITY_BOOST=0.2
RAG_WHEELRISK_PENALTY=0.2

# Logging & Rate Limiting
LOG_LEVEL=info
ENABLE_LOGS=false
RATE_LIMIT_RPM=30
```

## Testing

See `tests/rag-queries.test.md` for test queries and verification steps.

### Quick Test

1. Open the chat widget
2. Try: "I need a low-risk project for carbon tracking"
3. Verify:
   - ✅ Relevant pilots returned
   - ✅ Summary explains fit
   - ✅ Pilot IDs cited

## Cost Estimates

**Per Query**:
- Search (embedding): ~$0.0001
- Answer (GPT-4o-mini): ~$0.001
- **Total**: ~$0.0011 per query

**For 100 queries/day**:
- Daily: ~$0.11
- Monthly: ~$3.30

**Very affordable!** 🎉

## Deployment to Vercel

### 1. Add Environment Variables

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add `OPENAI_API_KEY` with your key
3. Add optional config variables if needed

### 2. Deploy

```bash
git add data/pilots-embeddings.json  # Commit embeddings
git commit -m "Add RAG embeddings"
git push origin main
```

Vercel will auto-deploy. The RAG system will work immediately!

### 3. Verify

- Check Preview deployment logs for any errors
- Test a query in the chat widget
- Verify fallback works (temporarily remove API key)

## Troubleshooting

### "Embeddings file not found"

Run: `npx ts-node scripts/generate-embeddings.ts`

### "OpenAI API key not configured"

Check `.env.local` has `OPENAI_API_KEY=sk-...`

### "Fallback to keyword search"

This is normal if:
- API key is missing/invalid
- Embeddings file doesn't exist
- RAG_ENABLED=false
- API rate limit hit

The app still works using keyword search!

### Build Errors

Make sure `data/pilots-embeddings.json` exists and is committed to git.

## Security

✅ **API keys are server-side only** (in `/api/` routes)  
✅ **No keys exposed to client**  
✅ **Vercel environment variables are encrypted**  
✅ **`.env.local` is gitignored**  

## Next Steps

1. ✅ Generate embeddings with real API key
2. ✅ Test with the 7 queries in `tests/rag-queries.test.md`
3. ✅ Deploy to Vercel
4. ✅ Monitor costs in OpenAI dashboard
5. ✅ Tune boosts if needed (adjust `RAG_*_BOOST` variables)

---

**Questions?** Check the code comments in:
- `app/api/search/route.ts`
- `app/api/answer/route.ts`  
- `components/chat/ChatProvider.tsx`

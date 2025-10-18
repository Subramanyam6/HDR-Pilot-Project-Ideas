# 🚀 RAG Quick Start

**3 Steps to Enable AI-Powered Search**

---

## Step 1: Add Your API Key (30 seconds)

```bash
# Create .env.local file
echo "OPENAI_API_KEY=sk-your-actual-key-here" > .env.local
```

💡 Get your key from: https://platform.openai.com/api-keys

---

## Step 2: Generate Embeddings (1 minute)

```bash
npm run generate-embeddings
```

**Cost**: ~$0.02 (one-time)

This creates `data/pilots-embeddings.json` with semantic search vectors.

---

## Step 3: Test It!

```bash
npm run dev
```

Open http://localhost:3000 and click the chat bubble (bottom-right).

Try: **"I need a low-risk project for water management"**

✅ Should return relevant pilots with AI explanation!

---

## Deploy to Vercel

```bash
git add data/pilots-embeddings.json
git commit -m "Add RAG embeddings"
git push origin main
```

**Don't forget**: Add `OPENAI_API_KEY` in Vercel dashboard → Settings → Environment Variables

---

## How It Works

1. User sends query → `/api/search`
2. OpenAI creates query embedding
3. Cosine similarity finds top-3 pilots
4. Boosts applied (sector, tags, feasibility, risk)
5. `/api/answer` generates AI summary
6. Chat shows results + recommendations

**Fallback**: If RAG fails → automatic keyword search (zero downtime!)

---

## Cost Per Query

- Embedding: $0.0001
- Answer (GPT-4o-mini): $0.001
- **Total**: ~$0.0011 per query

**100 queries/day** = ~$3.30/month 💰

---

## Configuration (Optional)

Edit `.env.local`:

```bash
# Use cheaper model
OPENAI_MODEL=gpt-4o-mini

# Adjust ranking boosts (0.0 to 1.0)
RAG_TAG_BOOST=0.3
RAG_SECTOR_BOOST=0.3

# Number of results
RAG_TOP_K=5

# Disable RAG (use keyword search)
RAG_ENABLED=false
```

---

## Testing

See `tests/rag-queries.test.md` for 7 test queries.

Quick tests:
- ✅ "drones" → drone-related pilots
- ✅ "leak detection" → water infrastructure
- ✅ "quick to build" → solo-90-day pilots

---

## Troubleshooting

**"Embeddings file not found"**
→ Run `npm run generate-embeddings`

**"API key not configured"**
→ Check `.env.local` has `OPENAI_API_KEY=sk-...`

**Chat not working?**
→ It falls back to keyword search automatically (check browser console)

---

## Need More Help?

- **Full Setup**: `RAG_SETUP.md`
- **Implementation Details**: `RAG_IMPLEMENTATION_SUMMARY.md`
- **Test Queries**: `tests/rag-queries.test.md`

---

**That's it!** Your RAG chat is ready. 🎉


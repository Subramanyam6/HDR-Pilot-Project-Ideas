# 🚀 Deployment Checklist

Use this checklist before deploying the RAG-enabled Pilot Navigator to production.

---

## ✅ Pre-Deployment (Local)

### 1. Environment Setup
- [ ] Create `.env.local` with `OPENAI_API_KEY`
- [ ] Verify `.env.local` is in `.gitignore` ✅ (already configured)
- [ ] Test API key works: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`

### 2. Generate Embeddings
- [ ] Run `npm run generate-embeddings`
- [ ] Verify `data/pilots-embeddings.json` exists
- [ ] Check file size (~100KB for 15 pilots with 1536-dim embeddings)
- [ ] Commit embeddings file: `git add data/pilots-embeddings.json`

### 3. Local Testing
- [ ] Run `npm run dev`
- [ ] Open chat widget (bottom-right bubble)
- [ ] Test query: "I need a low-risk water project"
- [ ] Verify AI response (not keyword fallback)
- [ ] Check browser console for errors
- [ ] Test all 7 queries from `tests/rag-queries.test.md`

### 4. Build Verification
- [ ] Run `npm run build`
- [ ] Verify build succeeds with no errors
- [ ] Check `/api/search` and `/api/answer` routes are listed
- [ ] Run `npm start` and test production build locally

---

## ✅ Vercel Deployment

### 1. Environment Variables
Navigate to Vercel Dashboard → Project → Settings → Environment Variables:

**Required**:
- [ ] `OPENAI_API_KEY` = `sk-...` (Production)
- [ ] `OPENAI_API_KEY` = `sk-...` (Preview)

**Optional** (use defaults if not set):
- [ ] `OPENAI_MODEL` = `gpt-4o-mini`
- [ ] `OPENAI_EMBEDDING_MODEL` = `text-embedding-3-small`
- [ ] `RAG_ENABLED` = `true`
- [ ] `RAG_TOP_K` = `3`
- [ ] `RAG_TAG_BOOST` = `0.2`
- [ ] `RAG_SECTOR_BOOST` = `0.2`
- [ ] `RAG_FEASIBILITY_BOOST` = `0.2`
- [ ] `RAG_WHEELRISK_PENALTY` = `0.2`

### 2. Deploy
```bash
git add data/pilots-embeddings.json
git commit -m "feat: Add RAG-powered chat with embeddings"
git push origin main
```

### 3. Verify Deployment
- [ ] Wait for Vercel build to complete
- [ ] Visit Preview URL
- [ ] Open chat widget
- [ ] Test query: "drones"
- [ ] Check Vercel logs for any errors
- [ ] Verify no "API key not configured" warnings

### 4. Production Testing
- [ ] Visit production URL
- [ ] Test chat widget on desktop
- [ ] Test chat widget on mobile
- [ ] Verify responsive layout works
- [ ] Check dark mode compatibility
- [ ] Test fallback (temporarily remove API key → should use keyword search)

---

## ✅ Post-Deployment

### 1. Monitoring
- [ ] Check OpenAI Dashboard → Usage
- [ ] Monitor costs (should be ~$0.001 per query)
- [ ] Set up usage alerts in OpenAI dashboard (e.g., $10/month limit)
- [ ] Review Vercel function logs for errors

### 2. Performance
- [ ] Test response time (<3s for search + answer)
- [ ] Check Vercel function duration (should be <2s)
- [ ] Verify no timeouts (Vercel default: 10s)

### 3. User Testing
- [ ] Share with 5-10 users
- [ ] Collect feedback on:
  - Relevance of recommendations
  - Quality of AI summaries
  - Response speed
  - UI/UX of chat widget
- [ ] Adjust boosts if needed (in `.env` variables)

### 4. Analytics (Optional)
- [ ] Track chat usage via existing `logChatMessage`
- [ ] Monitor most common queries
- [ ] Identify pilots never recommended (poor embeddings?)
- [ ] A/B test RAG vs keyword search

---

## ✅ Maintenance

### Adding New Pilots
When adding pilots to `data/pilots.json`:

1. [ ] Add pilot data to JSON
2. [ ] Run `npm run generate-embeddings` (regenerates all)
3. [ ] Commit updated `pilots-embeddings.json`
4. [ ] Deploy to Vercel

**Cost**: ~$0.02 per full regeneration

### Updating Embeddings
Regenerate if you:
- Change pilot titles, oneLiner, tags, problem, or approach
- Add/remove pilots
- Want to switch embedding models

### Tuning Ranking
Edit `.env.local` (or Vercel env vars):

```bash
# Increase sector boost (higher priority)
RAG_SECTOR_BOOST=0.3

# Decrease risk penalty (make risk less important)
RAG_WHEELRISK_PENALTY=0.1

# Return top 5 instead of top 3
RAG_TOP_K=5
```

Redeploy to apply changes.

---

## ✅ Troubleshooting

### "Embeddings file not found"
**Cause**: `data/pilots-embeddings.json` missing  
**Fix**: Run `npm run generate-embeddings`

### "OpenAI API key not configured"
**Cause**: Missing or invalid `OPENAI_API_KEY`  
**Fix**: Check Vercel env vars, restart dev server locally

### Slow Responses (>5s)
**Cause**: Large embeddings file or slow OpenAI API  
**Fix**: 
- Check OpenAI status page
- Reduce `RAG_TOP_K` to 3
- Consider caching (future enhancement)

### Incorrect Rankings
**Cause**: Boosts need tuning or embeddings outdated  
**Fix**:
- Review test queries in `tests/rag-queries.test.md`
- Adjust boost values in env vars
- Regenerate embeddings if pilot data changed

### High Costs
**Cause**: Too many queries or expensive model  
**Fix**:
- Set OpenAI usage limits ($10/month)
- Use `gpt-4o-mini` (cheaper than `gpt-4o`)
- Monitor usage in OpenAI dashboard

---

## ✅ Security

- [x] API keys server-side only ✅
- [x] No keys in client bundle ✅
- [x] `.env.local` gitignored ✅
- [x] Vercel env vars encrypted ✅
- [ ] Add rate limiting (future: per IP or user)
- [ ] Monitor for abuse (sudden spike in queries)
- [ ] Set OpenAI usage caps

---

## ✅ Rollback Plan

If RAG causes issues:

1. **Disable RAG** (keep keyword search):
   ```bash
   # In Vercel env vars
   RAG_ENABLED=false
   ```

2. **Remove API key** (forces fallback):
   - Delete `OPENAI_API_KEY` from Vercel
   - App still works with keyword search

3. **Revert commit**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

---

## 📊 Success Metrics

After 1 week:
- [ ] ≥80% of queries return relevant results
- [ ] Average response time <3s
- [ ] Costs <$5/week
- [ ] Zero API errors
- [ ] Positive user feedback

---

## 🎉 Launch Checklist Summary

Before announcing the feature:

- [x] ✅ All code committed
- [ ] ✅ Embeddings generated and committed
- [ ] ✅ Vercel env vars configured
- [ ] ✅ Deployed to production
- [ ] ✅ Tested on production URL
- [ ] ✅ Monitoring enabled
- [ ] ✅ Documentation complete
- [ ] ✅ Team trained on usage

**You're ready to launch!** 🚀


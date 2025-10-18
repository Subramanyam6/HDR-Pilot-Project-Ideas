# RAG Test Queries

This file contains test queries to verify the RAG system's ranking and summary quality.

## Test Queries

### 1. Drones
**Query**: "drones"
**Expected**: Should return drone-related pilots (e.g., traffic monitoring, infrastructure inspection)
**Success Criteria**:
- ✅ Relevant pilots ranked first
- ✅ Summary explains drone applications
- ✅ Proper pilot ID citations

### 2. Leak Detection
**Query**: "leak detection"
**Expected**: Should return water/infrastructure leak monitoring pilots
**Success Criteria**:
- ✅ Water sector pilots ranked highly
- ✅ Summary mentions leak detection benefits
- ✅ Tags like "leaks", "water", "sensors" boost ranking

### 3. Carbon Reporting
**Query**: "carbon reporting"
**Expected**: Should return environmental/carbon tracking pilots
**Success Criteria**:
- ✅ Environmental sector pilots prioritized
- ✅ Summary discusses carbon tracking/reporting
- ✅ Sustainability-related tags boost score

### 4. Traffic Optimization
**Query**: "traffic optimization"
**Expected**: Should return transportation/traffic management pilots
**Success Criteria**:
- ✅ Transportation sector gets boost
- ✅ Traffic-related tags increase ranking
- ✅ Summary explains traffic improvements

### 5. Low Risk Quick Win
**Query**: "I need a low-risk project I can build quickly"
**Expected**: Should prioritize solo-90-day feasibility and low wheelRisk
**Success Criteria**:
- ✅ Solo-90-day pilots ranked first
- ✅ Low risk (wheelRisk ≤ 4) pilots prioritized
- ✅ Summary emphasizes quick implementation

### 6. EV Charging
**Query**: "electric vehicle charging stations"
**Expected**: Should return EV infrastructure planning pilots
**Success Criteria**:
- ✅ EV-related pilots ranked first
- ✅ Transportation sector boost applied
- ✅ Summary discusses EV infrastructure

### 7. Water Management
**Query**: "water management and conservation"
**Expected**: Should return water sector pilots
**Success Criteria**:
- ✅ Water sector pilots prioritized
- ✅ Relevant tags (water, conservation, monitoring) boost score
- ✅ Summary covers water management benefits

## Verification Steps

1. **Run each query** through the chat interface
2. **Check ranking**: Top 3 pilots should be relevant
3. **Verify boosts**: 
   - Sector match adds ~0.2
   - Tag matches add ~0.2 per tag (max 3)
   - Solo-90-day adds ~0.2
   - Low risk adds up to ~0.2
4. **Review summary**: Should cite pilot IDs and explain relevance
5. **Test fallback**: Disable RAG (set `RAG_ENABLED=false`) and verify keyword search works

## Success Metrics

- **Relevance**: ≥80% of top-3 results should match query intent
- **Speed**: Response time <3s for search + answer
- **Citations**: All recommended pilots should be cited in summary
- **Fallback**: Keyword search should work when RAG fails
- **Stability**: Same query should return consistent top-3 (±1 position)

## Known Limitations

- Embeddings capture semantic meaning but may miss exact keyword matches
- Boosts are simple heuristics and may need tuning
- Small corpus (15 pilots) means limited testing scenarios
- Mock embeddings (if not generated) will not work for semantic search


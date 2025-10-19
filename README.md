# HDR Pilot Navigator

A Next.js application showcasing 15 pilot project ideas across Transportation, Water, Energy, Buildings, Environmental, and Internal sectors.

## Features

- **Landing Page**: Overview with top 3 featured pilots
- **Pilots List**: Browse all pilots with advanced filtering (sector, tags, search)
- **Pilot Detail**: Comprehensive view with problem, approach, KPIs, risks, and analysis
- **AI Chat Widget**: RAG-powered chatbot with semantic search and recommendations
- **Smart Search**: Cosine similarity with intelligent boosts
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Mobile-friendly with collapsible navigation
- **Zero Infrastructure Cost**: Embeddings loaded in-memory, no vector database needed

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- OpenAI API (embeddings, GPT-4o-mini)
- Tailwind CSS with CSS variables for theming
- Zod for schema validation
- shadcn/ui components
- RAG (Retrieval-Augmented Generation) implementation

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### AI Features (Optional)
To enable semantic search and AI recommendations:

1. Add OpenAI API key to `.env.local`
2. Run `npm run generate-embeddings` (one-time, ~$0.02)
3. Start development server

Without AI setup, the app uses keyword search. See `QUICK_START_RAG.md` for details.

### Build
```bash
npm run build
npm start
```

## Project Structure

```
app/
├── api/                 # RAG endpoints (search, answer)
├── layout.tsx          # Root layout with navigation
├── page.tsx            # Landing page
├── pilots/             # Pilot listing and detail pages
└── picker/             # AI chatbot interface

components/
├── ui/                 # Reusable UI components
├── layout/             # Sidebar, Topbar
├── pilots/             # Pilot cards, filters, metadata
├── picker/             # Chat components
├── chat/               # Chat state management
└── ChatWidget.tsx      # Floating chat bubble

lib/
├── pilots.ts           # Data types, filtering, scoring
├── chat-logger.ts      # Chat logging
└── utils.ts            # Utility functions

data/
├── pilots.json         # Pilot project data
└── pilots-embeddings.json  # Precomputed embeddings

scripts/
└── generate-embeddings.ts  # Embedding generation script
```

## Data Model

Each pilot includes:
- Basic info: id, title, description, sector, tags
- Technical details: stack, KPIs, pain points
- Implementation: problem, approach, risks, buy-vs-build analysis
- Timeline: 1-week and 90-day plans
- Competitors and sources with hyperlinks

## Key Components

### Layout
- `Sidebar`: Desktop navigation with mobile sheet overlay
- `Topbar`: Search, theme toggle, mobile menu

### Pilots
- `PilotCard`: Grid card with pilot overview
- `Filters`: Multi-select filters and search
- `Metadata`: Detailed pilot information sidebar

### AI Chat
- `ChatWidget`: Floating chat interface
- `ChatProvider`: State management with RAG integration
- `RecommendationList`: AI-suggested pilots with scores

## Filtering & AI

### Filters
- **Sectors**: Multi-select (Transportation, Water, Energy, etc.)
- **Tags**: Keyword-based filtering
- **Search**: Text search across titles and descriptions

### AI Scoring
Deterministic scoring with semantic bonuses:
```
score = tag matches + sector alignment + risk factors + semantic similarity
```

### RAG System
- Semantic search using OpenAI embeddings
- Cosine similarity ranking
- Intelligent boosts for relevance
- GPT-4o-mini for natural language responses
- Graceful fallback to keyword search

Cost: ~$0.001 per query ($3/month for 100 queries/day)

## Production TODOs

### Enhancements
- [ ] Streaming responses for better UX
- [ ] Rate limiting and usage tracking
- [ ] PDF export for pilot briefs
- [ ] Analytics and user feedback

### Accessibility
- [ ] Keyboard navigation testing
- [ ] Screen reader compatibility

## License

Proprietary (HDR internal use)

---

**Built with ❤️ by Bala Subramanyam**

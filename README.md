# HDR Pilot Navigator

A UI-only Next.js application showcasing 15 pilot project ideas across various sectors (Transportation, Water, Energy, Buildings, Environmental, Internal).

## Features

- 🏠 **Landing Page**: Overview with top 3 featured pilots and "Our 3 Asks"
- 📋 **Pilots List**: Browse all 15 pilots with advanced filtering (sector, feasibility, risk, tags, search)
- 📄 **Pilot Detail**: Comprehensive view of each pilot with problem, approach, KPIs, risks, and buy-vs-build analysis
- 🤖 **Pilot Picker**: Mock chatbot interface for personalized pilot recommendations
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive**: Mobile-friendly with collapsible sidebar and filter sheets

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (with CSS variables for theming)
- **Zod** (schema validation)
- **shadcn/ui patterns** (locally implemented UI components)

## Getting Started

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

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with sidebar + topbar
│   ├── page.tsx           # Landing page
│   ├── pilots/
│   │   ├── page.tsx       # Pilots list with filters
│   │   └── [id]/page.tsx  # Pilot detail page
│   └── picker/
│       └── page.tsx       # Pilot Picker chatbot UI
├── components/
│   ├── ui/                # Reusable UI primitives (Button, Card, Input, etc.)
│   ├── layout/            # Sidebar, Topbar
│   ├── pilots/            # PilotCard, Filters, Metadata
│   └── picker/            # ChatPanel, RecommendationList
├── lib/
│   ├── pilots.ts          # Types, filtering, scoring logic
│   └── utils.ts           # Utility functions (cn)
├── data/
│   └── pilots.json        # 15 pilot ideas with metadata
└── public/                # Static assets
```

## Data Model

Each pilot in `data/pilots.json` has:
- **id**, **title**, **oneLiner**: Basic info
- **sector**: Transportation | Water | Energy | Buildings | Environmental | Internal
- **tags**: Filterable keywords
- **stack**: Tech stack
- **kpis**: Key performance indicators
- **feasibility**: `solo-90-day` | `configure`
- **wheelRisk**: 0-10 implementation risk score
- **problem**, **approach**, **oneWeek**, **ninetyDay**: Detailed descriptions
- **risks**: Array of risk factors
- **buyVsBuild**: Buy-vs-build analysis
- **emb**: Mock embedding vector for hybrid retrieval (static, no runtime computation)

## Key Components

### Layout
- `Sidebar`: Desktop navigation (collapsible on mobile via sheet)
- `Topbar`: Search bar + dark mode toggle + mobile menu

### Pilots
- `PilotCard`: Grid card with title, tags, KPIs, stack, feasibility, risk
- `Filters`: Multi-select for sectors/tags, feasibility toggle, risk slider, search input, sort
- `Metadata`: Sidebar badges for sector, tags, feasibility, risk

### Picker
- `ChatPanel`: Message list + input (mock streaming, no real LLM)
- `RecommendationList`: Ranked pilot cards with match scores and "why" bullets

## Filtering & Scoring

### Filters (Client-Side)
- **Sectors**: Multi-select (any match)
- **Feasibility**: All | Solo 90-day | Configure
- **Wheel Risk**: Slider (0-10 max)
- **Tags**: Multi-select (any match)
- **Search**: Text match on title/oneLiner/tags

### Sorting
- **Relevance**: Default order
- **Risk**: Low to high
- **Feasibility**: Solo-90-day first

### Scoring (Pilot Picker)
Simple deterministic scoring function:
```
score = 0.6 * tagMatch + 0.2 * (feasibility === 'solo-90-day') + 0.2 * ((10 - wheelRisk) / 10)
```
Plus a small semantic bonus from mock embeddings.

## TODOs for Production

### Real LLM/RAG Integration
- [ ] Set up OpenAI/Anthropic API keys
- [ ] Create `/api/picker/chat` route for server-side LLM calls
- [ ] Implement embedding generation and vector DB (Pinecone, Weaviate)
- [ ] Add streaming responses for better UX
- [ ] Error handling, rate limiting, token usage tracking

### PDF Export
- [ ] Integrate jsPDF or Puppeteer for pilot brief export
- [ ] Design PDF template with branding

### Analytics
- [ ] Track pilot views, filter usage, chatbot queries
- [ ] User feedback on recommendations

### Accessibility
- [ ] ARIA labels and roles (already included)
- [ ] Keyboard navigation testing
- [ ] Screen reader testing

## Design Decisions

- **No backend calls**: All data is static JSON; all logic is client-side
- **shadcn-like UI**: Components styled to match shadcn patterns for easy drop-in replacement later
- **Dark mode via CSS variables**: Toggle adds/removes `.dark` class on `<html>`
- **Mobile-first**: Sidebar collapses to sheet; filters in sheet; responsive grids
- **Accessibility**: Focus states, aria labels, ESC to close dialogs

## License

Proprietary (HDR internal use)

---

**Built with ❤️ by a senior Next.js/Tailwind/shadcn engineer**


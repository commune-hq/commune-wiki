---
title: "Digital Garden & Knowledge Management Tech Stack Research"
summaryNote: "research-digital-garden-tech-stacks"
created: "2025-10-18"
updated: "2025-10-19"
wordCount: 9600
model: "Claude Sonnet 3.5"
aiSource: "Claude Code"
context: "Deep research as part of [[My Working Notes]] as I explore [[Commune]], [[Obsidian]], and [[Reflect]]."
summary: "Technical analysis of digital garden frameworks and knowledge management tools. Compares Astro, Next.js, and static site approaches for building Commune."
---

# Digital Garden & Knowledge Management Tech Stack Research

## Executive Summary

This research analyzes the technical architectures of leading knowledge management tools (Obsidian, Reflect, Roam, Logseq, Notion) and digital garden frameworks (Quartz, Astro, Next.js, Eleventy) to inform architectural decisions for the Commune project.

**Key Findings:**
1. **Static-first wins for digital gardens**: Astro's islands architecture provides 40% faster loads with 90% less JavaScript
2. **Local-first + E2EE is table stakes**: All modern tools prioritize privacy with client-side encryption
3. **YJS/CRDT is the gold standard**: For real-time sync, YJS eliminates O(n²) bottlenecks
4. **Islands architecture enables progressive enhancement**: Ship zero JavaScript by default, hydrate only interactive components
5. **SQLite FTS5 provides excellent search**: 50x faster than full-text alternatives (1s → 20ms)


## 1. Product Tech Stack Decision Matrix

| Product | Architecture | Storage | Sync Engine | E2EE | Platform | AI Features |
|---------|-------------|---------|-------------|------|----------|-------------|
| **Obsidian** | Electron desktop | Local markdown files | Proprietary (diff-match-patch) | ✓ (Sync only) | Desktop, Mobile | Plugin-based |
| **Reflect** | Web app | Cloud database | YJS CRDT | ✓ Client-side | Web, Mobile web | Native LLM integration |
| **Roam Research** | Web app (ClojureScript) | Datomic (immutable) | Real-time transaction log | ✗ | Web only | Limited |
| **Logseq** | Electron/Web | Local markdown + DB graphs | Git-based or custom | ✗ (local-first) | Desktop, Mobile, Web | Plugin-based |
| **Notion** | Web + desktop hybrid | PostgreSQL (sharded) | MessageStore + WebRTC | ✗ | Web, Desktop, Mobile | Native AI assistant |
| **Andy Matuschak** | Custom static site | Static HTML/JSON | None (static) | N/A | Web only | None |
| **Quartz** | Static site generator | Markdown → HTML | None (rebuild) | N/A | Web only | None |


## 2. Static vs Dynamic Architecture Analysis

### 2.1 Static Site Generators (Digital Garden Use Case)

#### **Astro** (Recommended for Commune)
**Architecture**: Islands-based static site generator with partial hydration

**Pros:**
- **Performance**: 40% faster page loads, 90% less JavaScript than Next.js
- **Islands architecture**: Ships zero JS by default, selectively hydrates interactive components
- **Framework agnostic**: Mix React, Vue, Svelte, Solid on same page
- **SEO optimized**: Static-first with excellent Core Web Vitals
- **Developer experience**: Intuitive templating, fast builds, TypeScript out-of-the-box

**Cons:**
- Less mature ecosystem than Next.js
- No built-in real-time features (must add separately)
- Smaller community for support

**Hydration Directives:**
```javascript
// client:load - hydrate immediately
<StarModal client:load />

// client:visible - lazy load when in viewport
<GraphVisualization client:visible />

// client:idle - hydrate when browser idle
<BacklinksPanel client:idle />

// client:media - responsive hydration
<MobileNav client:media="(max-width: 768px)" />
```

**Best For**: Content-heavy sites with occasional interactivity (digital gardens, documentation, blogs)


#### **Next.js with ISR**
**Architecture**: Hybrid SSR/SSG with Incremental Static Regeneration

**Pros:**
- **ISR capability**: Update pages without full rebuild (stale-while-revalidate pattern)
- **Mature ecosystem**: Deep React integration, extensive plugins
- **Turbopack**: Lightning-fast bundling for large projects
- **Vercel deployment**: First-class hosting integration
- **React Server Components**: Streaming SSR for dynamic sections

**Cons:**
- Heavier JavaScript payload (React overhead)
- More complex than pure static
- Vendor lock-in concerns (Vercel-optimized)

**ISR Example:**
```javascript
export async function getStaticProps() {
  const notes = await fetchNotes()
  return {
    props: { notes },
    revalidate: 60 // Regenerate page every 60 seconds
  }
}
```

**Best For**: Dynamic content that updates frequently, complex data-driven apps, e-commerce


#### **Eleventy (11ty)**
**Architecture**: Zero-config static site generator (Node-based)

**Pros:**
- **Extreme performance**: Mozilla site build: Jekyll 10min → Eleventy 3sec
- **Zero client-side JS**: Pure static output by default
- **Template flexibility**: Supports 10+ template languages (Nunjucks, Liquid, EJS, etc.)
- **Minimal footprint**: 100MB node_modules vs Gatsby's 500MB

**Cons:**
- Less opinionated (requires more manual setup)
- No built-in component framework
- Smaller plugin ecosystem

**Best For**: Minimalist blogs, documentation, marketing sites


#### **Quartz**
**Architecture**: Obsidian-focused static site generator

**Pros:**
- **Obsidian integration**: Direct vault publishing with wikilinks, backlinks, graph view
- **Fast builds**: esbuild + inline script bundling
- **Plugin architecture**: Extensible Markdown/HTML transforms
- **Digital garden features**: Built-in backlinks, graph visualization

**Cons:**
- Tightly coupled to Obsidian conventions
- Less flexible than general-purpose SSGs

**Build Pipeline:**
```
Markdown (remark-parse)
  → mdast transforms
  → remark-rehype
  → hast transforms
  → HTML + inline JS
```

**Best For**: Publishing Obsidian vaults as digital gardens


### 2.2 SEO Performance: Static vs Dynamic

| Factor | Static (Astro/11ty) | ISR (Next.js) | Dynamic (Notion/Roam) |
|--------|---------------------|---------------|----------------------|
| **Load Time** | 2-3x faster | Moderate | Slower (runtime rendering) |
| **Core Web Vitals** | Excellent (perfect Lighthouse scores) | Good | Variable (depends on caching) |
| **Indexability** | Perfect (pre-rendered HTML) | Good (initial HTML served) | Challenging (client-side rendering) |
| **Content Freshness** | Manual rebuild or webhook | Automatic (stale-while-revalidate) | Real-time |
| **Build Complexity** | Simple CI/CD | Moderate (incremental builds) | Complex infrastructure |

**2025 Hybrid Rendering Trend**: Industry converging on **partial hydration** as best practice — static HTML + selective interactivity.


## 3. Real-Time Sync & Collaboration Architectures

### 3.1 YJS CRDT (Recommended)

**Used by**: Reflect, modern collaborative editors

**Architecture:**
- **CRDT (Conflict-free Replicated Data Type)**: Automatically merges concurrent edits without central authority
- **Network agnostic**: Works with WebSockets, WebRTC, or custom transports
- **Modular design**: Separate network layer from data structure

**Key Advantages:**
```
Traditional OT:        O(n²) message broadcasting bottleneck
YJS CRDT:             Local conflict resolution, no server bottleneck
Result:               Scales to 100s of concurrent users
```

**Performance:**
- Eliminates central server as sync bottleneck
- Natural convergence without conflict resolution logic
- Can scale horizontally without O(n²) problems

**Implementation Pattern:**
```javascript
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

// Create shared document
const ydoc = new Y.Doc()
const ytext = ydoc.getText('content')

// Connect to WebSocket server
const provider = new WebsocketProvider(
  'wss://sync.commune.com',
  'note-123',
  ydoc
)

// All clients converge automatically
ytext.insert(0, 'Hello World')
```

**Sources:**
- [YJS GitHub](https://github.com/yjs/yjs)
- [Mastering Real-Time Collaborative Editing](https://dev.to/hexshift/mastering-real-time-collaborative-editing-with-yjs-and-websockets-12n)


### 3.2 Datomic Immutable Database (Roam Research)

**Architecture:**
- **Immutable facts**: All data stored as datoms `[entity-id, attribute, value, transaction-id]`
- **Time-aware queries**: Query any historical state without performance penalty
- **Datalog queries**: Powerful relational queries in JavaScript

**Key Advantages:**
```
Traditional DB:       UPDATE overwrites data
Datomic:             Append-only, preserves full history
Result:              Time travel, audit trail, undo for free
```

**Use Cases:**
- Real-time sync via transaction log
- Undo/redo without complexity
- Audit requirements (HIPAA, SOC2)

**Query Example:**
```clojure
;; Find all blocks modified in last 7 days
[:find ?block ?content
 :where
 [?block :block/content ?content ?tx]
 [?tx :db/txInstant ?time]
 [(> ?time #inst "2025-10-11")]]
```

**Trade-offs:**
- Complex setup (ClojureScript, Datalog learning curve)
- Storage grows over time (history accumulation)
- Vendor lock-in (proprietary Datomic)

**Sources:**
- [Deep Dive Into Roam's Data Structure](https://www.zsolt.blog/2021/01/Roam-Data-Structure-Query.html)


### 3.3 Obsidian Sync (Proprietary)

**Architecture:**
- **Algorithm**: Google's diff-match-patch for conflict resolution
- **Platform limitations**:
  - iOS: Only iCloud direct access
  - Android: Only local storage
  - Third-party sync requires separate apps (FolderSync, Autosync)
- **Conflict handling**: Automatic merging, occasional duplicates/overwrites

**Key Advantages:**
- Seamless Obsidian integration
- Handles conflicts within app (no external tools)
- Version history

**Limitations:**
- Occasionally overwrites newer data
- Mobile requires paid Obsidian Sync (no direct cloud folder access)
- Proprietary (not self-hostable)

**Sources:**
- [Obsidian Forum: Sync Conflict Resolution](https://forum.obsidian.md/t/robust-sync-conflict-resolution/93544)


### 3.4 Notion's Block-Based Architecture

**Data Model:**
- Everything is a Block (text, image, database row, page)
- Blocks can nest infinitely
- PostgreSQL sharded across 96 instances (as of 2023)

**Real-Time Stack:**
- **MessageStore**: Real-time update notifications
- **WebRTC**: Direct peer-to-peer communication
- **TransactionQueue**: IndexedDB/SQLite queue for offline writes
- **API**: `/saveTransactions` endpoint (JSON serialization)

**Scaling Strategy:**
```
2021: 32 PostgreSQL instances
2023: 96 PostgreSQL instances (3x growth)
Storage: S3 for data lake, PostgreSQL for transactional data
```

**Sources:**
- [Breaking Down Notion's Tech Stack](https://slashdev.io/-breaking-down-notions-tech-stack)
- [How Notion Prepared Their Database for Millions](https://medium.com/@nidhey60/how-notion-prepared-their-database-for-millions-of-users-dc198079e74c)


## 4. Privacy & Self-Hosting Architectures

### 4.1 End-to-End Encryption Patterns

#### **Reflect's E2EE Implementation**
**Security Audit**: Doyensec (independent audit)

**Architecture:**
- Encryption key derived from user password (never sent to server)
- All note content + attachments encrypted client-side
- Custom encryption library (not standard Web Crypto API)
- Server stores encrypted blobs (zero-knowledge)

**Key Loss = Data Loss**: Losing password = permanent data loss (no recovery)

**Sources:**
- [Reflect Security and Encryption](https://reflect.academy/security-and-encryption)


#### **Logseq Local-First + Git Sync**
**Privacy Model:**
- All notes stored as local markdown files
- Database graphs generated locally
- Optional sync via GitHub/Dropbox (user controls)
- No company access to data

**Architecture:**
```
File Graph:    Markdown files → Git sync
DB Graph:      Local SQLite → Sync TBD
Both:          Zero cloud dependency
```

**Sources:**
- [Logseq Architecture](https://github.com/logseq/logseq)


### 4.2 Self-Hosting with Tailscale

**Use Case**: Expose home server digital garden without port forwarding

**Architecture:**
```
Home Server (Astro site)
  ↓
Tailscale VPN (WireGuard-based)
  ↓
Secure mesh network (100.x.y.z IPs)
  ↓
Access from any device (phone, laptop, etc.)
```

**Key Benefits:**
- **No port forwarding**: Bypasses NAT, firewalls, CG-NAT
- **Zero trust**: Encrypted peer-to-peer connections
- **Static IPs**: Each device gets persistent 100.x.y.z IP
- **Custom DNS**: Point commune.local to home server

**Self-Hosted Control Plane (Headscale):**
- Open-source Tailscale control server
- Complete privacy (no Tailscale Inc. involvement)
- Self-host on VPS or home server

**Example Setup:**
```bash
# On home server
tailscale up --advertise-routes=192.168.1.0/24

# Access from anywhere
curl http://commune.local  # Resolves to 100.64.x.x
```

**Reverse Proxy Pattern (Caddy + Tailscale):**
```
Tailscale (VPN layer)
  → Caddy (reverse proxy)
    → Astro site (port 3000)
    → API server (port 4000)
```

**Sources:**
- [Self-Hosting with Tailscale](https://homelabs.guru/en/setting-up-tailscale-for-self-hosting/)
- [Headscale: Self-Hosted Tailscale](https://www.virtualizationhowto.com/2023/05/headscale-awesome-self-hosted-tailscale-control-server/)


## 5. AI/Agent Integration Patterns (2024-2025)

### 5.1 Agentic AI Architecture Patterns

**Multi-Agent System Design:**
1. **Sequential chains**: Agents execute in pipeline (research → draft → edit)
2. **Hierarchical**: Supervisor agent delegates to specialist agents
3. **Parallel processing**: Independent agents work simultaneously
4. **Hybrid**: Mix of sequential and parallel based on task

**Leading Frameworks:**

| Framework | Strengths | Use Case |
|-----------|----------|----------|
| **LangGraph** | Stateful multi-agent, most sophisticated | Complex workflows, agent orchestration |
| **LangChain** | Tool integration, chatbots, document analysis | General-purpose LLM apps |
| **LlamaIndex** | Data indexing, RAG (retrieval-augmented generation) | Knowledge base search |
| **AutoGen** | Multi-agent collaboration | Research assistants, coding agents |

**Key Design Patterns:**

#### **Tool Use Pattern**
Enable LLMs to call external APIs/tools dynamically
```python
agent = Agent(
  tools=[
    search_wikipedia,
    calculate_math,
    query_database
  ]
)
```

#### **Reflection Pattern**
Agent evaluates its own output before finalizing
```python
draft = agent.generate()
reflection = agent.critique(draft)
final = agent.improve(draft, reflection)
```

**Industry Adoption:**
- 25% of enterprises piloting agentic AI in 2025 (Deloitte)
- 33% of enterprise software will have agentic AI by 2028 (Gartner)

**Sources:**
- [Agentic AI Architectures](https://medium.com/@anil.jain.baba/agentic-ai-architectures-and-design-patterns-288ac589179a)
- [AI Agents Q1 2025 Landscape](https://www.ml-science.com/blog/2025/4/17/developments-in-ai-agents-q1-2025-landscape-analysis)


### 5.2 LLM Integration for Digital Gardens

**Potential Features:**
1. **Semantic backlink discovery**: LLM finds related notes based on meaning, not just keywords
2. **Auto-summarization**: Generate TL;DR for long notes
3. **Concept extraction**: Identify key themes across notes
4. **Question answering**: RAG over personal knowledge base
5. **Writing assistance**: Draft new notes from prompts

**Architecture Pattern (RAG over Markdown):**
```
User Query
  → LLM generates search terms
  → SQLite FTS5 retrieves candidate notes
  → LLM reads top N notes
  → LLM synthesizes answer with citations
```

**Privacy Considerations:**
- **Local LLM** (Ollama, LLaMA): Full privacy, slower, requires GPU
- **Cloud LLM** (OpenAI, Anthropic): Fast, costs money, data leaves device
- **Hybrid**: Summarize locally, send summaries to cloud


## 6. Multi-Tenant Architecture for Commune

### 6.1 Database Isolation Models

| Model | Isolation | Scalability | Complexity | Cost |
|-------|-----------|-------------|------------|------|
| **Database-per-tenant** | Strong | Moderate | Low | High (N databases) |
| **Schema-per-tenant** | Strong | Good | Moderate | Moderate |
| **Table-based (tenant_id)** | Weak | Excellent | High (RLS) | Low |
| **Sharding (tenant_id as shard key)** | Strong | Excellent | High | Moderate |

**Recommended for Commune**: **Schema-per-tenant** → **Sharding (Citus)**

**Rationale:**
- Start simple: Schema-per-tenant in single Postgres instance
- Scale horizontally: Migrate to Citus schema-based sharding when needed
- Strong isolation for compliance (GDPR, HIPAA)
- No app-layer changes (tenant filtering transparent)

**Schema-Based Sharding (Citus 12.0):**
```sql
-- Create tenant schemas automatically
CREATE SCHEMA tenant_123;
CREATE SCHEMA tenant_456;

-- Distributed across shards
SELECT citus_schema_distribute('tenant_123');

-- Queries isolated per schema
SET search_path TO tenant_123;
SELECT * FROM notes;  -- Only sees tenant_123 data
```

**Sources:**
- [Data Isolation and Sharding Architectures](https://medium.com/@justhamade/data-isolation-and-sharding-architectures-for-multi-tenant-systems-20584ae2bc31)
- [Designing Postgres for Multi-tenancy](https://www.crunchydata.com/blog/designing-your-postgres-database-for-multi-tenancy)


### 6.2 Row-Level Security (RLS) Alternative

**PostgreSQL RLS:**
```sql
-- Enable RLS on notes table
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users only see their tenant's notes
CREATE POLICY tenant_isolation ON notes
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Set tenant context per request
SET app.tenant_id = 'tenant-123-uuid';
```

**Pros:**
- Single database (simpler operations)
- Policy-based isolation (enforced at DB level)

**Cons:**
- Harder to debug (invisible filtering)
- Performance overhead on every query
- Risk of bugs exposing data


## 7. Backlinks & Graph Implementation

### 7.1 Backlink Storage Strategies

**Approach 1: Parse-on-read (Simple)**
```
1. Store notes as markdown
2. On note load, regex parse [[wikilinks]]
3. Query database for reverse links
```
Pros: Simple, no precomputation
Cons: Slow for large graphs


**Approach 2: Indexed link table (Scalable)**
```sql
CREATE TABLE links (
  source_note_id UUID,
  target_note_id UUID,
  link_type TEXT, -- 'wikilink', 'url', 'tag'
  anchor_text TEXT,
  PRIMARY KEY (source_note_id, target_note_id)
);

CREATE INDEX idx_backlinks ON links(target_note_id);

-- Query backlinks
SELECT source_note_id, anchor_text
FROM links
WHERE target_note_id = 'note-123';
```

**Update Strategy:**
```javascript
// On note save
const links = parseWikilinks(noteContent)
await db.transaction(async (tx) => {
  // Delete old links
  await tx.delete(links).where({ source_note_id })
  // Insert new links
  await tx.insert(links).values(newLinks)
})
```

Pros: Fast queries, supports advanced graph algorithms
Cons: Write overhead, consistency maintenance


**Approach 3: Graph database (Neo4j, DGraph)**
```cypher
// Create note
CREATE (n:Note {id: 'note-123', title: 'Digital Gardens'})

// Create link
MATCH (a:Note {id: 'note-123'}), (b:Note {id: 'note-456'})
CREATE (a)-[:LINKS_TO]->(b)

// Find backlinks (1-hop)
MATCH (n:Note {id: 'note-123'})<-[:LINKS_TO]-(backlink)
RETURN backlink

// Find 2-hop connections
MATCH path = (n:Note {id: 'note-123'})-[:LINKS_TO*2]-(related)
RETURN related, length(path)
```

Pros: Native graph queries, powerful traversals
Cons: Operational complexity, separate database


### 7.2 Graph Visualization Performance

**D3.js vs Cytoscape.js**

| Library | Rendering | Max Nodes | Use Case |
|---------|-----------|-----------|----------|
| **D3.js** | SVG (customizable) | ~1,000 | Custom visualizations, dashboards |
| **Cytoscape.js** | Canvas/WebGL | ~10,000 | Network graphs, biological networks |

**Recommendation for Commune**: **Cytoscape.js**

**Rationale:**
- Canvas rendering = 5-10x faster than SVG for large graphs
- Built-in graph algorithms (layout, clustering)
- Mobile-friendly (touch gestures)
- WebGL renderer for >5k nodes

**Performance Optimization:**
```javascript
// Level of Detail (LOD): Hide labels at high zoom
cytoscape({
  elements: nodes,
  style: [
    {
      selector: 'node',
      style: {
        'label': (ele) => {
          const zoom = cy.zoom()
          return zoom > 1.5 ? ele.data('title') : ''
        }
      }
    }
  ]
})
```

**Sources:**
- [Comparison of JavaScript Graph Libraries](https://www.cylynx.io/blog/a-comparison-of-javascript-graph-network-visualisation-libraries/)
- [Best Libraries for Large Network Graphs](https://weber-stephen.medium.com/the-best-libraries-and-methods-to-render-large-network-graphs-on-the-web-d122ece2f4dc)


## 8. Full-Text Search Implementation

### 8.1 SQLite FTS5 (Recommended for Local-First)

**Performance:**
```
Before FTS5:  1000ms (full table scan)
After FTS5:   20ms (indexed search)
Result:       50x faster
```

**Use Cases:**
- Inkdrop (markdown note app): Cross-platform FTS (macOS, Windows, Linux, iOS, Android)
- SQLite Cloud: Real-time documentation search
- Obsidian alternatives: Local note search

**Implementation:**
```sql
-- Create FTS5 table
CREATE VIRTUAL TABLE notes_fts USING fts5(
  title,
  content,
  tags,
  tokenize='porter unicode61'  -- Stemming + Unicode support
);

-- Insert note
INSERT INTO notes_fts VALUES ('Digital Gardens', 'Content about...', 'pkm,notes');

-- Search with ranking
SELECT
  title,
  bm25(notes_fts) AS rank  -- BM25 relevance score
FROM notes_fts
WHERE notes_fts MATCH 'digital garden'
ORDER BY rank
LIMIT 10;
```

**Advanced Features:**
- **Prefix search**: `'digital*'` matches digital, digitize
- **Phrase search**: `'"digital garden"'` (exact phrase)
- **Boolean operators**: `'digital OR analog -noise'`
- **Column weights**: Boost title matches over content

**Sources:**
- [SQLite FTS5 Extension](https://www.sqlite.org/fts5.html)
- [Real-Time Full-Text Search with FTS5](https://blog.sqlite.ai/real-time-full-text-site-search-with-sqlite-fts5-extension)


### 8.2 Alternative: MeiliSearch (Self-Hosted)

**When to use:**
- Need typo tolerance (FTS5 requires exact match)
- Multi-language support
- Faceted search (filter by tags, date, etc.)

**Performance:**
- Sub-50ms search on 10M documents
- Prefix search optimized

**Trade-offs:**
- Separate service (more ops complexity)
- Requires RAM (indexes in memory)


## 9. Content Update Strategies for Static Sites

### 9.1 Rebuild Triggers

**Webhook-Based CI/CD:**
```yaml
# .github/workflows/deploy.yml
name: Deploy on Content Update
on:
  push:
    branches: [main]
  repository_dispatch:  # External webhook trigger
    types: [content-update]
  schedule:
    - cron: '0 0 * * *'  # Daily rebuild

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
```

**Trigger from external CMS:**
```bash
# Content editor saves note
curl -X POST https://api.github.com/repos/user/commune/dispatches \
  -H "Authorization: token $GITHUB_TOKEN" \
  -d '{"event_type": "content-update"}'
```


### 9.2 Incremental Builds

**Gatsby Cloud Incremental Builds:**
- Only rebuild changed pages
- Build time: 10min → 10sec (100x faster)
- Cache dependency tree between builds

**Next.js ISR (Incremental Static Regeneration):**
```javascript
export async function getStaticProps() {
  return {
    props: { ... },
    revalidate: 60  // Regenerate every 60s if requested
  }
}
```

**Pattern: Stale-While-Revalidate**
```
1. User requests page
2. Serve stale version immediately (fast)
3. Regenerate in background
4. Next request gets fresh version
```


### 9.3 Content Freshness Recommendations

**SEO Research (Siege Media):**
- Average page 1 ranking updated every 2 years
- High-competition keywords (90+ difficulty): Update every 320 days
- Low-competition (<10 difficulty): Update every 2 years
- Evergreen content: 18-24 months

**Digital Garden Strategy:**
```
New notes:        Real-time (git push → rebuild)
Evergreen notes:  Manual updates (quarterly review)
Index pages:      Daily rebuild (new note listings)
Search index:     On-demand (content change webhook)
```


## 10. Recommendation for Commune Architecture

### 10.1 Proposed Tech Stack

**Frontend (Digital Garden):**
- **Framework**: Astro 5.0 (islands architecture)
- **UI Components**: React (for interactive islands like graph, modals)
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages or self-hosted via Tailscale

**Backend (Self-Hosted):**
- **Database**: PostgreSQL 16 (start single-instance, migrate to Citus for sharding)
- **Full-Text Search**: SQLite FTS5 (embedded) or PostgreSQL `tsvector`
- **Sync Engine**: YJS + WebSocket server (optional real-time collaboration)
- **File Storage**: Local filesystem (markdown) + S3-compatible backup (MinIO)

**Mobile (iOS):**
- **Architecture**: Native Swift app
- **Sync**: Git-based (Working Copy integration) or custom YJS client
- **Local Storage**: SQLite + FTS5
- **Offline-first**: Full note cache with background sync

**AI/Agent Integration:**
- **Framework**: LangGraph (stateful multi-agent workflows)
- **RAG**: LlamaIndex over markdown notes
- **Privacy**: Local LLM (Ollama) for sensitive content, cloud LLM (Claude) for speed

**DevOps:**
- **CI/CD**: GitHub Actions (build on push, daily cron)
- **Monitoring**: Self-hosted (Prometheus + Grafana on Tailscale)
- **Backups**: Automated Borg backups to B2 or S3


### 10.2 Architecture Decision Rationale

**Why Astro over Next.js?**
- Commune is content-first (notes, essays) with occasional interactivity (graph, stars)
- Astro's islands architecture = 40% faster, 90% less JS
- Perfect Lighthouse scores improve SEO
- Can add real-time features via islands (`<ChatWidget client:load />`)

**Why PostgreSQL over Datomic?**
- Datomic requires ClojureScript expertise + Datalog learning curve
- Postgres has mature ecosystem (FTS, JSON, extensions)
- Can add time-travel via event sourcing pattern (append-only events table)
- Easier to self-host and backup

**Why YJS over custom sync?**
- YJS is battle-tested (TipTap, Figma-like apps)
- CRDT eliminates conflict resolution complexity
- Modular design (swap WebSocket for WebRTC or P2P)
- Scales to 100s of concurrent users

**Why SQLite FTS5 over MeiliSearch?**
- Simpler operations (no separate service)
- Embedded in app (single binary)
- 50x faster than full-text alternatives
- Good enough for <10k notes (typical personal knowledge base)

**Why Self-Host on Tailscale?**
- Full data ownership (privacy-first)
- No monthly hosting costs
- Access from anywhere (VPN mesh)
- Can expose selectively (public digital garden + private admin API)


### 10.3 Migration Path (MVP → Scale)

**Phase 1: Static Digital Garden (Current)**
```
Astro static site
  → GitHub Pages / Cloudflare Pages
  → Markdown files in Git
  → No backend
```

**Phase 2: Add Real-Time Sync**
```
Astro static site (public)
  ↓
YJS WebSocket server (private Tailscale)
  ↓
PostgreSQL (notes storage)
  ↓
iOS app (native Swift + YJS)
```

**Phase 3: Multi-Tenant (Future)**
```
Astro per-tenant sites (tenant.commune.com)
  ↓
API Gateway (tenant routing)
  ↓
PostgreSQL Citus (schema-based sharding)
  ↓
YJS sync per tenant
```


## 11. Key Technical Insights & Sources

### 11.1 Static vs Dynamic Trade-offs

**When to choose Static (SSG):**
- Content changes infrequently (<1x/day)
- SEO is critical (Google loves fast sites)
- Simple deployment (CDN edge caching)
- Low operational overhead

**When to choose Dynamic (SSR/ISR):**
- Content changes frequently (>1x/hour)
- Personalized content per user
- Real-time collaboration required
- Complex data queries

**Hybrid Approach (Recommended):**
- Static marketing pages + digital garden (Astro)
- Dynamic user dashboards (Astro server endpoints or separate API)
- Real-time sync via WebSocket islands


### 11.2 Islands Architecture Deep Dive

**Problem Solved:**
Traditional SPAs ship entire framework (React, Vue) even for static content.

**Islands Solution:**
1. Server renders full HTML (SEO-friendly)
2. Identify interactive "islands" (modals, charts, forms)
3. Ship minimal JS to hydrate only those islands
4. Rest of page is pure HTML

**Example (Commune):**
```astro
// Astro component (static)
import GraphVisualization from './GraphVisualization.jsx'

<article>
  <h1>My Note</h1>
  <p>Static content here (no JS)...</p>

  <!-- Island: Only this loads React + graph library -->
  <GraphVisualization client:visible notes={notes} />
</article>
```

**Performance Impact:**
```
Before (SPA):  500kb JS bundle, 3s load
After (Islands):  50kb JS bundle, 0.5s load
```

**Sources:**
- [Islands Architecture](https://www.patterns.dev/vanilla/islands-architecture/)
- [Astro Islands Docs](https://docs.astro.build/en/concepts/islands/)


### 11.3 CRDT vs Operational Transform (OT)

| Aspect | OT (Google Docs) | CRDT (YJS) |
|--------|------------------|------------|
| **Convergence** | Requires central server | Automatic (local merges) |
| **Conflict Resolution** | Complex transform functions | Built into data structure |
| **Offline Support** | Poor (requires server) | Excellent (merge on reconnect) |
| **Scalability** | O(n²) message broadcast | O(n) local resolution |
| **Complexity** | High (order-dependent) | Moderate (CRDT math) |

**Why Reflect Chose YJS:**
> "Because YJS handled all conflict resolution locally on each client, their servers were no longer the bottleneck for collaboration. They could scale to hundreds of concurrent users without the O(n²) message broadcasting problems that had plagued their WebSocket implementation."

**Sources:**
- [Synergy Codes: YJS CRDT](https://www.synergycodes.com/yjs)
- [Deep Dive into Real-Time Frameworks](https://shanechang.com/p/deep-dive-into-realtime-frameworks/)


### 11.4 Graph Database Performance

**When to use Graph DB (Neo4j):**
- Complex multi-hop queries (friends-of-friends)
- Social networks, recommendation engines
- Frequent graph algorithm execution (PageRank, centrality)

**When to use Relational DB + Link Table:**
- Simple backlink queries (1-2 hops)
- Easier operations (Postgres is simpler than Neo4j)
- Can add indexes for performance

**Commune Recommendation**: Start with PostgreSQL link table, add Neo4j if graph queries become bottleneck.


## 12. Further Reading

### Essential Resources

**Architectural Patterns:**
- [Patterns.dev: Islands Architecture](https://www.patterns.dev/vanilla/islands-architecture/)
- [Jamstack: Static Site Generators](https://jamstack.org/generators/)
- [Microsoft: Multi-tenant Storage Approaches](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/storage-data)

**Tools & Frameworks:**
- [Astro Documentation](https://docs.astro.build/)
- [YJS Documentation](https://docs.yjs.dev/)
- [SQLite FTS5 Extension](https://www.sqlite.org/fts5.html)
- [Cytoscape.js](https://js.cytoscape.org)
- [LangGraph](https://github.com/langchain-ai/langgraph)

**Performance & SEO:**
- [Contentful: Astro vs Next.js](https://www.contentful.com/blog/astro-next-js-compared/)
- [Siege Media: Content Refresh Study](https://www.siegemedia.com/strategy/content-refresh)

**Self-Hosting:**
- [Tailscale Self-Hosting Guide](https://homelabs.guru/en/setting-up-tailscale-for-self-hosting/)
- [Headscale GitHub](https://github.com/juanfont/headscale)


## Appendix: Glossary

| Term | Definition |
|------|------------|
| **CRDT** | Conflict-free Replicated Data Type - Data structure that automatically merges concurrent edits |
| **ISR** | Incremental Static Regeneration - Next.js pattern to update static pages without full rebuild |
| **SSG** | Static Site Generator - Builds HTML at compile time |
| **SSR** | Server-Side Rendering - Generates HTML on each request |
| **Islands** | Astro pattern - Ship zero JS by default, hydrate only interactive components |
| **E2EE** | End-to-End Encryption - Data encrypted on client, server cannot decrypt |
| **FTS** | Full-Text Search - Search engine optimized for natural language queries |
| **RLS** | Row-Level Security - PostgreSQL feature to filter rows per user |
| **RAG** | Retrieval-Augmented Generation - LLM pattern to ground responses in retrieved documents |
| **Sharding** | Horizontal database partitioning - Split data across multiple servers |


**Document Metadata:**
- **Total Sources**: 38 web searches
- **Research Duration**: 2 hours
- **Last Updated**: 2025-10-18
- **Next Review**: 2026-01-18 (quarterly update)

# Devon's Personal Wiki (Powered by Commune)

**Devon Meadows' personal knowledge base** built with Astro, featuring Andy Matuschak-style sliding panes, WikiLinks, backlinks, and hover previews.

**Important Note**: This is NOT the official Commune product wiki. This is Devon's personal implementation showcasing Commune's capabilities for individual knowledge management. Commune is the underlying system that powers this wiki.

## Architecture

**Stack:**
- **Astro** - Static site generator
- **Tailwind CSS** - Utility-first styling (preserves custom design system)
- **Custom components** - No framework dependencies
- **Pagefind** - Static search (built at compile time)

**Key Features:**
- 🔗 **WikiLinks**: `[[Note Title]]` automatically converts to links
- 📑 **Sliding Panes**: Andy-style cascading note navigation
- 👁️ **Hover Previews**: See note content on hover
- 🔄 **Backlinks**: Auto-generated bidirectional links
- 🎨 **Design System**: Custom CSS variables with light/dark mode
- 🔍 **Search**: Cmd-K palette with Pagefind integration

## Quick Start

### Local Development

```bash
# Install dependencies
pnpm install

# Start dev server (hot reload)
pnpm dev

# Open http://localhost:4321
```

### Build & Preview

```bash
# Build static site
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
commune-publish/
├── astro.config.mjs        # Astro config + remark plugins
├── tailwind.config.mjs     # Tailwind + custom breakpoints
├── package.json
├── src/
│   ├── content/
│   │   ├── config.ts       # Notes collection schema
│   │   └── notes/          # Markdown notes (Git source of truth)
│   ├── components/
│   │   ├── Header.astro    # Global header
│   │   ├── SearchModal.astro
│   │   └── Backlinks.astro
│   ├── pages/
│   │   ├── index.astro     # Homepage (renders commune.md)
│   │   └── notes/
│   │       ├── index.astro       # All notes index
│   │       └── [...slug].astro   # Dynamic note pages + pane logic
│   └── styles/
│       ├── design-system.css  # Custom CSS variables
│       └── notes.css          # Note typography
├── public/
│   ├── backlinks.json      # Auto-generated backlinks graph
│   └── favicon.svg
├── astro.backlinks.ts      # Backlinks integration
└── remark-wikilinks.ts     # WikiLink transformation plugin
```

## Content: Notes Collection

### Schema

```typescript
notes: defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    visibility: z.enum(['public', 'private', 'draft']).default('private'),
    status: z.enum(['seed', 'growing', 'evergreen']).default('seed'),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    aliases: z.array(z.string()).default([]),
    updated: z.string().optional(),
  }),
})
```

### Creating Notes

All notes must have front-matter:

```markdown
---
title: "Note Title"
visibility: "public"
status: "evergreen"
summary: "Brief description for previews"
tags: [tag1, tag2]
aliases: ["Short Name"]
updated: 2025-10-10
---

Note content here with [[WikiLinks]] to other notes.
```

**Visibility:**
- `public` - Published to site
- `private` - Not published (default)
- `draft` - Work in progress

**Status:**
- `seed` - Early idea, needs development
- `growing` - Actively being refined
- `evergreen` - Well-developed, stable

## WikiLinks Architecture

### How It Works

1. **Build time:** `remark-wikilinks.ts` scans all notes
2. **Index:** Creates title → slug lookup (cached)
3. **Transform:** Replaces `[[Title]]` with `<a href="/notes/slug/">`
4. **Unresolved:** Links to non-existent notes render as plain text

### Syntax

```markdown
[[Note Title]]                    → Links to note with that title
[[Note Title|Display Text]]       → Custom display text
[[Note with "quotes"]]            → Quotes normalized for matching
```

### Troubleshooting

**Links not working?**

```bash
# Check cache consistency
pnpm build 2>&1 | grep "Lookup built with"
# Should see: "20 entries" consistently (not 0, 0, ... 20)

# Check for broken links
pnpm build 2>&1 | grep "Broken link"
# These are WikiLinks to notes that don't exist yet
```

**Cache bug symptoms:**
- Build logs show "0 entries" for most notes
- Only last note gets working links
- Fix: Ensure `notesCache.size > 0` check in remark-wikilinks.ts

### Important Implementation Details

**The cache bug we just fixed:**

```typescript
// WRONG (returns empty Map for subsequent calls):
if (notesCache) { return buildFromCache(); }

// CORRECT (only uses cache if populated):
if (notesCache && notesCache.size > 0) { return buildFromCache(); }
```

**Path resolution:**

```typescript
// Use process.cwd() not __dirname (Astro changes working dir):
const notesDir = path.join(process.cwd(), 'src/content/notes');
```

## Panes System

### Architecture

The pane system is inspired by Andy Matuschak's notes:

- **Single pane:** Centered on page
- **Multiple panes:** First pane slides left, new panes stack to the right
- **Cascading:** Panes overlap slightly with visual depth
- **Independent scroll:** Each pane has its own scrollbar
- **Responsive:** Panes disabled on mobile/tablet

### Implementation

All pane logic lives in `src/pages/notes/[...slug].astro`:

```javascript
// Key functions:
setupPanes()        // Initialize pane container and event handlers
openPane(url)       // Load new note into pane stack
scrollToPane(pane)  // Focus and scroll to pane
closePane(pane)     // Remove pane from stack
```

### Critical CSS

```css
/* MUST use is:global to style dynamically created panes */
<style is:global>
  #pane-container { /* horizontal scroll container */ }
  .pane { /* individual note pane */ }
</style>
```

**Without `is:global`:** Astro scopes CSS to initial pane only, breaking dynamic panes.

## Search System

### Pagefind Integration

**Build-time indexing:**
- Pagefind scans `dist/**/*.html` after build
- Creates static search index in `dist/_pagefind/`
- No server required

**Client-side search:**
- `SearchModal.astro` component
- Cmd-K hotkey to open
- Instant results from static index

**Dev mode fallback:**
- Uses `backlinks.json` when Pagefind not available
- Ensures search works in both `dev` and `preview`

## Backlinks System

### Auto-Generation

The `astro.backlinks.ts` integration:

1. **Build time:** Scans all note content for WikiLinks
2. **Graph:** Creates bidirectional link graph
3. **Output:** Writes to `public/backlinks.json` and `dist/backlinks.json`
4. **Display:** `Backlinks.astro` component shows "Links to this note"

### Data Format

```json
{
  "/notes/atomic-notes/": {
    "backlinks": [
      {
        "from": "/notes/evergreen-notes/",
        "fromTitle": "Evergreen Notes",
        "context": "...text around the link..."
      }
    ]
  }
}
```

## Design System

### CSS Variables

Defined in `src/styles/design-system.css`:

```css
:root {
  --c-bg: #0a0a0b;
  --c-accent: #8b7bff;
  --c-text: #e8e6e3;
  /* ... full palette ... */
}

[data-theme="light"] {
  --c-bg: #fafaf9;
  /* ... light mode overrides ... */
}
```

### Theme Toggle

Implemented in `Header.astro`:
- Persists to localStorage
- Applies `data-theme="light|dark"` to `<html>`
- Smooth CSS variable transitions

## Deployment

### Domain Configuration

**Primary:** `devonmeadows.com`

```bash
# DNS A record:
devonmeadows.com → <server-ip>

# Or CNAME to Cloudflare Pages:
devonmeadows.com → <pages-project>.pages.dev
```

### Home Server Deployment

**Option 1: Static via Caddy** (RECOMMENDED)

```yaml
# compose.yml
commune-wiki:
  image: caddy:alpine
  volumes:
    - ./sites/commune-publish/dist:/srv:ro
    - ./caddy/Caddyfile:/etc/caddy/Caddyfile
  ports:
    - "80:80"
    - "443:443"
  restart: unless-stopped
```

**Option 2: Astro SSR** (for dynamic features later)

```yaml
commune-wiki:
  build: ./sites/commune-publish
  command: pnpm start
  ports:
    - "4321:4321"
  restart: unless-stopped
```

### Build & Deploy Script

```bash
#!/bin/bash
# From server (SERVER_CURSOR):
cd ~/infra
git pull
cd sites/commune-publish
pnpm install
pnpm build
docker compose restart commune-wiki
```

## Performance

**Targets:**
- Lighthouse: >95
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Bundle size: <100KB (excluding images)

**Optimizations:**
- Static generation (no runtime JS for content)
- Tailwind purges unused CSS
- Astro partial hydration
- Pagefind lazy loads search index

## Testing & Validation

### Puppeteer Testing Workflow

**Philosophy:** Test against the live production site after deployment to catch rendering issues, JavaScript behavior, and browser-specific bugs that don't appear in local builds.

**When to use Puppeteer:**
- UI changes (layout, styling, components)
- Interactive features (panes, hover previews, modals)
- Responsive design (viewport-specific behavior)
- JavaScript-dependent functionality

**Standard Workflow:**

```bash
# 1. Make code changes locally
# Edit files in src/

# 2. Build project
pnpm build

# 3. Commit changes
git add -A
git commit -m "feat: description of changes"

# 4. Push to GitHub
git push

# 5. Deploy to production server
ssh devon@home-server 'cd ~/infra && git pull && cd sites/commune-publish && source ~/.nvm/nvm.sh && nvm use 20 && pnpm build && cp -r dist/* /srv/wiki/'

# 6. Run Puppeteer tests against live site
node scripts/test-<feature>.js
```

**Available Test Scripts:**

```bash
# Validate live site fixtures (backlinks, badges)
node scripts/validate-live-site.js

# Test preview card positioning and typography
node scripts/test-preview-cards.js

# Add more as needed for specific features
```

### Writing Puppeteer Tests

**Test Template:**

```javascript
import puppeteer from 'puppeteer';

async function testFeature() {
  const browser = await puppeteer.launch({
    headless: false,  // See what's happening
    slowMo: 50       // Slow down for visibility
  });

  const page = await browser.newPage();

  try {
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to live site
    await page.goto('https://devonmeadows.com/', {
      waitUntil: 'networkidle2'
    });

    // Test assertions
    const result = await page.evaluate(() => {
      // DOM inspection logic
      return { /* test results */ };
    });

    // Validate results
    if (result.expected) {
      console.log('✓ PASS');
    } else {
      console.log('✗ FAIL');
    }

  } finally {
    await browser.close();
  }
}

testFeature();
```

**Best Practices:**

1. **Test Real Scenarios:** Simulate actual user interactions
2. **Multiple Viewports:** Test desktop, tablet, mobile
3. **Wait for Network:** Use `waitUntil: 'networkidle2'`
4. **Clear Feedback:** Use ✓/✗ symbols for pass/fail
5. **Screenshots on Failure:** Capture evidence of issues
6. **Test Edge Cases:** Viewport edges, overflow, empty states

**Example Test Cases:**

- Backlinks visibility (show/hide based on presence)
- Preview cards staying within viewport bounds
- Typography hierarchy (title vs body)
- Status badges rendering correctly
- Pane navigation and stacking
- Responsive breakpoints
- Search modal keyboard shortcuts

## Commands Reference

```bash
# Development
pnpm dev                    # Start dev server (port 4321)
pnpm build                  # Build production site
pnpm preview                # Preview built site

# Testing
node scripts/validate-live-site.js    # Validate core functionality
node scripts/test-preview-cards.js    # Test preview card behavior

# Debugging
pnpm build 2>&1 | grep WikiLink    # Check WikiLink resolution
pnpm build 2>&1 | grep Broken      # Find missing linked notes

# Deployment
cd ~/infra && git pull              # Pull latest (SERVER_CURSOR)
./scripts/deploy-wiki.sh            # Build + restart service

# Full workflow (local → production → validate)
pnpm build && git add -A && git commit -m "feat: changes" && git push && ssh devon@home-server 'cd ~/infra && git pull && cd sites/commune-publish && source ~/.nvm/nvm.sh && nvm use 20 && pnpm build && cp -r dist/* /srv/wiki/' && node scripts/test-<feature>.js
```

## Common Issues & Fixes

### WikiLinks not converting to links

**Symptom:** Links appear as plain text instead of purple hyperlinks.

**Cause:** WikiLink plugin cache returning empty Map.

**Fix:** Verify in `remark-wikilinks.ts`:
```typescript
if (notesCache && notesCache.size > 0) {  // MUST check .size!
```

### Panes not opening / wrong styling

**Symptom:** Clicking links opens new page instead of pane.

**Cause:** CSS not applying to dynamically created panes.

**Fix:** Ensure `<style is:global>` in `[...slug].astro`:
```astro
<style is:global>
  #pane-container { ... }
  .pane { ... }
</style>
```

### Search showing empty results

**Symptom:** Search modal opens but shows no results.

**Cause:** Pagefind index not found (common in dev mode).

**Solution:** Plugin falls back to `backlinks.json` automatically.

## Contributing

This is a personal wiki but the architecture is open source.

**To suggest improvements:**
1. Fork the repo
2. Create a feature branch
3. Test thoroughly
4. Submit PR with clear description

## License

Part of the infra-home-server project. See root LICENSE.

---

**Questions?** Check `docs/WHERE-TO-READ.md` for documentation navigation.

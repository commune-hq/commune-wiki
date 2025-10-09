# Commune Public Wiki

This directory contains the **Commune public wiki** - an Astro + Starlight site that automatically publishes selected documentation from the `docs/` folder.

## Overview

The wiki implements Commune's "build in public" philosophy by:
- Filtering docs based on `visibility: public` front-matter
- Building a static site with Astro + Starlight
- Including Pagefind search (static, no backend)
- Auto-deploying to `wiki.thecommune.app`

## Quick Start

### Local Development

```bash
# Install dependencies
pnpm install

# Start dev server (without filtering - shows all docs)
pnpm dev

# Open http://localhost:4321
```

### Build Public Site

```bash
# From project root:
./scripts/build-public-wiki.sh

# This will:
# 1. Filter docs/ for visibility:public
# 2. Copy to src/content/docs/
# 3. Build static site to dist/
```

### Preview Build

```bash
pnpm preview
# Open http://localhost:4321 to see production build
```

## Visibility Control

Documents are published based on front-matter:

```yaml
---
title: "My Document"
visibility: public  # public | private | draft
---
```

**Default**: `private` (never published unless explicitly marked)

**States**:
- `public` - Published to wiki
- `private` - Never published
- `draft` - Excluded from build

## Project Structure

```
commune-publish/
├── astro.config.mjs      # Astro + Starlight config
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── src/
│   ├── content/
│   │   ├── config.ts     # Content schema (extends Starlight)
│   │   └── docs/         # Filtered docs copied here at build time
│   ├── components/
│   │   └── PoweredBy.astro  # Custom footer
│   └── styles/
│       └── commune.css   # Brand styles
└── public/               # Static assets
```

## Content Collections

The `docs` collection extends Starlight's schema with:

```typescript
{
  visibility: z.enum(['public', 'private', 'draft']).default('private'),
  category: z.string().optional(),
}
```

## Build Pipeline

### Automatic (GitHub Actions)

When you push to `main` with changes to `docs/**`:

1. GitHub Actions triggers
2. Runs `scripts/build-public-wiki.sh`
3. Builds static site
4. Deploys to Cloudflare Pages (`wiki.thecommune.app`)

### Manual (Local)

```bash
# Build public site
./scripts/build-public-wiki.sh

# Outputs to: dist/
```

## Deployment

### Primary: Cloudflare Pages

- **URL**: https://wiki.thecommune.app
- **Deploy**: Automatic on push to main
- **Features**: Global CDN, automatic SSL, preview deploys

### Mirror: Home Server (Optional)

- **URL**: https://preview.thecommune.app (Tailscale only)
- **Deploy**: Docker compose service
- **Features**: Private preview, backup if CF down

## Search

Starlight includes **Pagefind** by default:
- Static search index built at build time
- No backend required
- Privacy-friendly (no external requests)
- Instant results

## Customization

### Branding

Edit `src/styles/commune.css` to customize:
- Colors
- Typography
- Spacing

### Navigation

Edit `astro.config.mjs` sidebar to reorganize:

```javascript
sidebar: [
  { label: 'Vision', slug: 'vision' },
  { label: 'Architecture', autogenerate: { directory: 'architecture' } },
  // ...
]
```

### Footer

Edit `src/components/PoweredBy.astro` to customize footer.

## Dependencies

### Core

- `astro` - Static site generator
- `@astrojs/starlight` - Documentation theme
- `sharp` - Image optimization

### Dev

- `typescript` - Type checking
- `@astrojs/check` - Astro diagnostics

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build production site
pnpm preview      # Preview production build
pnpm astro        # Run Astro CLI
```

## Troubleshooting

### "No public documents found"

Check that docs have `visibility: public` in front-matter:

```bash
grep -r "visibility: public" ../../docs/
```

### Build fails

```bash
# Check Astro diagnostics
pnpm astro check

# Clear cache and rebuild
rm -rf .astro dist
pnpm build
```

### Search not working

Pagefind builds automatically. If search fails:

```bash
# Pagefind index should be in dist/_pagefind/
ls -la dist/_pagefind/
```

## References

- [Astro Documentation](https://docs.astro.build/)
- [Starlight Documentation](https://starlight.astro.build/)
- [Pagefind](https://pagefind.app/)
- [ADR-001: Static Site Generator](../../docs/decisions/ADR-001-static-site-generator.md)
- [ADR-002: Auto-Publish Pipeline](../../docs/decisions/ADR-002-auto-publish-pipeline.md)

## License

This wiki generator is part of Commune. See repository LICENSE.


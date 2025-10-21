# Commune Wiki - Documentation Guide

**Purpose**: Define what documentation belongs in this repo (public OSS) vs commune-agent (private product docs)

**Last Updated**: 2025-10-21

---

## Documentation Structure (OSS Repo)

### ✅ Belongs in commune-wiki (Public OSS)

**Root Level**:
- `README.md` - Project overview, features, quick start
- `CONTRIBUTING.md` - How to contribute (OSS standard)
- `LICENSE` - AGPL-3.0 license
- `DOCUMENTATION-GUIDE.md` - This file (meta-documentation)

**docs/** (User-Facing Guides):
- Installation guides
- Deployment tutorials (Cloudflare Pages, Netlify, Vercel)
- Customization guides (themes, plugins, design system)
- User documentation (how to write notes, use WikiLinks, etc.)

**Technical Docs** (Optional):
- `ARCHITECTURE.md` - Technical architecture of the SSG
- `DESIGN-SYSTEM.md` - CSS variables, components
- API documentation (if extensible via plugins)

---

### ❌ Does NOT Belong in commune-wiki

**Product Vision** → commune-agent repo (private):
- Product roadmaps
- Business strategy
- Monetization plans
- Target market research

**Agent Guidelines** → commune-agent repo (private):
- Evergreen note composition rules
- Agent prompts and behaviors
- Content generation strategies
- Quality evaluation criteria

**Internal Operations** → devon-homelab repo (private):
- Infrastructure setup
- Deployment credentials
- Service management
- Monitoring dashboards

---

## Current Files to Migrate/Remove

### Files to Move to commune-agent (Private):

1. **`docs/EVERGREEN-NOTES.md`**
   - Purpose: Agent guidelines for note composition
   - Destination: `commune-agent/docs/agent-guidelines/EVERGREEN-NOTES.md`
   - Reason: Internal agent behavior, not OSS user documentation

2. **`docs/GAMIFICATION-VISION.md`**
   - Purpose: Product vision for gamification features
   - Destination: `commune-agent/docs/product-vision/`
   - Reason: Product strategy, not OSS documentation

3. **`docs/NOTE-WRITING-BIBLE.md`** (Review)
   - If user-facing: Keep in commune-wiki/docs/
   - If agent-facing: Move to commune-agent

### Files to Remove/Archive:

1. **`SETUP-PROGRESS.md`**
   - Migration artifact from Oct 9, 2025
   - Action: Remove (history preserved in git)
   - Reason: Temporary status file, no longer needed

2. **`ENHANCED-SCHEMA.md`**
   - Consider moving to `docs/SCHEMA.md` (user-facing)
   - Or remove if obsolete

---

## Governance Rules (OSS Repo)

### BEFORE Creating New .md File in Root, Ask:

1. **Is this for contributors?**
   - → Add to `CONTRIBUTING.md` or create in `docs/contributing/`

2. **Is this user documentation?**
   - → Create in `docs/` subdirectory (installation, customization, etc.)

3. **Is this technical architecture?**
   - → Create `ARCHITECTURE.md` or `docs/ARCHITECTURE.md`

4. **Is this product vision/strategy?**
   - → **Move to commune-agent repo** (private)

5. **Is this agent behavior/guidelines?**
   - → **Move to commune-agent repo** (private)

6. **Is this deployment/ops?**
   - → **Move to devon-homelab repo** (private)

### Allowed Root-Level Files (OSS Standard):

- `README.md` - Project overview
- `CONTRIBUTING.md` - Contribution guide
- `LICENSE` - AGPL-3.0
- `CHANGELOG.md` - Release notes (optional)
- `CODE_OF_CONDUCT.md` - Community standards (optional)
- `SECURITY.md` - Security policy (optional)
- `DOCUMENTATION-GUIDE.md` - This file

**Rule**: Keep root clean. Maximum ~5-7 markdown files.

---

## docs/ Directory Structure (Proposed)

```
docs/
├── installation/
│   ├── quick-start.md
│   ├── advanced-setup.md
│   └── troubleshooting.md
├── deployment/
│   ├── cloudflare-pages.md
│   ├── netlify.md
│   └── vercel.md
├── customization/
│   ├── themes.md
│   ├── design-system.md
│   └── plugins.md
├── user-guide/
│   ├── writing-notes.md
│   ├── wikilinks.md
│   ├── backlinks.md
│   └── search.md
└── ARCHITECTURE.md (technical overview)
```

---

## Migration Checklist

**Phase 1** (Immediate):
- [ ] Create `CONTRIBUTING.md` ✅
- [ ] Create `DOCUMENTATION-GUIDE.md` ✅
- [ ] Create `LICENSE` file (AGPL-3.0)

**Phase 2** (Cleanup):
- [ ] Move `docs/EVERGREEN-NOTES.md` → commune-agent
- [ ] Move `docs/GAMIFICATION-VISION.md` → commune-agent
- [ ] Review `docs/NOTE-WRITING-BIBLE.md` (keep or move)
- [ ] Remove `SETUP-PROGRESS.md`
- [ ] Review `ENHANCED-SCHEMA.md` (move to docs/ or remove)

**Phase 3** (Build Out OSS Docs):
- [ ] Create `docs/installation/` with user guides
- [ ] Create `docs/deployment/` with platform guides
- [ ] Create `docs/customization/` with theming docs
- [ ] Create `ARCHITECTURE.md` (technical overview)

---

## Principles for OSS Documentation

**1. Public by Default**:
- All OSS documentation is public
- No sensitive information (API keys, credentials, strategy)
- Focus on user value, not internal planning

**2. User-Centric**:
- Written for end users and contributors
- Clear, actionable, tested
- Examples over theory

**3. Versioned**:
- Update docs in same PR as code changes
- Keep changelog for major releases
- Link to specific versions if API changes

**4. Minimal**:
- Don't create docs for the sake of docs
- README is often enough for small features
- Link to external resources when appropriate

**5. Searchable**:
- Use clear headers and structure
- Include keywords users would search for
- Cross-link related docs

---

## Examples: Public vs Private

### ✅ Public (commune-wiki):

```markdown
# How to Deploy to Cloudflare Pages

1. Connect GitHub repo to Cloudflare
2. Set build command: `pnpm build`
3. Set output directory: `dist/`
4. Deploy!

See full guide: docs/deployment/cloudflare-pages.md
```

### ❌ Private (commune-agent):

```markdown
# Evergreen Note Composer Agent Guidelines

When generating notes from voice transcripts:
1. Extract atomic concepts
2. Generate wikilink suggestions
3. Eval quality with rubric...

See: commune-agent/docs/agent-guidelines/
```

---

## Questions?

**Unsure where documentation belongs?**

Ask:
- Is it about using/contributing to the OSS wiki generator? → commune-wiki
- Is it about the product strategy/agent behavior? → commune-agent
- Is it about infrastructure/deployment secrets? → devon-homelab

**When in doubt**: Keep it private (commune-agent) until proven public-facing.

---

**Maintained By**: Devon Meadows
**License**: AGPL-3.0
**Status**: Active

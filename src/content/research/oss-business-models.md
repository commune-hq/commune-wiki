---
title: "Open Source Business Models Research: Developer Tools & Creator Platforms"
---

# Open Source Business Models Research: Developer Tools & Creator Platforms

## Executive Summary

This research analyzes six successful companies that use open source or open format strategies to build sustainable businesses in the developer tools and creator platform space. Key findings:

1. **Open Source is a Spectrum**: Companies range from fully OSS (Ghost, Plausible) to closed-source with open formats (Obsidian), each successful in different ways.

2. **The "Free Core + Paid Convenience" Model Dominates**: Most successful OSS companies offer free self-hosting while monetizing managed cloud hosting, capturing 70-80% of revenue from enterprise cloud services.

3. **AGPL is the New Fork Protection**: Companies increasingly use AGPL licensing to prevent cloud giants from forking their code without contributing back, replacing older BSL/fair-source approaches.

4. **Community ≠ Customers (But Drives Them)**: 99% of community members will never pay, but they build brand awareness. The conversion happens indirectly through word-of-mouth and GitHub stars driving discovery.

5. **Small Teams Can Win**: Bootstrap-friendly models exist. Plausible ($3.1M revenue, 4 people), Obsidian ($2M revenue, 18 people), and Ghost ($7.5M revenue, non-profit) prove you don't need VC funding.

## Company Deep Dives

### 1. Obsidian (Closed Source, Open Format)

**Model**: Freemium with paid add-ons
**Revenue**: $2M ARR (2025)
**Team Size**: 18 people
**Users**: ~1 million
**Funding**: Bootstrapped

#### Revenue Structure
- **Core App**: Free forever (personal use)
- **Sync**: $5/user/month (~primary revenue source)
- **Publish**: $10/site/month
- **Commercial License**: $50/year (removed in 2025, now free for all)
- **Catalyst**: $25+ one-time support donation

#### Why NOT Open Source?
**From co-founder Erica Xu (Silver)**:
- Open source doesn't guarantee safety without expensive audits
- Code review takes longer than development
- Extra maintenance overhead detracts from product development
- Want to support their families without VC funding

#### Philosophy: "File Over App"
Despite closed source, Obsidian uses **open file formats** (Markdown) to prevent vendor lock-in. CEO Stephan Ango calls this the "file-over-app philosophy" - you own your data forever, even if Obsidian disappears.

#### Plugin Ecosystem
- **1,000+ community plugins** (all OSS)
- Plugins extend functionality without core app changes
- Community has "mostly happy user base" with "wildly expansive optional features"
- **Risk**: Plugin abandonment and breaking changes

#### Community Sentiment
**Positive**:
- "Sync is completely worth paying for" - multiple HN comments
- Strong developer community filling feature gaps
- Discord: 110,000+ members

**Critical**:
- Some find $5/month sync "ridiculous" for a non-cloud service
- Users prefer self-hosting via iCloud, Dropbox, Git
- Reliance on plugins makes the app "powerful but fragile"

#### Key Insights
1. **Closed source can work** if you offer open data formats
2. **Sync is the killer monetization** for local-first apps
3. **Small team profitability** without VC is possible
4. **Plugin ecosystem** creates moat even without OSS core

**Quote from CEO**: "Rather than building a company optimised to be sold someday, the idea was to build a company to be stuck with."

---

### 2. Plausible Analytics (AGPL Open Source)

**Model**: Open core with managed cloud hosting
**Revenue**: $3.1M (2024), $1M ARR reached in 2021
**Team Size**: 4 people (bootstrapped)
**Customers**: 12,000+ paying subscribers (cloud)
**Funding**: Self-funded, no investors

#### Revenue Structure
- **Self-Hosted (Community Edition)**: Free, AGPL-licensed, community support only
- **Cloud Hosting**: Subscription SaaS with tiered pricing
  - Revenue from cloud: ~99.9% of total revenue
  - Revenue from self-hosted donations: ~$300/month

#### Repository Structure
- **Core codebase**: 100% open source on GitHub
- **License**: AGPL v3 (switched from MIT to prevent cloud forks)
- **Business features**: Funnels and ecommerce metrics exclusive to business tier (code still public for review)

#### How They Reached $1M ARR
**Timeline**: 9 months from $400 to $10K MRR, then 10 months to $500K ARR, then 8 months to $1M ARR

**Content Marketing Strategy** (no ad budget):
1. Published "Why you should stop using Google Analytics" → front page of Hacker News
2. 25,000+ visitors on launch day
3. Continued publishing contrarian, privacy-focused content

**Team**:
- Uku (co-founder): Developer
- Marko (co-founder): Marketing/communication
- Completely own 100% of company

#### Fork Protection Strategy
**Why AGPL?**
- Prevents AWS/Google/Microsoft from offering Plausible as managed service without contributing back
- "Designed to ensure corporations contribute back to OSS even when running as SaaS"
- Creates legal requirement to open source any modifications

**Community Edition Launch** (2024):
- Separated "free as in beer" self-hosted version from cloud
- Made clear: cloud revenue funds all development
- Self-hosted users generate negligible revenue (~$300/mo donations)

#### Key Insights
1. **AGPL is essential** for SaaS companies to prevent cloud competition
2. **Content marketing on HN/Reddit** drives early traction
3. **Self-hosted ≠ revenue** but builds brand and trust
4. **Small team + high margins** = sustainable without VC

**Quote from founders**: "All development is made possible and solely funded by the revenue we get from our managed hosting in the cloud."

---

### 3. Ghost (Fully Open Source, Non-Profit)

**Model**: Non-profit foundation with managed hosting
**Revenue**: $7.5M annual revenue (2024)
**Team Size**: Undisclosed (non-profit)
**Customers**: 24,000+ paying Ghost(Pro) subscribers
**Total Installs**: 100M+ (3M+ active installations)
**Funding**: No investors, self-sustaining

#### Organizational Structure
- **Legal Entity**: Non-profit foundation
- **License**: MIT (fully permissive OSS)
- **Ownership**: Nobody owns Ghost - not founders, not investors
- **Constitution**: Company can never be bought or sold
- **Revenue Use**: 100% reinvested in product and community

#### Revenue Model
- **Self-Hosted**: Free, open source download
- **Ghost(Pro)**: Managed hosting ($9-$199+/month based on subscribers)
  - Revenue: ~$600K/month run rate
  - No revenue sharing (unlike Substack)
  - Just monthly hosting fee

#### User Distribution
- **Paying customers**: 24,000 on Ghost(Pro)
- **Self-hosted**: Thousands more (majority of users don't use Ghost(Pro))
- **Market share**: 0.1% of all websites, but growing 15% annually vs 11% CMS market average

#### Founder Philosophy (John O'Nolan)
**Why Non-Profit?**
> "To change the framework from which decisions are made - rather than building a company optimised to be sold someday, the idea was to build a company to be stuck with."

**On Monetization**:
> "Nobody is required to use Ghost's hosting - the majority of Ghost websites do not use Ghost(Pro), but the ones that do directly fund the project for the benefit of everyone."

#### Competitive Advantage
- **No revenue cut** vs Substack (10%), Medium (varies)
- **Full data ownership** and portability
- **Aligned incentives** (product over profit)
- **Trust through structure** (can't be acquired by Meta/Google)

#### Key Insights
1. **Non-profit structure** attracts mission-aligned users
2. **MIT license** works when brand is strong enough
3. **Managed hosting** generates enough revenue for sustainability
4. **Majority self-host** but minority cloud users fund everyone

**Quote from founder**: "Ghost is a distributed non-profit foundation which gives away all of its intellectual property under a permissive MIT license, has no investors and no owners of any kind."

---

### 4. Cal.com (COSS - Commercial OSS)

**Model**: Open source with cloud + enterprise upsell
**Revenue**: Undisclosed (estimates: $150K-$1M+ from enterprise)
**Funding**: $32.4M raised
**Team**: Full remote, many ex-founders
**GitHub Stars**: Strong discovery engine

#### Revenue Structure
**Pricing Tiers**:
- **Free**: Unlimited bookings, basic features
- **Teams**: $15/user/month (managed events, group scheduling)
- **Organizations**: $37/user/month (subteams, white label)
- **Enterprise**: Custom pricing ($150K-$1M+/year estimated)

**Revenue Distribution** (industry estimates):
- Managed cloud services: 70-80% of revenue
- Enterprise solutions: 20-30%
- Self-hosted: 0% direct revenue (but drives enterprise leads)

#### The COSS Challenge
**From founder interviews**:
> "As a COSS startup, Cal.com won't capture revenue from people that self-host their product, but they hope that open source traction puts them on the radar of big companies that could sign bigger deals."

> "Being a COSS startup is essentially playing the long game."

#### Strategy: Bottom-Up Enterprise
1. **Individual users** discover via GitHub, self-host
2. **Teams form** around product inside companies
3. **IT/security** requires compliance, support, SLAs
4. **Enterprise deal closes** at $150K-$1M+/year

#### Target Markets for Self-Hosting
- Government (required by law in some cases)
- Healthcare (HIPAA compliance)
- Finance (data sovereignty)
- Highly regulated industries

#### Key Product: Platform & Atoms (2024)
- New infrastructure for embedded scheduling
- Targets developers building scheduling into their products
- Potential marketplace for premium integrations

#### Key Insights
1. **Self-hosting is lead gen** for enterprise, not revenue
2. **Compliance drives deals** in regulated industries
3. **VC-backed COSS** = long-term bet on enterprise conversion
4. **Open source = trust** for security-conscious buyers

**Quote from founder Peer Richelsen**: "Companies can sign anywhere from $150,000 to multiple million dollars a year for providing proper infrastructure."

---

### 5. Supabase (OSS Infrastructure)

**Model**: Open source Firebase alternative with cloud hosting
**Revenue**: $70M ARR (2025), up from $30M (2024) - 250% YoY growth
**Valuation**: $5B (Sept 2025), up from $2B (2024)
**Funding**: Venture-backed
**Team**: 120 employees, remote-first with many ex-founders

#### Business Model
**Freemium SaaS built on Postgres**:
- **Free Tier**: 50K MAU, 500MB database
- **Pro**: $25/month for 100K MAU, 8GB database (+ usage-based billing)
- **Team**: $599/month (SSO, SOC 2, compliance)
- **Enterprise**: Custom pricing for scale

#### Pricing Philosophy
**Predictable vs Operational Costs**:
- Charges based on **database size, bandwidth, MAUs**
- NOT per read/write/delete (unlike Firebase)
- Makes costs predictable as apps scale

#### Revenue Model
**Network Effects**:
> "The more developers who adopt the open-source core, the more enterprises are incentivized to pay for premium features and support."

**Open Source as Moat**:
- Fully OSS core (Postgres, auth, storage, APIs)
- Enterprises trust it because they can self-host if needed
- Reduces vendor lock-in fears

#### Growth Strategy
1. **Developer community** adopts OSS for MVPs
2. **Startups graduate** to paid tiers as they scale
3. **Enterprises** choose Supabase for data portability
4. **Network effects** compound with more integrations

#### Founder Philosophy (Paul Copplestone)
**Contrarian Bets**:
- Bet on Postgres (not NoSQL)
- Bet on data portability (not lock-in)
- Bet on remote-first (hired ex-founders)

**On "Playing Startup" vs Strategy**:
> "The difference between playing startup and strategy is whether you're optimizing for vanity metrics or building something defensible."

#### Key Insights
1. **OSS infrastructure** attracts developers, converts to enterprise
2. **Data portability** is a feature, not a bug
3. **Postgres commitment** differentiated from Firebase
4. **250% growth** shows OSS can scale massively

**Stats**: ARR grew from $20M → $30M → $70M in 12 months. Valuation: $900M → $2B → $5B in similar timeframe.

---

### 6. Gumroad (Open Source Post-Profitability)

**Model**: Went OSS after reaching profitability
**Revenue**: Undisclosed (previously profitable SaaS)
**License**: MIT (changed from commercial)
**Funding**: Previously VC-backed, now "Antiwork" rebranded

#### Why Open Source (2024)?
**Sahil Lavingia's Reasons**:
1. **AGI Preparation**: "Gumroad planned to open source as part of strategy anticipating AGI for software engineering by 2025"
2. **Ruby on Rails Examples**: Create more training data for LLMs on Rails codebases
3. **DOGE Inspiration**: Match government transparency principles he's advocating for
4. **Post-Exit Freedom**: After stepping back, open sourcing removes maintenance burden

#### License Evolution
- **Initially**: Limited commercial license
- **2024**: Moved to MIT license (fully permissive)
- **Rationale**: "Allow users to do what they want without requirements"

#### Community Response
- Mixed reactions on Hacker News about timing (aligned with DOGE work)
- Seen as "interestingly timed open source play"
- Some skepticism about motivations vs genuine open source commitment

#### Key Insights
1. **Post-profitability OSS** is a valid exit strategy
2. **Reduces maintenance burden** for solo founders
3. **MIT license** shows true open source commitment
4. **AGI/LLM training data** is emerging OSS motivation

**Quote from Sahil**: "The plan is to open source all of it [company stack: Slack, Notion, GitHub]."

---

## Comparison Tables

### OSS Strategy Matrix

| Company | License | Core OSS? | Revenue Model | Team Size | ARR/Revenue |
|---------|---------|-----------|---------------|-----------|-------------|
| **Obsidian** | Proprietary | No (open format) | Freemium add-ons | 18 | $2M |
| **Plausible** | AGPL v3 | Yes (100%) | Cloud hosting | 4 | $3.1M |
| **Ghost** | MIT | Yes (100%) | Cloud hosting | Undisclosed | $7.5M |
| **Cal.com** | AGPL v3 | Yes (100%) | Cloud + enterprise | Remote team | Undisclosed |
| **Supabase** | Apache 2.0 | Yes (100%) | Cloud infrastructure | 120 | $70M |
| **Gumroad** | MIT | Yes (post-profit) | N/A (OSS after exit) | Minimal | N/A |

### Revenue Model Comparison

| Company | Self-Hosted Users | Cloud Users | Enterprise | Revenue Split (Est.) |
|---------|-------------------|-------------|------------|---------------------|
| **Obsidian** | ~1M (free) | N/A | N/A | 100% individual subscriptions |
| **Plausible** | Thousands | 12K+ | N/A | Cloud: 99.9%, Self-hosted: 0.1% |
| **Ghost** | Majority (3M+) | 24K+ | N/A | Cloud: 100% (self-hosted free) |
| **Cal.com** | Unknown | Unknown | Target market | Cloud: 70-80%, Enterprise: 20-30% |
| **Supabase** | Unknown | Unknown | Growing | Cloud: majority, Enterprise: growing |
| **Gumroad** | N/A | N/A | N/A | Not actively monetizing OSS |

### Fork Protection Strategies

| Company | License | Fork Protection | Cloud Competition Risk |
|---------|---------|-----------------|----------------------|
| **Obsidian** | Proprietary | Code not available | None (closed source) |
| **Plausible** | AGPL v3 | Strong (copyleft on SaaS) | Protected |
| **Ghost** | MIT | None (permissive) | High (brand is moat) |
| **Cal.com** | AGPL v3 | Strong (copyleft on SaaS) | Protected |
| **Supabase** | Apache 2.0 | Weak (permissive) | Moderate (brand/scale is moat) |
| **Gumroad** | MIT | None (permissive) | N/A (not competing) |

### Community Engagement Metrics

| Company | GitHub Stars | Discord/Community | External Contributors | Conversion Est. |
|---------|--------------|-------------------|---------------------|----------------|
| **Obsidian** | N/A (closed) | 110K+ Discord | Plugins only | ~1-2% to Sync |
| **Plausible** | 21K+ stars | Small community | Limited | <1% (self→cloud) |
| **Ghost** | 48K+ stars | Large community | Active | <1% (self→cloud) |
| **Cal.com** | High engagement | Active | Moderate | <1% (OSS→enterprise) |
| **Supabase** | Very high | Very active | High (37% at Meta) | Unknown |
| **Gumroad** | Growing | Small | Early days | N/A |

---

## Key Patterns & Lessons

### 1. The "Free Core + Paid Convenience" Model

**How It Works**:
- Core product is free (OSS or free tier)
- Charge for **convenience** (managed hosting, sync, support)
- 70-80% of revenue from cloud/enterprise

**Who Uses It**: Plausible, Ghost, Cal.com, Supabase

**Why It Works**:
- Removes friction for individual developers
- Builds trust through transparency
- Enterprises pay for compliance, SLAs, support
- Self-hosting is marketing, not revenue

**Quote from Plausible**: "Self-hosted users generate ~$300/month. Cloud users fund everything."

---

### 2. AGPL is the New Standard for SaaS Protection

**The Problem**:
- MIT/Apache allows AWS to fork and compete
- Traditional GPL doesn't cover SaaS (ASP loophole)
- BSL/Fair Source aren't true OSS

**The Solution**: AGPL v3
- Requires source disclosure for SaaS deployment
- Prevents cloud giants from parasitic competition
- Still OSI-approved (true open source)

**Companies Using AGPL**: Plausible, Cal.com, ParadeDB, (Elastic and Redis added it in 2024/2025)

**Real Impact** (from ParadeDB):
> "Thanks to AGPL, four cloud providers contacted us. Had we not chosen AGPL, they may have privately forked and distributed our software."

**2024 Trend**: Companies switching FROM permissive TO AGPL
- Plausible: MIT → AGPL (2024)
- Elastic: Proprietary → AGPL option (2024)
- Redis: Proprietary → AGPL with Redis 8 (2025)

---

### 3. GitHub Stars ≠ Revenue (But Drive Discovery)

**The Reality**:
- 99% of community will never pay (from Novu case study)
- Stars don't directly convert to customers
- But stars ARE a discovery metric

**The Funnel**:
1. **Stars** → brand awareness
2. **Word of mouth** ("a friend told me")
3. **Enterprise evaluation** (trust signal)
4. **Deal closes** (after trust established)

**Quote from Novu**: "99% of Novu's customers, when asked 'How did you find us?', answer 'a friend'."

**GitHub's Role**:
- First step in developer journey
- Comparison shopping (more stars = pick this one)
- Not a direct sales channel

**Conversion Benchmarks** (general SaaS):
- Freemium to paid: 2-5% average
- Best performers: 10-15%
- Open source: likely <1% (community → cloud)

---

### 4. Small Teams Can Win Without VC

**The Proof**:
- **Plausible**: $3.1M with 4 people = $775K per person
- **Obsidian**: $2M with 18 people = $111K per person
- **Ghost**: $7.5M, non-profit, sustainable

**The Formula**:
1. **Low overhead**: Remote-first, no office
2. **High margins**: SaaS with OSS development
3. **Content marketing**: HN, Reddit, SEO (not ads)
4. **Slow growth**: Compound over years, not quarters
5. **No investors**: Keep 100% ownership

**Contrasted with VC-Backed**:
- **Cal.com**: $32.4M raised (playing long game)
- **Supabase**: $5B valuation (enterprise scale)

**Tradeoff**:
- Bootstrap: slower growth, immediate profitability, full control
- VC: faster growth, enterprise scale, dilution + pressure

---

### 5. Licensing Spectrum (Not Binary)

**The Range**:

| Approach | Example | User Freedom | Fork Protection | Revenue Risk |
|----------|---------|--------------|----------------|--------------|
| **Proprietary** | Obsidian | Low | Total | None |
| **Open Format** | Obsidian | Medium | High | Low |
| **AGPL** | Plausible | High | High | Low |
| **BSL → OSS** | HashiCorp | Medium → High | Time-based | Medium |
| **Permissive OSS** | Ghost (MIT) | Highest | None | High |
| **Apache 2.0** | Supabase | High | Low | Medium |

**Key Insight**: You don't have to choose "all or nothing"
- Obsidian: Closed code, open data format
- Plausible: OSS core, premium features in paid tier
- Ghost: Fully OSS, brand is moat
- Supabase: OSS infrastructure, managed cloud is value

---

### 6. Self-Hosting is Marketing, Not Revenue

**The Data**:
- **Plausible**: Self-hosted donations = $300/month (0.01% of revenue)
- **Ghost**: Majority self-host, but 24K cloud users fund everyone
- **Cal.com**: Self-hosting drives enterprise leads, not direct revenue

**Why Offer Self-Hosting?**:
1. **Trust signal** for security-conscious users
2. **Compliance** for regulated industries (healthcare, gov)
3. **Brand building** through community
4. **Enterprise pipeline** (try free → need support → buy)

**Why NOT to Offer It**:
- Support burden (community forum, GitHub issues)
- Delays revenue (self-host first, pay later...maybe)
- Complexity (maintain self-host + cloud codebases)

**Best Practice**: Make self-hosting possible but not easy
- Document it, but don't over-optimize
- Cloud should be obviously easier
- Compliance/security is the self-host use case

---

### 7. Community ≠ Customers (But Builds Brand)

**The Harsh Truth**:
- Most OSS users will never pay
- Plugin developers won't pay
- GitHub contributors won't pay
- Discord members won't pay

**The Upside**:
- They tell their friends
- They write blog posts
- They create tutorials
- They become influencers at companies

**The Funnel**:
1. **Community member** (free user) →
2. **Evangelist** (tells colleagues) →
3. **Colleague** (becomes user) →
4. **Company decision-maker** (hears about it) →
5. **Enterprise deal** ($100K+)

**Quote**: "While the community is not paying you - they are building your brand."

**Obsidian Example**:
- 1M users, 110K Discord members
- Estimated 1-2% pay for Sync
- Community builds 1,000+ plugins for free
- Plugins make Obsidian stickier → more paid users

---

## Recommendations for Commune

Based on the research, here are strategic recommendations for Commune's business model:

### 1. Choose AGPL v3 for Core, MIT for Plugins

**Rationale**:
- AGPL protects against cloud competition (Vercel, Netlify forking you)
- MIT for plugins encourages ecosystem growth
- Follows Plausible/Cal.com proven model

**Implementation**:
```
commune-core/          → AGPL v3
commune-plugins/       → MIT
commune-themes/        → MIT
commune-cli/           → Apache 2.0 (dev tooling)
```

---

### 2. Freemium Model: Free Self-Host + Paid Cloud

**Tiers**:

| Tier | Price | Target | Features |
|------|-------|--------|----------|
| **Self-Hosted** | Free | Developers, hobbyists | Deploy yourself, community support |
| **Cloud Starter** | $9/mo | Individuals | Managed hosting, SSL, backups |
| **Cloud Pro** | $29/mo | Creators | Custom domain, analytics, priority support |
| **Enterprise** | Custom | Organizations | SSO, compliance, SLA, white-label |

**Revenue Expectations** (based on benchmarks):
- Self-hosted users: 70-80% of total users, <1% of revenue
- Cloud users: 20-30% of users, 60-70% of revenue
- Enterprise: <5% of users, 30-40% of revenue

---

### 3. Plugin Ecosystem as Moat (Copy Obsidian)

**Strategy**:
1. **Core stays minimal** (Andy Matuschak panes, backlinks, tags)
2. **Plugins extend** (AI, publishing, integrations)
3. **Community builds** plugins (MIT license)
4. **Official premium plugins** (paid, AGPL)

**Plugin Marketplace Revenue**:
- **Free plugins**: Community-driven, no rev share
- **Premium plugins**: 70/30 split (developer/Commune)
- **Official plugins**: 100% to Commune (AI features, advanced publishing)

**Why This Works**:
- Obsidian proves 1,000+ plugins possible
- Reduces core development burden
- Creates switching costs (users invested in plugin ecosystem)
- Monetization layer without gating core features

---

### 4. Content Marketing > Paid Ads

**Playbook (from Plausible)**:
1. Write contrarian posts on privacy, note-taking, knowledge management
2. Target Hacker News, Reddit (r/ObsidianMD, r/Zettelkasten, r/PKMS)
3. Developer-focused SEO (vs Obsidian, Notion, Roam)
4. Launch on Product Hunt, Indie Hackers

**Content Ideas**:
- "Why your note-taking app is making you dumber"
- "The problem with Notion: You don't own your thoughts"
- "Building a second brain with OSS tools"
- "Andy Matuschak's sliding panes, explained"

**Budget**: $0 (just time)
**Expected Traffic**: 25K+ visitors on HN front page (Plausible's result)

---

### 5. Bootstrap First, VC Later (If Ever)

**Bootstrap Phase (Year 1-2)**:
- Goal: $500K ARR with 2-3 people
- Focus: Product-market fit, cloud hosting
- Revenue: Individual subscriptions ($9-29/mo)
- Target: Obsidian power users, Roam refugees, academics

**Growth Phase (Year 2-3)**:
- Goal: $2-3M ARR
- Add: Enterprise tier, SSO, compliance
- Team: 5-10 people
- Decision point: Bootstrap to profitability OR raise seed

**VC Path** (optional):
- Only if targeting $50M+ ARR (Supabase scale)
- Requires enterprise sales team
- Dilution + pressure + loss of control
- **Recommendation**: Avoid unless you want to build the next Notion

---

### 6. Pricing Philosophy: Convenience, Not Features

**What to Charge For**:

- ✅ **Managed hosting** (convenience)
- ✅ **Sync across devices** (convenience)
- ✅ **Backups and recovery** (peace of mind)
- ✅ **Priority support** (time savings)
- ✅ **Publishing to web** (convenience)
- ✅ **Custom domains** (branding)
- ✅ **Analytics** (insights)

**What to Keep Free**:

- ✅ **Core note-taking** (Andy Matuschak panes)
- ✅ **Backlinks and graph** (core value prop)
- ✅ **Tags and search** (table stakes)
- ✅ **Markdown export** (data ownership)
- ✅ **Plugin system** (ecosystem growth)
- ✅ **Self-hosting** (trust + compliance)

**Philosophy**: "Free users own their data. Paid users save time."

---

### 7. Competitive Positioning

**vs Obsidian**:
- **Advantage**: Open source (trustworthy, auditable)
- **Advantage**: Built-in publishing (vs $10/mo Publish)
- **Disadvantage**: Smaller plugin ecosystem (initially)
- **Disadvantage**: No desktop app yet (web-first)

**vs Notion**:
- **Advantage**: Data ownership (Markdown files)
- **Advantage**: Offline-first (no cloud lock-in)
- **Advantage**: Privacy (self-hostable)
- **Disadvantage**: No databases or tables
- **Disadvantage**: No team collaboration (yet)

**vs Roam**:
- **Advantage**: Open source + affordable ($9 vs $15)
- **Advantage**: Andy Matuschak panes (better UX)
- **Disadvantage**: Smaller network effects
- **Disadvantage**: Less mature graph visualization

**Sweet Spot**: "Open source Obsidian with better publishing and backlinks"

---

### 8. Community Strategy

**Build in Public**:
- Weekly dev logs on Twitter/Threads
- Monthly revenue transparency (like Plausible, Ghost)
- Open roadmap on GitHub Projects
- Public metrics dashboard

**Community Channels**:
- GitHub Discussions (support + feature requests)
- Discord (real-time community, 5K+ target)
- Reddit (r/Commune when 1K+ users)
- YouTube (tutorials, demos, founder updates)

**Contribution Strategy**:
- Core: Accept PRs for bugs, not features (maintain vision)
- Plugins: Encourage ecosystem contributions
- Themes: Community-driven (CSS customization)
- Docs: Crowdsourced tutorials and guides

**Expectation Setting**:
- 99% of community won't pay (that's OK)
- 1% will become evangelists (worth it)
- 0.1% will close enterprise deals (jackpot)

---

## Key Quotes from Founders

### On Open Source Philosophy

**John O'Nolan (Ghost)**:
> "Rather than building a company optimised to be sold someday, the idea was to build a company to be stuck with, creating something to keep for the long term."

**Erica Xu (Obsidian, on why NOT open source)**:
> "Open source doesn't guarantee safety without expensive third party audits, doesn't mean faster development... projects don't last forever, and requires extra effort that the developers would rather put into the app itself."

**Sahil Lavingia (Gumroad)**:
> "The plan is to open source all of it [the company stack]. If we're proposing this with DOGE, we should match what we're doing with our own work."

---

### On Business Models

**Plausible Team**:
> "All development is made possible and solely funded by the revenue we get from our managed hosting in the cloud. Self-hosted users donate ~$300/month, which would take more than ten years to pay one month of salary."

**Peer Richelsen (Cal.com)**:
> "As a COSS startup, we won't capture revenue from people that self-host, but we hope that open source traction puts them on the radar of big companies that could sign bigger deals. Being a COSS startup is essentially playing the long game."

**Paul Copplestone (Supabase)**:
> "The difference between 'playing startup' and strategy is whether you're optimizing for vanity metrics or building something defensible."

---

### On Community vs Customers

**From Novu case study**:
> "99% of Novu's customers, when asked 'How did you find us?', answer 'a friend'. While the community is not paying you - they are building your brand."

**ParadeDB (on AGPL)**:
> "Thanks to the copyleft provision, cloud vendors cannot easily resell projects without consent. We were contacted by four cloud providers who, had we not chosen AGPL, may have privately forked and distributed our software."

---

### On Licensing Strategy

**Plausible (on switching to AGPL)**:
> "AGPL is designed to ensure corporations contribute back to the open source community even when running the software as a service in the cloud, basically preventing corporations that never had any intention to contribute to open source from profiting from the open source work."

**Stephan Ango (Obsidian CEO, on file-over-app)**:
> "One of the core ideas behind Obsidian is the open format of the application. Obsidian uses markdown both in the app and behind the scenes, which means users are never tied to the app itself."

---

## Sources

### Company Websites & Official Blogs
- [Plausible: How we built a $1M ARR open source SaaS](https://plausible.io/blog/open-source-saas)
- [Plausible: Open source licensing and why we're changing to AGPL](https://plausible.io/blog/open-source-licenses)
- [Ghost: About the Foundation](https://ghost.org/about/)
- [Ghost: Pricing](https://ghost.org/pricing/)
- [Obsidian: Pricing](https://obsidian.md/pricing)
- [Obsidian: About](https://obsidian.md/about)
- [Cal.com: About](https://cal.com/about)
- [Cal.com: Enterprise](https://cal.com/enterprise)
- [Supabase: Pricing](https://supabase.com/pricing)

### Founder Interviews
- [Interview with Stephan Ango, Obsidian CEO - Paul Jacobson (2023)](https://pauljacobson.me/2023/03/31/interview-with-stephan-ango-obsidian-ceo/)
- [John O'Nolan - Democratising Publishing (Nov 2024)](https://john.onolan.org/democratising-publishing/)
- [Peer Richelsen - Monetizing Open Source (2024 Podcast)](https://podcasts.apple.com/gb/podcast/monetizing-open-source-with-peer-richelsen-cal-com/id1745960606?i=1000657632340)
- [Paul Copplestone - Building for Builders (Felicis)](https://www.felicis.com/insight/paul-copplestone-supabase)

### Research & Analysis
- [Sacra: Supabase at $70M ARR growing 250% YoY](https://sacra.com/research/supabase-at-70m-arr-growing-250-yoy/)
- [Contrary Research: Supabase Business Breakdown](https://research.contrary.com/company/supabase)
- [TechCrunch: The 20 hottest open source startups of 2024](https://techcrunch.com/2025/03/22/the-20-hottest-open-source-startups-of-2024/)
- [Star-History: Do GitHub stars = Money?](https://www.star-history.com/blog/do-github-stars-equal-money)
- [Robin Landy: Obsidian as example of thoughtful pricing strategy](https://www.robinlandy.com/blog/obsidian-as-an-example-of-thoughtful-pricing-strategy-and-the-power-of-product-tradeoffs)

### Licensing & Legal
- [FOSSA: Fall 2024 Software Licensing Roundup](https://fossa.com/blog/fall-2024-software-licensing-roundup/)
- [ParadeDB: Why We Picked AGPL](https://www.paradedb.com/blog/agpl)
- [The New Stack: Why Open Source Forking Is a Hot-Button Issue](https://thenewstack.io/why-open-source-forking-is-a-hot-button-issue/)
- [HashiCorp: Adopts Business Source License](https://www.hashicorp.com/en/blog/hashicorp-adopts-business-source-license)

### Community Discussions
- [Hacker News: Obsidian Sync is worth paying for](https://news.ycombinator.com/item?id=37251708)
- [Hacker News: Obsidian CEO on sync options](https://news.ycombinator.com/item?id=37253639)
- [Hacker News: Why Obsidian is closed source](https://news.ycombinator.com/item?id=33196560)
- [GitHub: Plausible Open Source Commitment Discussion](https://github.com/plausible/analytics/discussions/3099)

### Market Data
- [Enricher.io: Ghost CMS Statistics 2025](https://enricher.io/blog/ghost-cms-statistics)
- [GetLatka: Obsidian hit $2M revenue (2025)](https://getlatka.com/companies/obsidian.md)
- [SaaS Freemium Conversion Rates 2025](https://firstpagesage.com/seo-blog/saas-freemium-conversion-rates/)
- [Open Source Survey 2024](https://opensourcesurvey.org/2024/)

---

## Appendix: Additional Context

### AGPL License Explained (ELI5)

**Regular GPL**:
- If you modify and distribute GPL software, you must share your changes
- **Loophole**: Running as SaaS = not "distributing", so no requirement to share

**AGPL (Affero GPL)**:
- If you modify and **run as a service**, you must share your changes
- Closes the "ASP loophole" for cloud/SaaS
- Users interacting over network = triggers sharing requirement

**Why Companies Use It**:
- Prevents AWS/Google/Microsoft from forking without contributing
- Still OSI-approved (true open source)
- Creates legal moat without going proprietary

**Who Uses It**: Plausible, Cal.com, MongoDB, Neo4j, Grafana, ParadeDB

---

### Business Source License (BSL) Explained

**How It Works**:
- Source code is public (viewable)
- Commercial use restricted for X years (usually 4)
- After X years, converts to open source (Apache/MIT)

**Example**:
- HashiCorp Terraform BSL: Can't offer as managed service for 4 years
- After 4 years: Becomes Apache 2.0 (fully open)

**Controversy**:
- NOT OSI-approved (not "true" open source)
- Seen as "fauxpen source" by purists
- But protects revenue during critical growth phase

**Who Uses It**: HashiCorp, CockroachDB, Couchbase, Sentry, MariaDB

---

### Fair Source License Explained

**How It Works**:
- Free for up to N users (e.g., 25)
- Above N users, must purchase license
- Source code publicly viewable

**Example**:
- Sentry Fair Source: Free for <25 users, paid above

**Why It Exists**:
- Middle ground between OSS and proprietary
- Encourages contribution without full copyleft
- Time-based transition to full OSS (DOSP provision)

**Adoption**: Limited (Sentry, some smaller projects)

---

### Conversion Rate Benchmarks Summary

| Metric | Average | Top Performers |
|--------|---------|----------------|
| **Visitor → Free Signup** | 10-15% | 20-30% |
| **Free → Paid (Freemium)** | 2-5% | 10-15% |
| **Free Trial → Paid** | 10-25% | 40-50% |
| **Self-Hosted → Cloud** | <1% | 2-3% |
| **OSS Community → Customer** | <1% | Unknown |

**Key Insight**: Don't expect high conversion. Focus on volume (grow free users) and product-led growth (make paid tier obviously better).

---

### Remote Team Best Practices (from Cal.com, Supabase)

**Cal.com Strategy**:
- Fully remote, global team
- Transparent salaries (public)
- Hire ex-founders (self-starters)
- Async-first communication

**Supabase Strategy**:
- 120 employees, fully distributed
- Many ex-founders on team
- Open source as recruiting tool
- Builder culture (ship fast)

**Ghost Strategy**:
- Distributed non-profit
- Mission-aligned hiring
- No investors to report to
- Long-term thinking

---

## Final Recommendations: Commune's Path Forward

### Phase 1: Launch (Months 1-6)
1. **Open source core** under AGPL v3
2. **Self-hosting only** (Docker, Vercel deploy)
3. **Launch on HN/Reddit** with contrarian content
4. **Target**: 1,000 GitHub stars, 100 active users

### Phase 2: Monetization (Months 6-12)
1. **Launch cloud hosting** at $9/mo (managed)
2. **Pro tier** at $29/mo (custom domain, analytics)
3. **Plugin marketplace** (MIT plugins, community-driven)
4. **Target**: $5K MRR, 10K GitHub stars

### Phase 3: Scale (Months 12-24)
1. **Enterprise tier** (SSO, compliance, SLA)
2. **Team features** (collaboration, sharing)
3. **Premium plugins** (AI, integrations)
4. **Target**: $50K MRR, 50K users

### Phase 4: Ecosystem (Months 24-36)
1. **Plugin revenue share** (70/30 split)
2. **White-label** for agencies
3. **API/Platform** (embed Commune in other apps)
4. **Target**: $500K ARR, decision point on VC

---

**Bottom Line**: The OSS business model works if you focus on **convenience over features**, **enterprise over individuals**, and **brand over code**. Obsidian proves closed source can work. Plausible proves 4 people can hit $3M. Ghost proves non-profit can sustain. Supabase proves OSS can scale to $70M ARR.

Your choice depends on your goals:
- **Lifestyle business?** → Bootstrap like Plausible ($3M, 4 people)
- **Mission-driven?** → Non-profit like Ghost ($7.5M, sustainable)
- **Unicorn scale?** → VC-backed like Supabase ($70M ARR, $5B valuation)

All paths are valid. All paths work. Choose based on what you want your life to look like in 5 years.

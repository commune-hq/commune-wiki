---
title: "Deep Research: Digital Garden Tech Stacks"
created: 2025-10-18
updated: 2025-10-19
visibility: public
status: live
type: research-summary
tags: [deep-research, astro, nextjs, architecture]
summary: "Static vs dynamic architecture research for digital gardens. Astro 40% faster for content-first sites. Hybrid recommended: Astro wiki + Next.js agent dashboard."
---

Analyzed tech stack decisions from [[Obsidian]], [[Reflect]], Roam, and digital garden frameworks to answer: static (Astro) or dynamic (Next.js) for [[Commune]]? The answer: both.

**Astro wins for wikis**: 40% faster page loads, 90% less JavaScript than Next.js for content-heavy sites. Islands architecture gives zero-JS by default, hydrates only interactive components (graph, search).

**Next.js for dynamic features**: ISR (Incremental Static Regeneration) perfect for agent dashboard, proposals, real-time updates. But heavier payload, more complexity.

**Hybrid recommended**: Keep [[Commune]] public wiki on Astro (SEO, speed). Add Next.js app for agent UI (dynamic). Share components via npm package. Best of both worlds.

Researched performance benchmarks, framework comparisons, digital garden implementations from 2024-2025. Drew from Astro docs, Next.js ISR patterns, [[Obsidian]]/[[Reflect]] architecture decisions.

**Public wiki stays Astro**: Content-first sites benefit most from static-first approach. Perfect for SEO, Core Web Vitals, and [[Preview panes preserve reading flow]].

**Agent dashboard in Next.js**: Real-time proposals, multi-day workflows, auth, dynamic state. Next.js App Router with ISR handles this better than static.

**Shared component library**: @commune/ui published to npm. Both Astro wiki and Next.js agent import same components. DRY code, consistent UX.

Full Deep Research:
[[Digital Garden & Knowledge Management Tech Stack Research]]

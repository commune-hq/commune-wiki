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

I looked at how [[Obsidian]], [[Reflect]], Roam, and various digital garden frameworks handle their tech stacks. The question was whether [[Commune]] should be static like Astro or dynamic like Next.js. Turns out the answer is both.

Astro wins hard for wikis. Page loads are 40% faster and it ships 90% less JavaScript than Next.js for content-heavy sites. The islands architecture gives you zero JavaScript by default and only hydrates interactive pieces like the graph or search. That matters for [[Preview panes preserve reading flow]] because panes open instantly without hydration delays.

Next.js makes sense for dynamic features though. Incremental Static Regeneration is perfect for the agent dashboard, proposals, and real-time updates. But it's a heavier payload and more complexity than you need for static content.

The hybrid approach is what I'm going with. Keep the public wiki on Astro for SEO and speed. Add a separate Next.js app for the agent UI where things need to be dynamic. Share components between them via an npm package. Best of both worlds without compromising on either side.

I pulled from performance benchmarks, framework comparisons, and digital garden implementations from 2024-2025. Astro docs, Next.js ISR patterns, and architecture decisions from [[Obsidian]] and [[Reflect]] informed this.

Public wiki stays Astro because content-first sites benefit most from static-first. Perfect for SEO and Core Web Vitals. Loads fast, feels fast, doesn't break [[Preview panes preserve reading flow]].

Agent dashboard goes in Next.js because real-time proposals, multi-day workflows, auth, and dynamic state need that flexibility. Next.js App Router with ISR handles this way better than trying to force it into static.

Share a component library. Publish it as @commune/ui on npm. Both Astro wiki and Next.js agent import the same components. Keep the code DRY and UX consistent across both apps.

Full Deep Research:
[[Digital Garden & Knowledge Management Tech Stack Research]]

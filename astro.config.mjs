import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import backlinks from './astro.backlinks.ts';
import remarkWikiLinks from './remark-wikilinks.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://devonmeadows.com',
	markdown: {
		remarkPlugins: [remarkWikiLinks],
	},
	integrations: [
		tailwind({
			// Don't apply Tailwind's base styles - preserve our design system
			applyBaseStyles: false,
		}),
		backlinks(),
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
		}),
	],
});


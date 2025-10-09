import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		schema: docsSchema({
			extend: z.object({
				// Visibility control for selective publishing
				visibility: z.enum(['public', 'private', 'draft']).default('private'),
				// Optional category for grouping
				category: z.string().optional(),
			}),
		}),
	}),
};


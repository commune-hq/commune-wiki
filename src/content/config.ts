import { defineCollection, z } from 'astro:content';

export const collections = {
	// Andy-style atomic notes collection (notes-only site)
	notes: defineCollection({
		type: 'content',
		schema: z.object({
			title: z.string(),
			// Privacy by default
			visibility: z.enum(['public', 'private', 'draft']).default('private'),
			// Note status (plain English, not digital garden jargon)
			status: z.enum(['draft', 'live', 'updated']).default('draft'),
			// Tags for related notes
			tags: z.array(z.string()).default([]),
			// Aliases for WikiLink resolution
			aliases: z.array(z.string()).default([]),
			// First published date (yyyy-mm-dd) - for SEO and publish date display
			created: z.union([z.string(), z.date()]).transform(val =>
				val instanceof Date ? val.toISOString().split('T')[0] : val
			).optional(),
			// Last updated (yyyy-mm-dd) - coerce dates to strings
			updated: z.union([z.string(), z.date()]).transform(val =>
				val instanceof Date ? val.toISOString().split('T')[0] : val
			).optional(),
			// Author (for schema.org structured data)
			author: z.string().default('Devon Meadows'),
			// Short summary for previews
			summary: z.string().optional(),
		}),
	}),
	// Deep research reports (long-form, separate from atomic notes)
	research: defineCollection({
		type: 'content',
		schema: z.object({
			title: z.string().optional(),
			author: z.string().default('Devon Meadows'),
		}),
	}),
};


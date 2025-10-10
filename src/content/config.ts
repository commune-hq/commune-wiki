import { defineCollection, z } from 'astro:content';

export const collections = {
	// Andy-style atomic notes collection (notes-only site)
	notes: defineCollection({
		type: 'content',
		schema: z.object({
			title: z.string(),
			// Privacy by default
			visibility: z.enum(['public', 'private', 'draft']).default('private'),
			// Evergreen note status
			status: z.enum(['seed', 'growing', 'evergreen']).default('seed'),
			// Tags for related notes
			tags: z.array(z.string()).default([]),
			// Aliases for WikiLink resolution
			aliases: z.array(z.string()).default([]),
			// Last updated (yyyy-mm-dd) - coerce dates to strings
			updated: z.union([z.string(), z.date()]).transform(val => 
				val instanceof Date ? val.toISOString().split('T')[0] : val
			).optional(),
			// Short summary for previews
			summary: z.string().optional(),
		}),
	}),
};


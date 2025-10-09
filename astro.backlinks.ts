/**
 * Astro integration for building backlinks and graph data at build time.
 * 
 * This integration:
 * - Parses WikiLinks ([[Note Title]]) and markdown links in notes
 * - Resolves WikiLinks to actual note slugs via titles and aliases
 * - Computes bidirectional link graph (outbound + inbound)
 * - Outputs /backlinks.json for client-side consumption
 * - Enables Andy-style backlinks, related notes, and graph views
 */

import type { AstroIntegration } from 'astro';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { globby } from 'globby';
import matter from 'gray-matter';
import path from 'node:path';

interface NoteMetadata {
	slug: string;
	title: string;
	aliases: string[];
	outbound: string[]; // slugs this note links to
	inbound: string[];  // slugs that link to this note
	tags: string[];
	status: string;
	updated?: string;
}

export default function backlinksIntegration(): AstroIntegration {
	return {
		name: 'commune-backlinks',
		hooks: {
			'astro:build:done': async ({ dir, logger }) => {
				logger.info('🔗 Building backlinks index...');

				try {
					const notes: Map<string, NoteMetadata> = new Map();
					const titleToSlug: Map<string, string> = new Map();
					const aliasToSlug: Map<string, string> = new Map();

					// First pass: collect all notes, titles, and aliases
					const noteFiles = await globby(['src/content/notes/**/*.{md,mdx}']);

					for (const file of noteFiles) {
						const src = await readFile(file, 'utf8');
						const { content, data } = matter(src);

						// Skip private/draft notes
						if (data.visibility !== 'public') continue;

						const slug = pathToSlug(file);
						const title = (data.title as string) || slug;
						const aliases = (data.aliases as string[]) || [];
						const tags = (data.tags as string[]) || [];
						const status = (data.status as string) || 'seed';
						const updated = data.updated as string | undefined;

						// Extract outbound links from content
						const outbound = extractLinks(content);

						notes.set(slug, {
							slug,
							title,
							aliases,
							outbound,
							inbound: [], // will be populated in second pass
							tags,
							status,
							updated,
						});

						// Build title -> slug map
						titleToSlug.set(title.toLowerCase(), slug);

						// Build alias -> slug map
						for (const alias of aliases) {
							aliasToSlug.set(alias.toLowerCase(), slug);
						}
					}

					logger.info(`📝 Found ${notes.size} public notes`);

					// Second pass: resolve WikiLinks and compute inbound links
					for (const [fromSlug, note] of notes.entries()) {
						const resolvedOutbound: string[] = [];

						for (const link of note.outbound) {
							// Try to resolve WikiLink to actual slug
							const resolved = 
								notes.has(link) ? link : // already a slug
								titleToSlug.get(link.toLowerCase()) || 
								aliasToSlug.get(link.toLowerCase());

							if (resolved && notes.has(resolved)) {
								resolvedOutbound.push(resolved);
								// Add inbound link to target note
								const targetNote = notes.get(resolved)!;
								if (!targetNote.inbound.includes(fromSlug)) {
									targetNote.inbound.push(fromSlug);
								}
							} else {
								// Link to non-existent note (that's ok for now)
								logger.warn(`⚠️  Broken link in ${fromSlug}: [[${link}]]`);
							}
						}

						note.outbound = resolvedOutbound;
					}

					// Convert to plain object for JSON
					const graph: Record<string, NoteMetadata> = {};
					for (const [slug, note] of notes.entries()) {
						graph[slug] = note;
					}

					// Write to dist directory
					const distPath = path.join(dir.pathname, 'backlinks.json');
					await writeFile(distPath, JSON.stringify(graph, null, 2));
					
					// Also write to /public for dev server parity
					// Use relative path from cwd to handle different build contexts
					const publicPath = path.join('public', 'backlinks.json');
					await mkdir(path.dirname(publicPath), { recursive: true });
					await writeFile(publicPath, JSON.stringify(graph, null, 2));

					logger.info(`✅ Backlinks index written to /backlinks.json (dist + public)`);

					// Log some stats
					const totalBacklinks = Array.from(notes.values()).reduce(
						(sum, note) => sum + note.inbound.length, 
						0
					);
					logger.info(`📊 ${totalBacklinks} total backlinks across ${notes.size} notes`);

				} catch (error) {
					logger.error('❌ Failed to build backlinks index:');
					logger.error(String(error));
					throw error;
				}
			},
		},
	};
}

/**
 * Convert file path to note slug (with /notes/ prefix for URL)
 * Example: src/content/notes/evergreen-notes.md → /notes/evergreen-notes/
 */
function pathToSlug(filePath: string): string {
	const slug = path
		.relative('src/content/notes', filePath)
		.replace(/\\/g, '/')
		.replace(/\.(md|mdx)$/, '')
		.replace(/\/index$/, '');
	return `/notes/${slug}/`;
}

/**
 * Extract WikiLinks [[Note Title]] and markdown links from content
 */
function extractLinks(content: string): string[] {
	const links: string[] = [];

	// WikiLinks: [[Note Title]] or [[Note Title|Display Text]]
	const wikiLinkMatches = content.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g);
	for (const match of wikiLinkMatches) {
		links.push(match[1].trim());
	}

	// Markdown links to /notes/: [text](/notes/slug/)
	const mdLinkMatches = content.matchAll(/\[([^\]]+)\]\(\/notes\/([^)]+)\/?/g);
	for (const match of mdLinkMatches) {
		links.push(match[2].trim());
	}

	return [...new Set(links)]; // dedupe
}


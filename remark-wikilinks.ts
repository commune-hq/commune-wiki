/**
 * Remark plugin to transform WikiLinks [[Note Title]] into proper markdown links.
 * 
 * Transforms:
 *   [[Atomic Notes]] → [Atomic Notes](/notes/atomic-notes/)
 *   [[Note Title|Display Text]] → [Display Text](/notes/note-title/)
 * 
 * This runs at build time during markdown compilation, before HTML generation.
 */

import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import { globby } from 'globby';
import matter from 'gray-matter';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Cache for note metadata to avoid re-reading files
let notesCache: Map<string, { slug: string; title: string; aliases: string[] }> | null = null;

/**
 * Build a lookup table of title/alias → slug for WikiLink resolution
 */
async function buildNotesLookup(): Promise<Map<string, string>> {
	if (notesCache) {
		const lookup = new Map<string, string>();
		for (const note of notesCache.values()) {
			lookup.set(note.title.toLowerCase(), note.slug);
			for (const alias of note.aliases) {
				lookup.set(alias.toLowerCase(), note.slug);
			}
		}
		return lookup;
	}

	notesCache = new Map();
	const lookup = new Map<string, string>();

	try {
		const noteFiles = await globby(['src/content/notes/**/*.{md,mdx}']);

		for (const file of noteFiles) {
			const content = readFileSync(file, 'utf8');
			const { data } = matter(content);

			// Skip private/draft notes
			if (data.visibility !== 'public') continue;

			const slug = pathToSlug(file);
			const title = (data.title as string) || slug;
			const aliases = (data.aliases as string[]) || [];

			notesCache.set(slug, { slug, title, aliases });

			// Add to lookup
			lookup.set(title.toLowerCase(), slug);
			for (const alias of aliases) {
				lookup.set(alias.toLowerCase(), slug);
			}
		}
	} catch (error) {
		console.warn('remark-wikilinks: Failed to build notes lookup:', error);
	}

	return lookup;
}

function pathToSlug(filePath: string): string {
	return path
		.relative('src/content/notes', filePath)
		.replace(/\\/g, '/')
		.replace(/\.(md|mdx)$/, '')
		.replace(/\/index$/, '');
}

/**
 * Transform a title into a URL-friendly slug
 */
function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '') // Remove non-word chars
		.replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
		.replace(/^-+|-+$/g, ''); // Trim hyphens
}

/**
 * Remark plugin function
 */
export default function remarkWikiLinks() {
	return async function transformer(tree: Root) {
		const lookup = await buildNotesLookup();

		visit(tree, 'text', (node, index, parent) => {
			if (!parent || index === undefined) return;

			const text = node.value;
			const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

			// Check if this text node contains WikiLinks
			if (!wikiLinkRegex.test(text)) return;

			// Reset regex
			wikiLinkRegex.lastIndex = 0;

			const newNodes: any[] = [];
			let lastIndex = 0;
			let match;

			while ((match = wikiLinkRegex.exec(text)) !== null) {
				const [fullMatch, linkText, displayText] = match;
				const startIndex = match.index;

				// Add text before the WikiLink
				if (startIndex > lastIndex) {
					newNodes.push({
						type: 'text',
						value: text.slice(lastIndex, startIndex),
					});
				}

				// Resolve WikiLink to slug
				const trimmedLinkText = linkText.trim();
				const resolvedSlug = lookup.get(trimmedLinkText.toLowerCase());

				if (resolvedSlug) {
					// Create a proper link node
					newNodes.push({
						type: 'link',
						url: `/notes/${resolvedSlug}/`,
						children: [
							{
								type: 'text',
								value: displayText?.trim() || trimmedLinkText,
							},
						],
					});
				} else {
					// Leave unresolved WikiLinks as text (with brackets)
					// This makes broken links visible
					newNodes.push({
						type: 'text',
						value: fullMatch,
					});
				}

				lastIndex = startIndex + fullMatch.length;
			}

			// Add remaining text
			if (lastIndex < text.length) {
				newNodes.push({
					type: 'text',
					value: text.slice(lastIndex),
				});
			}

			// Replace the text node with our transformed nodes
			if (newNodes.length > 0) {
				parent.children.splice(index, 1, ...newNodes);
			}
		});
	};
}


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
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cache for note metadata to avoid re-reading files
let notesCache: Map<string, { slug: string; title: string; aliases: string[]; collection: 'notes' | 'research'; urlPath: string }> | null = null;

/**
 * Build a lookup table of title/alias → {slug, collection, urlPath} for WikiLink resolution
 */
async function buildNotesLookup(): Promise<Map<string, { slug: string; collection: 'notes' | 'research'; urlPath: string }>> {
	if (notesCache && notesCache.size > 0) {
		const lookup = new Map<string, { slug: string; collection: 'notes' | 'research'; urlPath: string }>();
		for (const note of notesCache.values()) {
			lookup.set(note.title.toLowerCase(), { slug: note.slug, collection: note.collection, urlPath: note.urlPath });
			for (const alias of note.aliases) {
				lookup.set(alias.toLowerCase(), { slug: note.slug, collection: note.collection, urlPath: note.urlPath });
			}
		}
		return lookup;
	}

	notesCache = new Map();
	const lookup = new Map<string, { slug: string; collection: 'notes' | 'research'; urlPath: string }>();

	try {
		// Scan both notes and research collections
		const notesDir = path.join(process.cwd(), 'src/content/notes');
		const researchDir = path.join(process.cwd(), 'src/content/research');

		const noteFiles = await globby(['**/*.{md,mdx}'], { cwd: notesDir, absolute: true });
		const researchFiles = await globby(['**/*.{md,mdx}'], { cwd: researchDir, absolute: true });

		// Process notes collection
		for (const file of noteFiles) {
			const content = readFileSync(file, 'utf8');
			const { data } = matter(content);

			// Skip private/draft notes
			if (data.visibility !== 'public') continue;

			const slug = pathToSlug(file);
			const title = (data.title as string) || slug;
			const aliases = (data.aliases as string[]) || [];
			const urlPath = `/notes/${slug}/`;

			notesCache.set(slug, { slug, title, aliases, collection: 'notes', urlPath });

			// Add to lookup
			lookup.set(title.toLowerCase(), { slug, collection: 'notes', urlPath });
			for (const alias of aliases) {
				lookup.set(alias.toLowerCase(), { slug, collection: 'notes', urlPath });
			}
		}

		// Process research collection (always public)
		for (const file of researchFiles) {
			const content = readFileSync(file, 'utf8');
			const { data } = matter(content);

			const slug = pathToSlug(file);
			const title = (data.title as string) || slug;
			const aliases = (data.aliases as string[]) || [];
			const urlPath = `/research/${slug}`;

			notesCache.set(slug, { slug, title, aliases, collection: 'research', urlPath });

			// Add to lookup
			lookup.set(title.toLowerCase(), { slug, collection: 'research', urlPath });
			for (const alias of aliases) {
				lookup.set(alias.toLowerCase(), { slug, collection: 'research', urlPath });
			}
		}
	} catch (error) {
		console.warn('remark-wikilinks: Failed to build notes lookup:', error);
	}

	return lookup;
}

function pathToSlug(filePath: string): string {
	// Extract just the filename without extension
	return path
		.basename(filePath, path.extname(filePath));
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

			// Resolve WikiLink to URL path
			const trimmedLinkText = linkText.trim();
			const lookupKey = trimmedLinkText.toLowerCase();
			const resolved = lookup.get(lookupKey);

			if (resolved) {
				// Create a proper link node with correct URL for collection
				// Add data-collection attribute to identify research links for styling
				const linkNode: any = {
					type: 'link',
					url: resolved.urlPath,
					children: [
						{
							type: 'text',
							value: displayText?.trim() || trimmedLinkText,
						},
					],
				};

				// Add data attribute for research links (will be used for new tab behavior)
				if (resolved.collection === 'research') {
					linkNode.data = {
						hProperties: {
							'data-collection': 'research',
							'class': 'wikilink research-link'
						}
					};
				} else {
					linkNode.data = {
						hProperties: {
							'class': 'wikilink'
						}
					};
				}

				newNodes.push(linkNode);
			} else {
				// Leave unresolved WikiLinks as plain text (without brackets)
				// These are notes that don't exist yet in the public wiki
				newNodes.push({
					type: 'text',
					value: displayText?.trim() || trimmedLinkText,
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


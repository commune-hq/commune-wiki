/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
	darkMode: ['class', '[data-theme="dark"]'],
	theme: {
		extend: {
			// Map Tailwind utilities to our design system variables
			colors: {
				'c-bg': 'var(--c-bg)',
				'c-bg-soft': 'var(--c-bg-soft)',
				'c-bg-muted': 'var(--c-bg-muted)',
				'c-text': 'var(--c-text)',
				'c-text-muted': 'var(--c-text-muted)',
				'c-accent': 'var(--c-accent)',
				'c-accent-hover': 'var(--c-accent-hover)',
				'c-border': 'var(--c-border)',
			},
			spacing: {
				'header': '64px',
			},
			// Add screen breakpoints that match our pane strategy
			screens: {
				'panes-2': '1024px',  // 2 panes minimum
				'panes-3': '1280px',  // 3 panes minimum
			},
		},
	},
	plugins: [],
}


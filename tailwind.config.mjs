/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
	darkMode: ['class', '[data-theme="dark"]'],
	theme: {
		extend: {
			colors: {
				'c-bg': 'var(--c-bg)',
				'c-bg-soft': 'var(--c-bg-soft)',
				'c-text': 'var(--c-text)',
				'c-accent': 'var(--c-accent)',
				'c-border': 'var(--c-border)',
			},
			spacing: {
				'header': '64px',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
}


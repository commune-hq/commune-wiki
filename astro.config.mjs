import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://wiki.thecommune.app',
	integrations: [
		starlight({
			title: 'Commune',
			description: 'Local-first personal AI infrastructure - build in public documentation',
			social: {
				github: 'https://github.com/dmthepm/infra-home-server',
			},
			editLink: {
				baseUrl: 'https://github.com/dmthepm/infra-home-server/edit/main/docs/',
			},
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'Vision', slug: 'vision' },
					],
				},
				{
					label: 'Decisions',
					autogenerate: { directory: 'decisions' },
				},
			],
			customCss: ['./src/styles/commune.css'],
			components: {
				Footer: './src/components/PoweredBy.astro',
			},
			favicon: '/favicon.svg',
			head: [
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: 'https://wiki.thecommune.app/og-image.png',
					},
				},
			],
		}),
	],
});


// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://idankest.dev',
	output: 'server',
	adapter: netlify(),
	integrations: [
		icon({
			include: {
				devicon: [
					'html5',
					'css3',
					'javascript',
					'typescript',
					'vuejs',
					'react',
					'nuxtjs',
					'nodejs',
					'express',
					'php',
					'symfony',
					'tailwindcss',
					'mysql',
					'postgresql',
					'prisma',
					'vite',
					'git',
					'github',
					'astro',
					'swift',
					'rust',
					'python',
					'docker',
					'go',
				],
				'simple-icons': [
					'axios',
					'jest',
					'framer',
					'googlegemini',
				],
			},
		}),
		react(),
		keystatic(),
		sitemap({
			filter: (page) => !page.includes('/keystatic'),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			include: ['tslib'],
		},
	},
});

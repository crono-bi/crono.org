// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import { analysisTopics } from './src/config/sidebar-analysis.js';
import { metadataTopics } from './src/config/sidebar-metadata.js';
import { etlTopics } from './src/config/sidebar-etl.js';
import { sqlTopics } from './src/config/sidebar-sql.js';
import { examplesTopics } from './src/config/sidebar-examples.js';

// Import SQL grammar for syntax highlighting
import sqlLang from 'shiki/langs/sql.mjs';

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		vue(),
		starlight({
			title: 'Manual de usuario',
			defaultLocale: 'es',
			locales: { root: { label: 'Español', lang: 'es' } },
			social: [{ icon: 'external', label: 'Crono', href: 'https://businessintelligence.es' }],
			customCss: ['./src/styles/custom.css'],
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
			},
			// Configure syntax highlighting with SQL support - uses StarlightUserConfig
			expressiveCode: {
				// @ts-ignore - langs property is supported but not fully typed
				langs: [sqlLang],
			},
			plugins: [
				starlightSidebarTopics(
					[analysisTopics, metadataTopics, etlTopics, sqlTopics, examplesTopics],
					{ exclude: ['index.md', 'sql/language', 'sql/reference', 'sql/functions', 'sql/views'] }
				),
			],
		}),
	],
});

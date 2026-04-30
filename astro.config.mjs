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
import { playgroundTopics } from './src/config/sidebar-playground.js';

import cronoSqlLang from './src/config/crono-sql-grammar.mjs';

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			include: [
				'codemirror',
				'@codemirror/state',
				'@codemirror/view',
				'@codemirror/language',
				'@codemirror/lang-sql',
				'@codemirror/theme-one-dark',
				'@codemirror/commands',
				'@codemirror/search',
				'@codemirror/autocomplete',
				'@lezer/highlight',
			],
		},
	},
	integrations: [
		vue(),
		starlight({
			title: 'Manual de usuario',
			defaultLocale: 'es',
			locales: { root: { label: 'Español', lang: 'es' } },
			social: [],
			customCss: ['./src/styles/custom.css'],
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				ThemeSelect: './src/components/ThemeToggle.astro',
				Sidebar: './src/components/Sidebar.astro',
				PageTitle: './src/components/PageTitle.astro',
			},
			expressiveCode: {
				shiki: {
					langs: [cronoSqlLang],
				},
			},
			plugins: [
				starlightSidebarTopics(
					[
						analysisTopics,
						metadataTopics,
						etlTopics,
						sqlTopics,
						examplesTopics,
						...playgroundTopics,
					],
					{ exclude: ['index.md', 'sql/language', 'sql/reference', 'sql/functions', 'sql/views', 'playground'] }
				),
			],
		}),
	],
});

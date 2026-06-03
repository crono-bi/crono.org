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
import { downloadsTopics } from './src/config/sidebar-downloads.js';

import cronoSqlLang from './src/config/crono-sql-grammar.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://crono.org',
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
			title: {
				es: 'Manual de usuario',
				en: 'User Manual',
			},
			defaultLocale: 'root',
			locales: {
				root: { label: 'Español', lang: 'es' },
				en: { label: 'English', lang: 'en' },
			},
			social: [],
			customCss: ['./src/styles/custom.css'],
			components: {
				Header: './src/components/Header.astro',
				SiteTitle: './src/components/SiteTitle.astro',
				ThemeSelect: './src/components/ThemeToggle.astro',
				Sidebar: './src/components/Sidebar.astro',
				PageTitle: './src/components/PageTitle.astro',
				MarkdownContent: './src/components/MarkdownContent.astro',
			},
			expressiveCode: {
				shiki: {
					langs: [cronoSqlLang],
				},
			},
			plugins: [
				starlightSidebarTopics(
					[
						downloadsTopics,
						analysisTopics,
						metadataTopics,
						etlTopics,
						sqlTopics,
						examplesTopics,
						...playgroundTopics,
					],
					{ exclude: ['index.md', 'sql/language', 'sql/functions', 'sql/views', 'playground'] }
				),
			],
		}),
	],
});

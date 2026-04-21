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

// Import SQL grammar for syntax highlighting
import sqlLang from 'shiki/langs/sql.mjs';

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
			// Social links removed per client request
			customCss: ['./src/styles/custom.css'],
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				ThemeSelect: './src/components/ThemeToggle.astro',
				Sidebar: './src/components/Sidebar.astro',
				PageTitle: './src/components/PageTitle.astro',
			},
			// Configure syntax highlighting with SQL support - uses StarlightUserConfig
			expressiveCode: {
				// @ts-ignore - langs property is supported but not fully typed
				langs: [sqlLang],
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
					{ exclude: ['index.md', 'sql/language', 'sql/reference', 'sql/functions', 'sql/views'] }
				),
			],
		}),
	],
});

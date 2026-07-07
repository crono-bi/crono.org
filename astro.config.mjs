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
		resolve: {
			alias: {
				'@components': '/src/components',
				'@playground': '/src/playground/components',
			},
		},
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
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: 'https://crono.org/og-image.png' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:width', content: '1200' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:height', content: '630' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:type', content: 'image/png' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:alt', content: 'Crono — Documentación oficial' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:card', content: 'summary_large_image' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:image', content: 'https://crono.org/og-image.png' },
				},
			],
			components: {
				Header: './src/components/Header.astro',
				SiteTitle: './src/components/SiteTitle.astro',
				ThemeSelect: './src/components/ThemeToggle.astro',
				LanguageSelect: './src/components/LanguageSelect.astro',
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

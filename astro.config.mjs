// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Manual de usuario',
			defaultLocale: 'es',
			locales: { root: { label: 'Español', lang: 'es' } },
			social: [{ icon: 'external', label: 'Crono', href: 'https://businessintelligence.es' }],
			customCss: ['./src/styles/custom.css'],
			plugins: [
				starlightSidebarTopics([
					{
						label: 'Crono Analysis',
						link: '/analysis/intro/',
						icon: 'chart',
						items: [
			{
				label: "Introducción",
				link: "analysis/intro",
			},
			{
				label: "El catálogo",
				link: "analysis/catalog",
			},
			{
				label: "Estructura de un documento",
				link: "analysis/analysis-document",
			},
			{
				label: "Crear una consulta",
				link: "analysis/create-query",
			},
			{
				label: "Filtros",
				link: "analysis/filters",
			},
			{
				label: "Columnas calculadas",
				link: "analysis/analysis-calculated-columns",
			},
			{
				label: "Bloquear el documento",
				link: "analysis/block-report",
			},
			{
				label: "Exportación",
				link: "analysis/export-report",
			},
			{
				label: "Modo de propagación",
				link: "analysis/propagation",
			},
			{
				label: "Tipos de visualización",
				link: "analysis/visualizations",
			},
			{
				label: "Editor de consultas",
				link: "analysis/query-editor",
			},
			{
				label: "Propiedades de documento",
				link: "analysis/document-properties",
			},
			{
				label: "Propiedades de informe",
				link: "analysis/report-properties",
			},
			{
				label: "Propiedades de hoja",
				link: "analysis/sheet-properties",
			},
			{
				label: "Propiedades de panel",
				link: "analysis/panel-properties",
			},
			{
				label: "Propiedades de columna",
				link: "analysis/analysis-column-properties",
			},
		],
					},
					{
						label: 'Crono Metadata',
						link: '/metadata/intro/',
						icon: 'list-format',
						items: [
			{
				label: "Introducción",
				link: "metadata/intro",
			},
			{
				label: "Cómo crear tu primer catálogo",
				link: "metadata/first-catalog",
			},
			{
				label: "Cómo crear un diagrama",
				link: "metadata/diagram-creation",
			},
			{
				label: "Crear elementos de negocio",
				link: "metadata/business-items-creation",
			},
			{
				label: "Listas de valores",
				link: "metadata/list-of-values",
			},
			{
				label: "Campos calculados",
				link: "metadata/calculated-columns",
			},
			{
				label: "Filtros predefinidos",
				link: "metadata/predefined-filters",
			},
			{
				label: "Tablas agregadas",
				link: "metadata/aggregated-tables",
			},
			{
				label: "Parámetros definidos en el catálogo",
				link: "metadata/parameters",
			},
			{
				label: "Catálogos multi-idioma",
				link: "metadata/multilanguage-catalogs",
			},
			{
				label: "Dimensiones geográficas",
				link: "metadata/geographic-dimensions",
			},
			{
				label: "Validar catálogo",
				link: "metadata/catalog-validation",
			},
			{
				label: "Seguridad y permisos de acceso",
				link: "metadata/security-catalog",
			},
			{
				label: "Propiedades de catálogo",
				link: "metadata/catalog-properties",
			},
			{
				label: "Propiedades de conexión",
				link: "metadata/connection-properties",
			},
			{
				label: "Propiedades de elementos de negocio",
				link: "metadata/business-item-properties",
			},
			{
				label: "Propiedades de tabla",
				link: "metadata/table-properties",
			},
			{
				label: "Propiedades de columna",
				link: "metadata/column-properties",
			},
			{
				label: "Propiedades de relación",
				link: "metadata/join-properties",
			},
		],
					},
					{
						label: 'Crono ETL',
						link: '/etl/',
						icon: 'random',
						items: [
							{ label: 'Inicio', link: 'etl/' },
						],
					},
					{
						label: 'Crono SQL',
						link: '/sql/intro/',
						icon: 'code',
						items: [
							{ label: 'Introducción', link: 'sql/intro' },
							{ label: 'Lenguaje Crono SQL', collapsed: true, autogenerate: { directory: 'sql/language' } },
							{ label: 'Referencia del lenguaje', collapsed: true, autogenerate: { directory: 'sql/reference' } },
							{ label: 'Funciones', collapsed: true, autogenerate: { directory: 'sql/functions' } },
							{ label: 'Sentencias', collapsed: true, autogenerate: { directory: 'sql/actions' } },
							{ label: 'Vistas', collapsed: true, autogenerate: { directory: 'sql/views' } },
						],
					},
					{
						label: 'Ejemplos Starlight',
						link: '/guides/example/',
						icon: 'starlight',
						items: [
							{ label: 'Guía de ejemplo', link: 'guides/example/' },
							{ label: 'Referencia de ejemplo', link: 'reference/example/' },
						],
					},
				], { exclude: ['index.md', 'analysis', 'metadata', 'sql', 'sql/language', 'sql/reference', 'sql/functions', 'sql/views'] }),
			],
		}),
	],
});

export const etlTopics = {
	label: 'Crono ETL',
	link: '/etl/',
	icon: 'random',
	items: [
		{ slug: 'etl', label: 'Crono ETL', translations: { en: 'Crono ETL' } },
		{ slug: 'etl/intro', label: 'Introducción', translations: { en: 'Introduction' } },
		{ slug: 'etl/ide', label: 'El IDE', translations: { en: 'The IDE' } },
		{ slug: 'etl/getting-started', label: 'Primeros pasos', translations: { en: 'Getting started' } },
		{ slug: 'etl/project-structure', label: 'Estructura del proyecto', translations: { en: 'Project structure' } },
		{
			label: 'Configuración del entorno',
			translations: { en: 'Environment configuration' },
			collapsed: false,
			items: [
				{ slug: 'etl/configuration/connections', label: 'Conexiones', translations: { en: 'Connections' } },
				{ slug: 'etl/configuration/storage', label: 'Almacenamiento', translations: { en: 'Storage' } },
				{ slug: 'etl/configuration/credentials', label: 'Credenciales', translations: { en: 'Credentials' } },
			]
		},
		{
			label: 'Acciones ETL',
			translations: { en: 'ETL actions' },
			collapsed: true,
			items: [
				{ slug: 'etl/actions', label: 'Introducción', translations: { en: 'Introduction' } },
				{ slug: 'etl/actions/data-property', label: 'La propiedad Data', translations: { en: 'The Data property' } },
				{ label: 'Exportación e importación', translations: { en: 'Export and import' }, collapsed: true, autogenerate: { directory: 'etl/actions/import-export' } },
				{ label: 'Ejecución', translations: { en: 'Execution' }, collapsed: true, autogenerate: { directory: 'etl/actions/execution' } },
				{ label: 'Utilidades', translations: { en: 'Utilities' }, collapsed: true, autogenerate: { directory: 'etl/actions/utilities' } },
			]
		},
		{ slug: 'etl/dwh-example', label: 'Ejemplo DWH', translations: { en: 'DWH example' } },
	],
};

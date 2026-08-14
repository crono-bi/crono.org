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
		{ slug: 'etl/etl-actions', label: 'Acciones ETL', translations: { en: 'ETL actions' } },
		{ slug: 'etl/dwh-example', label: 'Ejemplo DWH', translations: { en: 'DWH example' } },
	],
};

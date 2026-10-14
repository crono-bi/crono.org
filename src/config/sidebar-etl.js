export const etlTopics = {
	label: 'Crono ETL',
	link: '/etl/intro/',
	icon: 'random',
	items: [
		{ slug: 'etl/intro', label: 'Introducción', translations: { en: 'Introduction' } },
		{ slug: 'etl/ide', label: 'El IDE', translations: { en: 'The IDE' } },
		{ slug: 'etl/getting-started', label: 'Primeros pasos', translations: { en: 'Getting started' } },
		{ slug: 'etl/project-structure', label: 'Estructura del proyecto', translations: { en: 'Project structure' } },
		{
			label: 'Configuración',
			translations: { en: 'Configuration' },
			collapsed: false,
			items: [
				{ slug: 'etl/configuration/project', label: 'Proyecto', translations: { en: 'Project' } },
				{ slug: 'etl/configuration/connections', label: 'Conexiones', translations: { en: 'Connections' } },
				{ slug: 'etl/configuration/storage', label: 'Almacenamiento', translations: { en: 'Storage' } },
				{ slug: 'etl/configuration/credentials', label: 'Credenciales', translations: { en: 'Credentials' } },
				{ slug: 'etl/configuration/machine', label: 'Equipo', translations: { en: 'Machine' } },
			]
		},
		{ slug: 'etl/actions', label: 'Acciones ETL', translations: { en: 'ETL actions' } },
		{
			label: 'Movimiento de datos',
			translations: { en: 'Data movement' },
			collapsed: false,
			items: [
				{ slug: 'etl/data-movement/bulk-table', label: 'BULK TABLE' },
				{ slug: 'etl/data-movement/export-parquet', label: 'EXPORT PARQUET' },
				{ slug: 'etl/data-movement/import-parquet', label: 'IMPORT PARQUET' },
				{ slug: 'etl/data-movement/copy-file', label: 'COPY FILE' },
			]
		},
		{
			label: 'Transformación',
			translations: { en: 'Transformation' },
			collapsed: false,
			items: [
				{ slug: 'etl/transformation/load-pattern', label: 'Patrón de carga', translations: { en: 'Load pattern' } },
				{ slug: 'etl/transformation/deployment', label: 'Despliegue', translations: { en: 'Deployment' } },
				{ slug: 'etl/transformation/external-data', label: 'Datos externos', translations: { en: 'External data' } },
			]
		},
		{
			label: 'Orquestación',
			translations: { en: 'Orchestration' },
			collapsed: false,
			items: [
				{ slug: 'etl/orchestration/workflow', label: 'WORKFLOW' },
				{ slug: 'etl/orchestration/audited-execution', label: 'Ejecución auditada', translations: { en: 'Audited execution' } },
				{ slug: 'etl/orchestration/send-mail', label: 'SEND MAIL' },
				{ slug: 'etl/orchestration/audit', label: 'Auditoría', translations: { en: 'Auditing' } },
				{ slug: 'etl/orchestration/scheduling', label: 'Ejecución programada', translations: { en: 'Scheduled execution' } },
			]
		},
		{ slug: 'etl/dwh-example', label: 'Ejemplo DWH', translations: { en: 'DWH example' } },
	],
};

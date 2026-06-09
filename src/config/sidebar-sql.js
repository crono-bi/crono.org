export const sqlTopics = {
	label: 'Crono SQL',
	link: '/sql/intro/',
	icon: 'code',
	items: [
		{ slug: 'sql', label: 'Crono SQL', translations: { en: 'Crono SQL' } },
		{ slug: 'sql/intro', label: 'Introducción', translations: { en: 'Introduction' } },
		{ label: 'Lenguaje Crono SQL', translations: { en: 'Crono SQL Language' }, collapsed: true, autogenerate: { directory: 'sql/language' } },
		{
			label: 'Funciones',
			translations: { en: 'Functions' },
			collapsed: true,
			items: [
				{ slug: 'sql/functions', label: 'Introducción', translations: { en: 'Introduction' } },
				{ label: 'Funciones de texto', translations: { en: 'Text functions' }, collapsed: true, autogenerate: { directory: 'sql/functions/texto' } },
				{ label: 'Funciones numéricas', translations: { en: 'Numeric functions' }, collapsed: true, autogenerate: { directory: 'sql/functions/numericas' } },
				{ label: 'Funciones de fechas', translations: { en: 'Date functions' }, collapsed: true, autogenerate: { directory: 'sql/functions/fecha' } },
				{ label: 'Funciones de nulos', translations: { en: 'Null functions' }, collapsed: true, autogenerate: { directory: 'sql/functions/nulos' } },
				{ label: 'Funciones de conversión', translations: { en: 'Conversion functions' }, collapsed: true, autogenerate: { directory: 'sql/functions/conversion' } },
				{ label: 'Funciones de agregación', translations: { en: 'Aggregation functions' }, collapsed: true, autogenerate: { directory: 'sql/functions/agregacion' } },
				{ label: 'Funciones de metadata', translations: { en: 'Metadata functions' }, collapsed: true, autogenerate: { directory: 'sql/functions/metadata' } },
				{ label: 'Otras funciones', translations: { en: 'Other functions' }, collapsed: true, autogenerate: { directory: 'sql/functions/others' } },
			]
		},
		{
			label: 'Vistas',
			translations: { en: 'Views' },
			collapsed: true,
			items: [
				{ slug: 'sql/views', label: 'Introducción', translations: { en: 'Introduction' } },
				{ label: 'Vistas de tiempo', translations: { en: 'Time views' }, collapsed: true, autogenerate: { directory: 'sql/views/tiempo' } },
				{ label: 'Vistas de metadatos Crono', translations: { en: 'Crono metadata views' }, collapsed: true, autogenerate: { directory: 'sql/views/metadata-crono' } },
				{ label: 'Vistas de metadatos DB', translations: { en: 'DB metadata views' }, collapsed: true, autogenerate: { directory: 'sql/views/metadata-database' } },
				{ label: 'Vistas ETL', translations: { en: 'ETL views' }, collapsed: true, autogenerate: { directory: 'sql/views/etl' } },
			]
		},
	],
};

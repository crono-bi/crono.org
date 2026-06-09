export const downloadsTopics = {
	label: 'Descargas',
	translations: { en: 'Downloads' },
	link: '/downloads/',
	icon: 'download',
	items: [
		{ slug: 'downloads', label: 'Descargas principales', translations: { en: 'Main downloads' } },
		{ slug: 'downloads/all', label: 'Todos los productos', translations: { en: 'All products' } },
		{
			label: 'Aplicaciones cliente',
			translations: { en: 'Client applications' },
			items: [
				{ slug: 'downloads/crono-analysis', label: 'Crono Analysis' },
				{ slug: 'downloads/crono-metadata', label: 'Crono Metadata' },
				{ slug: 'downloads/crono-etl', label: 'Crono ETL' },
				{ slug: 'downloads/crono-excel', label: 'Crono Excel' },
				{ slug: 'downloads/crono-viewer', label: 'Crono Viewer' },
				{ slug: 'downloads/crono-reporting', label: 'Crono Reporting' },
			],
		},
		{
			label: 'Aplicaciones de servidor',
			translations: { en: 'Server applications' },
			items: [
				{ slug: 'downloads/crono', label: 'Crono' },
				{ slug: 'downloads/crono-administrator', label: 'Crono Administrator' },
				{ slug: 'downloads/crono-jobs', label: 'Crono Jobs' },
				{ slug: 'downloads/crono-server', label: 'Crono Server' },
			],
		},
		{
			label: 'Arquitectura x86 (32 bits)',
			translations: { en: 'x86 architecture (32-bit)' },
			items: [
				{ slug: 'downloads/crono-analysis-32', label: 'Crono Analysis 32' },
				{ slug: 'downloads/crono-metadata-32', label: 'Crono Metadata 32' },
				{ slug: 'downloads/crono-etl-32', label: 'Crono ETL 32' },
				{ slug: 'downloads/crono-jobs-32', label: 'Crono Jobs 32' },
			],
		},
		{
			label: 'Packages MSI',
			translations: { en: 'MSI packages' },
			items: [
				{ slug: 'downloads/crono-analysis-msi', label: 'Crono Analysis MSI' },
				{ slug: 'downloads/crono-metadata-msi', label: 'Crono Metadata MSI' },
				{ slug: 'downloads/crono-administrator-msi', label: 'Crono Administrator MSI' },
			],
		},
		{
			label: 'Crono Classic',
			translations: { en: 'Crono Classic' },
			items: [
				{ slug: 'downloads/crono-classic', label: 'Crono Classic' },
				{ slug: 'downloads/crono-excel-classic', label: 'Crono Excel Classic' },
			],
		},
		{
			label: 'Herramientas',
			translations: { en: 'Tools' },
			items: [
				{ slug: 'downloads/tools', label: 'Cronobase 22.4' },
			],
		},
	],
};

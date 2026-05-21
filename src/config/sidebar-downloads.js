export const downloadsTopics = {
	label: 'Descargas',
	link: '/downloads/',
	icon: 'download',
	items: [
		{ label: "Suite Crono", link: "downloads/" },
		{ label: "Todos los productos", link: "downloads/all" },
		{
			label: "Productos principales",
			items: [
				{ label: "Crono Analysis", link: "downloads/crono-analysis" },
				{ label: "Crono Metadata", link: "downloads/crono-metadata" },
				{ label: "Crono ETL", link: "downloads/crono-etl" },
				{ label: "Crono Excel", link: "downloads/crono-excel" },
				{ label: "Crono Viewer", link: "downloads/crono-viewer" },
				{ label: "Crono Reporting", link: "downloads/crono-reporting" },
			],
		},
		{
			label: "Aplicaciones de servidor",
			items: [
				{ label: "Crono", link: "downloads/crono" },
				{ label: "Crono Administrator", link: "downloads/crono-administrator" },
				{ label: "Crono Jobs", link: "downloads/crono-jobs" },
				{ label: "Crono Server", link: "downloads/crono-server" },
			],
		},
		{
			label: "Arquitectura x86 (32 bits)",
			items: [
				{ label: "Crono Analysis 32", link: "downloads/crono-analysis-32" },
				{ label: "Crono Metadata 32", link: "downloads/crono-metadata-32" },
				{ label: "Crono ETL 32", link: "downloads/crono-etl-32" },
				{ label: "Crono Jobs 32", link: "downloads/crono-jobs-32" },
			],
		},
		{
			label: "Packages MSI",
			items: [
				{ label: "Crono Analysis MSI", link: "downloads/crono-analysis-msi" },
				{ label: "Crono Metadata MSI", link: "downloads/crono-metadata-msi" },
				{ label: "Crono Administrator MSI", link: "downloads/crono-administrator-msi" },
			],
		},
		{
			label: "Crono Classic",
			items: [
				{ label: "Crono Classic", link: "downloads/crono-classic" },
				{ label: "Crono Excel Classic", link: "downloads/crono-excel-classic" },
			],
		},
		{
			label: "Herramientas",
			items: [
				{ label: "Cronobase 22.4", link: "downloads/tools/" },
			],
		},
	],
};

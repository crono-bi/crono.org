export const analysisTopics = {
	label: 'Crono Analysis',
	link: '/analysis/intro/',
	icon: 'chart',
	// El orden lo da este array. Labels y traducciones se leen automáticamente
	// del frontmatter de cada archivo: title (o sidebar.label) en docs/ (ES) y docs/en/ (EN).
	// Al añadir una página solo hay que crear los 2 .md y agregar su slug aquí.
	items: [
		{ slug: 'analysis', label: 'Crono Analysis', translations: { en: 'Crono Analysis' } },
		{ slug: 'analysis/intro' },
		{ slug: 'analysis/catalog' },
		{ slug: 'analysis/analysis-document' },
		{ slug: 'analysis/create-query' },
		{ slug: 'analysis/filters' },
		{ slug: 'analysis/analysis-calculated-columns' },
		{ slug: 'analysis/block-report' },
		{ slug: 'analysis/export-report' },
		{ slug: 'analysis/propagation' },
		{ slug: 'analysis/visualizations' },
		{ slug: 'analysis/query-editor' },
		{ slug: 'analysis/document-properties' },
		{ slug: 'analysis/report-properties' },
		{ slug: 'analysis/sheet-properties' },
		{ slug: 'analysis/panel-properties' },
		{ slug: 'analysis/analysis-column-properties' },
	],
};

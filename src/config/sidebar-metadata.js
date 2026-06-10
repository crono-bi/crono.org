export const metadataTopics = {
	label: 'Crono Metadata',
	link: '/metadata/intro/',
	icon: 'list-format',
	// El orden lo da este array. Labels y traducciones se leen automáticamente
	// del frontmatter: title en docs/ (ES) y docs/en/ (EN).
	// Al añadir una página solo hay que crear los 2 .md y agregar su slug aquí.
	items: [
		{ slug: 'metadata', label: 'Crono Metadata', translations: { en: 'Crono Metadata' } },
		{ slug: 'metadata/intro' },
		{ slug: 'metadata/first-catalog' },
		{ slug: 'metadata/diagram-creation' },
		{ slug: 'metadata/business-items-creation' },
		{ slug: 'metadata/list-of-values' },
		{ slug: 'metadata/calculated-columns' },
		{ slug: 'metadata/predefined-filters' },
		{ slug: 'metadata/aggregated-tables' },
		{ slug: 'metadata/parameters' },
		{ slug: 'metadata/multilanguage-catalogs' },
		{ slug: 'metadata/geographic-dimensions' },
		{ slug: 'metadata/catalog-validation' },
		{ slug: 'metadata/security-catalog' },
		{ slug: 'metadata/catalog-properties' },
		{ slug: 'metadata/connection-properties' },
		{ slug: 'metadata/business-item-properties' },
		{ slug: 'metadata/table-properties' },
		{ slug: 'metadata/column-properties' },
		{ slug: 'metadata/join-properties' },
	],
};

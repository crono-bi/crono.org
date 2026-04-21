export const sqlTopics = {
						label: 'Crono SQL',
						link: '/sql/intro/',
						icon: 'code',
						items: [
							{ label: 'Crono SQL', link: 'sql/' },
							{ label: 'Introducción', link: 'sql/intro' },
							{ label: 'Playground', link: '/playground/', attrs: { style: 'color: #3B82F6; font-weight: 600;' } },
							{ label: 'Lenguaje Crono SQL', collapsed: true, autogenerate: { directory: 'sql/language' } },
							{ label: 'Referencia del lenguaje', collapsed: true, autogenerate: { directory: 'sql/reference' } },
							{ label: 'Funciones', collapsed: true, autogenerate: { directory: 'sql/functions' } },
							{ label: 'Sentencias', collapsed: true, autogenerate: { directory: 'sql/actions' } },
							{ label: 'Vistas', collapsed: true, autogenerate: { directory: 'sql/views' } },
						],
					};

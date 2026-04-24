export const sqlTopics = {
						label: 'Crono SQL',
						link: '/sql/intro/',
						icon: 'code',
						items: [
							{ label: 'Crono SQL', link: 'sql/' },
							{ label: 'Introducción', link: 'sql/intro' },
							{ label: 'Lenguaje Crono SQL', collapsed: true, autogenerate: { directory: 'sql/language' } },
							{ label: 'Referencia del lenguaje', collapsed: true, autogenerate: { directory: 'sql/reference' } },
							{
							label: 'Funciones',
							collapsed: true,
							items: [
								{ label: 'Introducción', link: 'sql/functions/' },
								{
									label: 'Texto',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/texto' }
								},
								{
									label: 'Numéricas',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/numericas' }
								},
								{
									label: 'Fecha',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/fecha' }
								},
								{
									label: 'Nulos',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/nulos' }
								},
								{
									label: 'Conversión',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/conversion' }
								},
								{
									label: 'Agregación',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/agregacion' }
								},
								{
									label: 'Informacional',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/informacional' }
								},
							]
						},
							{
							label: 'Vistas',
							collapsed: true,
							items: [
								{ label: 'Introducción', link: 'sql/views/' },
								{
									label: 'Active Directory',
									collapsed: true,
									autogenerate: { directory: 'sql/views/active-directory' }
								},
								{
									label: 'Base de datos',
									collapsed: true,
									autogenerate: { directory: 'sql/views/base-datos' }
								},
								{
									label: 'Metadata Crono',
									collapsed: true,
									autogenerate: { directory: 'sql/views/metadata-crono' }
								},
								{
									label: 'Tiempo',
									collapsed: true,
									autogenerate: { directory: 'sql/views/tiempo' }
								},
								{
									label: 'Misceláneos',
									collapsed: true,
									autogenerate: { directory: 'sql/views/misc' }
								},
							]
						},
						],
					};

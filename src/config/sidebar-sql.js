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
									label: 'Funciones de texto',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/texto' }
								},
								{
									label: 'Funciones numéricas',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/numericas' }
								},
								{
									label: 'Funciones de fechas',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/fecha' }
								},
								{
									label: 'Funciones de nulos',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/nulos' }
								},
								{
									label: 'Funciones de conversión',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/conversion' }
								},
								{
									label: 'Funciones de agregación',
									collapsed: true,
									autogenerate: { directory: 'sql/functions/agregacion' }
								},
								{
									label: 'Funciones informacionales',
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
									label: 'Vistas de Active Directory',
									collapsed: true,
									autogenerate: { directory: 'sql/views/active-directory' }
								},
								{
									label: 'Vistas de base de datos',
									collapsed: true,
									autogenerate: { directory: 'sql/views/base-datos' }
								},
								{
									label: 'Vistas de metadata Crono',
									collapsed: true,
									autogenerate: { directory: 'sql/views/metadata-crono' }
								},
								{
									label: 'Vistas de tiempo',
									collapsed: true,
									autogenerate: { directory: 'sql/views/tiempo' }
								},
								{
									label: 'Vistas misceláneas',
									collapsed: true,
									autogenerate: { directory: 'sql/views/misc' }
								},
							]
						},
						],
					};

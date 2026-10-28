/**
 * FUENTE ÚNICA DE VERDAD para las páginas de descarga por producto.
 * Cada entrada corresponde a una página `downloads/<slug>` (y `en/downloads/<slug>`).
 * Los textos viven aquí localizados (es/en) para que ambas versiones no deriven.
 */

export type DownloadAlert = 'msi' | 'x86' | 'classic'

export interface DownloadPageConfig {
	/** releaseName usado en la API de updates (DownloadTable, fetchHistory). */
	releaseName: string
	/** Nombre visible del producto en la cabecera (string si es igual en ambos idiomas). */
	name: string | { es: string; en: string }
	/** Tagline opcional junto al nombre. */
	tagline?: { es: string; en: string }
	/** Párrafo descriptivo del producto. */
	desc: { es: string; en: string }
	/** Requisitos del sistema (admite HTML para enlaces). */
	requirements?: { es: string[]; en: string[] }
	/** Tipo de aviso destacado. */
	alert?: DownloadAlert
	/** Texto de alerta personalizado (sobreescribe el texto por defecto del tipo). */
	alertText?: { es: string; en: string }
	/** Paquete dotnet tool; si existe se muestra el bloque "Versión CLI". */
	cliPackage?: string
	/** Página dedicada a la CLI: el bloque de instalación es la acción principal. */
	cliOnly?: boolean
	/** Clave de icono en PRODUCTS (analysis | etl | metadata | sql). */
	productId?: 'analysis' | 'etl' | 'metadata' | 'sql'
}

/** Feed NuGet oficial donde se publican las CLIs (dotnet tools). */
export const NUGET_SOURCE = 'https://nuget.crono.org/v3/index.json'

const MSI_DESC = {
	es: 'Instalador MSI para despliegues corporativos.',
	en: 'MSI installer for corporate deployments.',
}

const CLI_REQUIREMENTS = {
	es: [
		'<a href="https://dotnet.microsoft.com/download">.NET SDK</a>',
		'Windows, Linux o macOS',
	],
	en: [
		'<a href="https://dotnet.microsoft.com/download">.NET SDK</a>',
		'Windows, Linux or macOS',
	],
}

export const DOWNLOAD_PAGES: Record<string, DownloadPageConfig> = {
	'crono-analysis-cli': {
		releaseName: 'crono-analysis',
		name: 'Crono Analysis CLI',
		productId: 'analysis',
		tagline: {
			es: 'Línea de comandos',
			en: 'Command line',
		},
		desc: {
			es: 'Versión de línea de comandos de Crono Analysis. Ideal para automatizaciones y entornos sin interfaz gráfica. Incluye cliente MCP para integración con agentes conversacionales (IA).',
			en: 'Command line version of Crono Analysis. Ideal for automation and headless environments. Includes an MCP client for integration with conversational (AI) agents.',
		},
		requirements: CLI_REQUIREMENTS,
		cliPackage: 'crono-analysis',
		cliOnly: true,
	},
	'crono-etl-cli': {
		releaseName: 'crono-etl',
		name: 'Crono ETL CLI',
		productId: 'etl',
		tagline: {
			es: 'Línea de comandos',
			en: 'Command line',
		},
		desc: {
			es: 'Versión de línea de comandos de Crono ETL. Ideal para automatizaciones, ejecuciones programadas y entornos sin interfaz gráfica. Incluye cliente MCP para integración con agentes conversacionales (IA).',
			en: 'Command line version of Crono ETL. Ideal for automation, scheduled executions and headless environments. Includes an MCP client for integration with conversational (AI) agents.',
		},
		requirements: CLI_REQUIREMENTS,
		cliPackage: 'crono-etl',
		cliOnly: true,
	},
	'crono-administrator': {
		releaseName: 'CronoAdministrator',
		name: 'Crono Administrator',
		desc: {
			es: 'Crono Administrator es la aplicación que instala y administra Crono Server. Permite gestionar la configuración, despliegue y mantenimiento de los servicios Crono en entornos corporativos.',
			en: 'Crono Administrator is the application that installs and manages Crono Server. It handles the configuration, deployment and maintenance of Crono services in corporate environments.',
		},
	},
	'crono-administrator-msi': {
		releaseName: 'CronoAdministratorMSI',
		name: 'Crono Administrator MSI',
		desc: MSI_DESC,
		alert: 'msi',
	},
	'crono-analysis': {
		releaseName: 'CronoAnalysis',
		name: 'Crono Analysis',
		productId: 'analysis',
		tagline: {
			es: 'Análisis y reporting',
			en: 'Analysis and reporting',
		},
		desc: {
			es: 'Crono Analysis es la herramienta principal para usuarios de negocio que necesitan analizar datos y crear informes interactivos sin conocimientos técnicos avanzados. Para un rendimiento óptimo, se recomienda usar Crono Analysis junto con Crono Metadata.',
			en: 'Crono Analysis is the main tool for business users who need to analyze data and create interactive reports without advanced technical knowledge. For best performance, we recommend using Crono Analysis together with Crono Metadata.',
		},
		requirements: {
			es: [
				'Windows 10 o superior',
				'4 GB de RAM mínimo (8 GB recomendado)',
				'1 GB de espacio en disco',
				'Resolución mínima de 1280×720',
			],
			en: [
				'Windows 10 or later',
				'4 GB RAM minimum (8 GB recommended)',
				'1 GB of disk space',
				'Minimum resolution of 1280×720',
			],
		},
		cliPackage: 'crono-analysis',
	},
	'crono-analysis-32': {
		releaseName: 'CronoAnalysis32',
		name: { es: 'Crono Analysis 32 bits', en: 'Crono Analysis 32-bit' },
		productId: 'analysis',
		desc: {
			es: 'Versión de 32 bits de Crono Analysis.',
			en: '32-bit version of Crono Analysis.',
		},
		requirements: {
			es: [
				'Windows 10 o superior (x86)',
				'4 GB de RAM mínimo',
				'1 GB de espacio en disco',
			],
			en: [
				'Windows 10 or later (x86)',
				'4 GB RAM minimum',
				'1 GB of disk space',
			],
		},
		alert: 'x86',
	},
	'crono-analysis-msi': {
		releaseName: 'CronoAnalysisMSI',
		name: 'Crono Analysis MSI',
		productId: 'analysis',
		desc: MSI_DESC,
		alert: 'msi',
	},
	'crono-api': {
		releaseName: 'CronoAPI',
		name: 'Crono API',
		desc: {
			es: 'Crono API es la API REST de la plataforma Crono. Expone los datos y servicios del modelo semántico a aplicaciones web y de terceros.',
			en: 'Crono API is the REST API of the Crono platform. It exposes the semantic model data and services to web and third-party applications.',
		},
	},
	'crono-classic': {
		releaseName: 'CronoClassicMSI',
		name: 'Crono Classic',
		desc: {
			es: 'Versión clásica de la plataforma Crono.',
			en: 'Classic version of the Crono platform.',
		},
		alert: 'classic',
	},
	'crono-etl': {
		releaseName: 'CronoETL',
		name: 'Crono ETL',
		productId: 'etl',
		tagline: {
			es: 'Integración de datos',
			en: 'Data integration',
		},
		desc: {
			es: 'Crono ETL automatiza las cargas diarias de datos hacia el Data Warehouse. Diseñado para cargas que nunca fallan y ahorran horas de trabajo manual, es la herramienta ideal para equipos de datos que necesitan procesos de extracción, transformación y carga fiables y programados.',
			en: 'Crono ETL automates daily data loads into the Data Warehouse. Designed for loads that never fail and save hours of manual work, it is the ideal tool for data teams that need reliable, scheduled extraction, transformation and load processes.',
		},
		requirements: {
			es: [
				'Windows 10 o superior / Windows Server 2016 o superior',
				'4 GB de RAM mínimo (8 GB recomendado)',
				'2 GB de espacio en disco',
				'Acceso a las fuentes de datos y al Data Warehouse',
			],
			en: [
				'Windows 10 or later / Windows Server 2016 or later',
				'4 GB RAM minimum (8 GB recommended)',
				'2 GB of disk space',
				'Access to the data sources and the Data Warehouse',
			],
		},
		cliPackage: 'crono-etl',
	},
	'crono-etl-32': {
		releaseName: 'CronoETL32',
		name: { es: 'Crono ETL 32 bits', en: 'Crono ETL 32-bit' },
		productId: 'etl',
		desc: {
			es: 'Versión de 32 bits de Crono ETL.',
			en: '32-bit version of Crono ETL.',
		},
		alert: 'x86',
	},
	'crono-excel': {
		releaseName: 'CronoExcelMSI',
		name: 'Crono Excel',
		desc: {
			es: 'Crono Excel permite crear informes y análisis de datos directamente desde Microsoft Excel, conectándose a la capa semántica de Crono Metadata.',
			en: 'Crono Excel lets you create reports and analyze data directly from Microsoft Excel, connecting to the Crono Metadata semantic layer.',
		},
		requirements: {
			es: [
				'Microsoft Excel 2016 o superior',
				'<a href="https://dotnet.microsoft.com/download/dotnet-framework">.NET Framework 4.7</a> o superior',
				'Windows 10 o superior',
			],
			en: [
				'Microsoft Excel 2016 or later',
				'<a href="https://dotnet.microsoft.com/download/dotnet-framework">.NET Framework 4.7</a> or later',
				'Windows 10 or later',
			],
		},
	},
	'crono-excel-classic': {
		releaseName: 'CronoExcelClassicMSI',
		name: 'Crono Excel Classic',
		desc: {
			es: 'Versión legacy de Crono Excel.',
			en: 'Legacy version of Crono Excel.',
		},
		requirements: {
			es: ['<a href="https://dotnet.microsoft.com/download/dotnet-framework">.NET Framework 4.7</a> o superior'],
			en: ['<a href="https://dotnet.microsoft.com/download/dotnet-framework">.NET Framework 4.7</a> or later'],
		},
		alert: 'classic',
		alertText: {
			es: 'Esta es la versión legacy de Crono Excel vigente entre 2010 y 2015. Esta versión no tiene soporte y NO SE RECOMIENDA para proyectos nuevos.',
			en: 'This is the legacy version of Crono Excel current between 2010 and 2015. This version has no support and is NOT RECOMMENDED for new projects.',
		},
	},
	'crono-metadata': {
		releaseName: 'CronoMetadata',
		name: 'Crono Metadata',
		productId: 'metadata',
		tagline: {
			es: 'Capa semántica',
			en: 'Semantic layer',
		},
		desc: {
			es: 'Crono Metadata es la capa semántica de la plataforma Crono. Permite definir el modelo de datos, relaciones, cálculos y reglas de negocio de forma centralizada. Diseñado para administradores de datos y desarrolladores BI que necesitan crear y mantener el modelo semántico de la organización.',
			en: 'Crono Metadata is the semantic layer of the Crono platform. It lets you centrally define the data model, relationships, calculations and business rules. Designed for data administrators and BI developers who need to create and maintain the organization\u2019s semantic model.',
		},
		requirements: {
			es: [
				'Windows 10 o superior',
				'4 GB de RAM mínimo (8 GB recomendado)',
				'2 GB de espacio en disco',
				'Acceso a las bases de datos de origen',
			],
			en: [
				'Windows 10 or later',
				'4 GB RAM minimum (8 GB recommended)',
				'2 GB of disk space',
				'Access to the source databases',
			],
		},
	},
	'crono-metadata-32': {
		releaseName: 'CronoMetadata32',
		name: { es: 'Crono Metadata 32 bits', en: 'Crono Metadata 32-bit' },
		productId: 'metadata',
		desc: {
			es: 'Versión de 32 bits de Crono Metadata.',
			en: '32-bit version of Crono Metadata.',
		},
		alert: 'x86',
	},
	'crono-metadata-msi': {
		releaseName: 'CronoMetadataMSI',
		name: 'Crono Metadata MSI',
		productId: 'metadata',
		desc: MSI_DESC,
		alert: 'msi',
	},
	'crono-reporting': {
		releaseName: 'CronoReporting',
		name: 'Crono Reporting',
		desc: {
			es: 'Crono Reporting proporciona capacidades avanzadas de generación y distribución de informes programados.',
			en: 'Crono Reporting provides advanced capabilities for generating and distributing scheduled reports.',
		},
	},
	'crono-server': {
		releaseName: 'CronoServer',
		name: 'Crono Server',
		desc: {
			es: 'Crono Server es la infraestructura de servidor de la plataforma Crono. Proporciona los servicios necesarios para ejecutar aplicaciones Crono en entornos corporativos, y está diseñado para administradores de sistemas que despliegan y mantienen la infraestructura Crono.',
			en: 'Crono Server is the server infrastructure of the Crono platform. It provides the services needed to run Crono applications in corporate environments, and is designed for system administrators who deploy and maintain the Crono infrastructure.',
		},
		requirements: {
			es: [
				'Windows Server 2016 o superior',
				'8 GB de RAM mínimo (16 GB recomendado)',
				'10 GB de espacio en disco',
				'IIS (Internet Information Services)',
			],
			en: [
				'Windows Server 2016 or later',
				'8 GB RAM minimum (16 GB recommended)',
				'10 GB of disk space',
				'IIS (Internet Information Services)',
			],
		},
	},
	'crono-viewer': {
		releaseName: 'CronoViewer',
		name: 'Crono Viewer',
		desc: {
			es: 'Crono Viewer es la aplicación de visualización de informes y dashboards para usuarios que solo necesitan consultar documentos sin necesidad de editarlos.',
			en: 'Crono Viewer is the report and dashboard viewing application for users who only need to consult documents without editing them.',
		},
	},
}

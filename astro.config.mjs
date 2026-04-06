// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Manual de usuario',
			defaultLocale: 'es',
			locales: { root: { label: 'Español', lang: 'es' } },
			social: [{ icon: 'external', label: 'Crono', href: 'https://businessintelligence.es' }],
			sidebar: [
	{
		label: "Crono Analysis",
		items: [
			{
				label: "Introducción",
				link: "analysis/intro",
			},
			{
				label: "El catálogo",
				link: "analysis/catalog",
			},
			{
				label: "Estructura de un documento",
				link: "analysis/analysis-document",
			},
			{
				label: "Crear una consulta",
				link: "analysis/create-query",
			},
			{
				label: "Filtros",
				link: "analysis/filters",
			},
			{
				label: "Columnas calculadas",
				link: "analysis/analysis-calculated-columns",
			},
			{
				label: "Bloquear el documento",
				link: "analysis/block-report",
			},
			{
				label: "Exportación",
				link: "analysis/export-report",
			},
			{
				label: "Modo de propagación",
				link: "analysis/propagation",
			},
			{
				label: "Tipos de visualización",
				link: "analysis/visualizations",
			},
			{
				label: "Editor de consultas",
				link: "analysis/query-editor",
			},
			{
				label: "Propiedades de documento",
				link: "analysis/document-properties",
			},
			{
				label: "Propiedades de informe",
				link: "analysis/report-properties",
			},
			{
				label: "Propiedades de hoja",
				link: "analysis/sheet-properties",
			},
			{
				label: "Propiedades de panel",
				link: "analysis/panel-properties",
			},
			{
				label: "Propiedades de columna",
				link: "analysis/analysis-column-properties",
			},
		],
	},
	{
		label: "Crono Metadata",
		items: [
			{
				label: "Introducción",
				link: "metadata/intro",
			},
			{
				label: "Cómo crear tu primer catálogo",
				link: "metadata/first-catalog",
			},
			{
				label: "Cómo crear un diagrama",
				link: "metadata/diagram-creation",
			},
			{
				label: "Crear elementos de negocio",
				link: "metadata/business-items-creation",
			},
			{
				label: "Listas de valores",
				link: "metadata/list-of-values",
			},
			{
				label: "Campos calculados",
				link: "metadata/calculated-columns",
			},
			{
				label: "Filtros predefinidos",
				link: "metadata/predefined-filters",
			},
			{
				label: "Tablas agregadas",
				link: "metadata/aggregated-tables",
			},
			{
				label: "Parámetros definidos en el catálogo",
				link: "metadata/parameters",
			},
			{
				label: "Catálogos multi-idioma",
				link: "metadata/multilanguage-catalogs",
			},
			{
				label: "Dimensiones geográficas",
				link: "metadata/geographic-dimensions",
			},
			{
				label: "Validar catálogo",
				link: "metadata/catalog-validation",
			},
			{
				label: "Seguridad y permisos de acceso",
				link: "metadata/security-catalog",
			},
			{
				label: "Propiedades de catálogo",
				link: "metadata/catalog-properties",
			},
			{
				label: "Propiedades de conexión",
				link: "metadata/connection-properties",
			},
			{
				label: "Propiedades de elementos de negocio",
				link: "metadata/business-item-properties",
			},
			{
				label: "Propiedades de tabla",
				link: "metadata/table-properties",
			},
			{
				label: "Propiedades de columna",
				link: "metadata/column-properties",
			},
			{
				label: "Propiedades de relación",
				link: "metadata/join-properties",
			},
		],
	},
	{
		label: "Crono SQL",
		items: [
			{
				label: "Introducción",
				link: "sql/intro",
			},
			{
				label: "Lenguaje Crono SQL",
				collapsed: true,
				items: [
					{
						label: "Sentencia SELECT ❤️",
						link: "sql/language/select",
					},
					{
						label: "Sentencia INSERT",
						link: "sql/language/insert",
					},
					{
						label: "Sentencia UPDATE",
						link: "sql/language/update",
					},
					{
						label: "Sentencias MERGE ❤️",
						link: "sql/language/merge",
					},
					{
						label: "Sentencia DELETE",
						link: "sql/language/delete.",
					},
					{
						label: "Sentencia TRUNCATE",
						link: "sql/language/truncate",
					},
					{
						label: "Sentencias DDL",
						link: "sql/language/ddl",
					},
				],
			},
			{
				label: "Referencia del lenguaje",
				collapsed: true,
				items: [
					{
						label: "Sentencias principales",
						link: "sql/reference/main-sentences",
					},
					{
						label: "Palabras reservadas",
						link: "sql/reference/keywords",
					},
					{
						label: "CHECK SNOWFLAKE",
						link: "sql/reference/check-snowflake",
					},
					{
						label: "FILE",
						link: "sql/reference/file",
					},
					{
						label: "INTEGERS BETWEEN",
						link: "sql/reference/integers-between",
					},
					{
						label: "JOIN",
						link: "sql/reference/join",
					},
					{
						label: "MATERIALIZE",
						link: "sql/reference/materialize",
					},
					{
						label: "OVER 🚧",
						link: "sql/reference/over",
					},
					{
						label: "ROWS y COLUMNS",
						link: "sql/reference/rows-columns",
					},
					{
						label: "SELECTs anidados",
						link: "sql/reference/select-anidado",
					},
					{
						label: "Tabla de tiempo",
						link: "sql/reference/time-table",
					},
					{
						label: "UNPIVOT",
						link: "sql/reference/unpivot",
					},
				],
			},
			{
				label: "Funciones",
				collapsed: true,
				items: [
					{
						label: "Funciones de agregación",
						collapsed: true,
						items: [
							{
								label: "avg",
								link: "sql/functions/avg",
							},
							{
								label: "checksum_agg",
								link: "sql/functions/checksum_agg",
							},
							{
								label: "concat_ws",
								link: "sql/functions/concat_ws",
							},
							{
								label: "count",
								link: "sql/functions/count",
							},
							{
								label: "count_big",
								link: "sql/functions/count_big",
							},
							{
								label: "cume_dist",
								link: "sql/functions/cume_dist",
							},
							{
								label: "decile ❇️",
								link: "sql/functions/decile",
							},
							{
								label: "dense_rank",
								link: "sql/functions/dense_rank",
							},
							{
								label: "first_value",
								link: "sql/functions/first_value",
							},
							{
								label: "lag",
								link: "sql/functions/lag",
							},
							{
								label: "last_value",
								link: "sql/functions/last_value",
							},
							{
								label: "lead",
								link: "sql/functions/lead",
							},
							{
								label: "least",
								link: "sql/functions/least",
							},
							{
								label: "max",
								link: "sql/functions/max",
							},
							{
								label: "min",
								link: "sql/functions/min",
							},
							{
								label: "next_value ❇️",
								link: "sql/functions/next_value",
							},
							{
								label: "ntile",
								link: "sql/functions/ntile",
							},
							{
								label: "pct ❇️",
								link: "sql/functions/pct",
							},
							{
								label: "pctrank ❇️",
								link: "sql/functions/pctrank",
							},
							{
								label: "pctvariance ❇️ 🚧",
								link: "sql/functions/pctvariance",
							},
							{
								label: "percent_rank",
								link: "sql/functions/percent_rank",
							},
							{
								label: "percentile ❇️",
								link: "sql/functions/percentile",
							},
							{
								label: "percentile_cont",
								link: "sql/functions/percentile_cont",
							},
							{
								label: "percentile_disc",
								link: "sql/functions/percentile_disc",
							},
							{
								label: "previous_value ❇️",
								link: "sql/functions/previous_value",
							},
							{
								label: "quantile ❇️",
								link: "sql/functions/quantile",
							},
							{
								label: "quartile ❇️",
								link: "sql/functions/quartile",
							},
							{
								label: "rank",
								link: "sql/functions/rank",
							},
							{
								label: "row_number",
								link: "sql/functions/row_number",
							},
							{
								label: "runningpct ❇️",
								link: "sql/functions/runningpct",
							},
							{
								label: "runningsum ❇️",
								link: "sql/functions/runningsum",
							},
							{
								label: "single ❇️ 🚧",
								link: "sql/functions/single",
							},
							{
								label: "stdev",
								link: "sql/functions/stdev",
							},
							{
								label: "stdevp",
								link: "sql/functions/stdevp",
							},
							{
								label: "string_agg",
								link: "sql/functions/string_agg",
							},
							{
								label: "sum ❤️",
								link: "sql/functions/sum",
							},
							{
								label: "total ❇️",
								link: "sql/functions/total",
							},
							{
								label: "var",
								link: "sql/functions/var",
							},
							{
								label: "varp",
								link: "sql/functions/varp",
							},
						],
					},
					{
						label: "Funciones de conversión y lógicas",
						collapsed: true,
						items: [
							{
								label: "bighex ❇️ 🚧",
								link: "sql/functions/bighex",
							},
							{
								label: "bigint ❇️ 🚧",
								link: "sql/functions/bigint",
							},
							{
								label: "binary_checksum",
								link: "sql/functions/binary_checksum",
							},
							{
								label: "bit ❇️ 🚧",
								link: "sql/functions/bit",
							},
							{
								label: "cast",
								link: "sql/functions/cast",
							},
							{
								label: "char",
								link: "sql/functions/char",
							},
							{
								label: "choose",
								link: "sql/functions/choose",
							},
							{
								label: "coalesce ❇️ ❤️",
								link: "sql/functions/coalesce",
							},
							{
								label: "convert 🚧",
								link: "sql/functions/convert",
							},
							{
								label: "date ❇️",
								link: "sql/functions/date",
							},
							{
								label: "datetime ❇️ 🚧",
								link: "sql/functions/datetime",
							},
							{
								label: "datetime2 ❇️ 🚧",
								link: "sql/functions/datetime2",
							},
							{
								label: "elementat ❇️",
								link: "sql/functions/elementat",
							},
							{
								label: "emptyifnull ❇️",
								link: "sql/functions/emptyifnull",
							},
							{
								label: "float ❇️ 🚧",
								link: "sql/functions/float",
							},
							{
								label: "hex ❇️ 🚧",
								link: "sql/functions/hex",
							},
							{
								label: "iif",
								link: "sql/functions/iif",
							},
							{
								label: "indexof ❇️",
								link: "sql/functions/indexof",
							},
							{
								label: "int ❇️ 🚧",
								link: "sql/functions/int",
							},
							{
								label: "isnull",
								link: "sql/functions/isnull",
							},
							{
								label: "isnumeric",
								link: "sql/functions/isnumeric",
							},
							{
								label: "nullif 🚧",
								link: "sql/functions/nullif",
							},
							{
								label: "nullifempty ❇️",
								link: "sql/functions/nullifempty",
							},
							{
								label: "nullifzero ❇️",
								link: "sql/functions/nullifzero",
							},
							{
								label: "parse",
								link: "sql/functions/parse",
							},
							{
								label: "smallhex ❇️ 🚧",
								link: "sql/functions/smallhex",
							},
							{
								label: "smallint ❇️ 🚧",
								link: "sql/functions/smallint",
							},
							{
								label: "switch ❇️",
								link: "sql/functions/switch",
							},
							{
								label: "time ❇️ 🚧",
								link: "sql/functions/time",
							},
							{
								label: "tinyhex ❇️ 🚧",
								link: "sql/functions/tinyhex",
							},
							{
								label: "tinyint ❇️ 🚧",
								link: "sql/functions/tinyint",
							},
							{
								label: "try_cast",
								link: "sql/functions/try_cast",
							},
							{
								label: "try_convert",
								link: "sql/functions/try_convert",
							},
							{
								label: "try_parse",
								link: "sql/functions/try_parse",
							},
							{
								label: "uchar ❇️",
								link: "sql/functions/uchar",
							},
							{
								label: "unicodechar ❇️ 🚧",
								link: "sql/functions/unicodechar",
							},
							{
								label: "zeroifnull ❇️",
								link: "sql/functions/zeroifnull",
							},
						],
					},
					{
						label: "Funciones de fecha",
						collapsed: true,
						items: [
							{
								label: "current_date ❇️ 🚧",
								link: "sql/functions/current_date",
							},
							{
								label: "current_time ❇️ 🚧",
								link: "sql/functions/current_time",
							},
							{
								label: "current_timestamp ❇️",
								link: "sql/functions/current_timestamp",
							},
							{
								label: "current_timezone",
								link: "sql/functions/current_timezone",
							},
							{
								label: "current_timezone_id",
								link: "sql/functions/current_timezone_id",
							},
							{
								label: "dateadd",
								link: "sql/functions/dateadd",
							},
							{
								label: "datediff ❇️",
								link: "sql/functions/datediff",
							},
							{
								label: "datediff_big",
								link: "sql/functions/datediff_big",
							},
							{
								label: "datefromparts",
								link: "sql/functions/datefromparts",
							},
							{
								label: "datename ❇️",
								link: "sql/functions/datename",
							},
							{
								label: "datepart ❇️",
								link: "sql/functions/datepart",
							},
							{
								label: "datetime2fromparts",
								link: "sql/functions/datetime2fromparts",
							},
							{
								label: "datetimefromparts",
								link: "sql/functions/datetimefromparts",
							},
							{
								label: "datetimeoffsetfromparts",
								link: "sql/functions/datetimeoffsetfromparts",
							},
							{
								label: "datetrunc",
								link: "sql/functions/datetrunc",
							},
							{
								label: "day",
								link: "sql/functions/day",
							},
							{
								label: "eomonth",
								link: "sql/functions/eomonth",
							},
							{
								label: "getdate ❤️",
								link: "sql/functions/getdate",
							},
							{
								label: "getenddate ❇️ 🚧",
								link: "sql/functions/getenddate",
							},
							{
								label: "getenddatetime ❇️ 🚧",
								link: "sql/functions/getenddatetime",
							},
							{
								label: "getutcdate",
								link: "sql/functions/getutcdate",
							},
							{
								label: "hour ❇️",
								link: "sql/functions/hour",
							},
							{
								label: "isdate",
								link: "sql/functions/isdate",
							},
							{
								label: "isoweek ❇️",
								link: "sql/functions/isoweek",
							},
							{
								label: "isoweekcode ❇️",
								link: "sql/functions/isoweekcode",
							},
							{
								label: "isoweekshortcode ❇️",
								link: "sql/functions/isoweekshortcode",
							},
							{
								label: "isoweekyear ❇️",
								link: "sql/functions/isoweekyear",
							},
							{
								label: "localdate ❇️",
								link: "sql/functions/localdate",
							},
							{
								label: "localdatetimeoffset ❇️",
								link: "sql/functions/localdatetimeoffset",
							},
							{
								label: "month",
								link: "sql/functions/month",
							},
							{
								label: "smalldatetimefromparts",
								link: "sql/functions/smalldatetimefromparts",
							},
							{
								label: "switchoffset",
								link: "sql/functions/switchoffset",
							},
							{
								label: "sysdatetime",
								link: "sql/functions/sysdatetime",
							},
							{
								label: "sysdatetimeoffset",
								link: "sql/functions/sysdatetimeoffset",
							},
							{
								label: "sysutcdatetime",
								link: "sql/functions/sysutcdatetime",
							},
							{
								label: "timefromparts",
								link: "sql/functions/timefromparts",
							},
							{
								label: "todatetimeoffset",
								link: "sql/functions/todatetimeoffset",
							},
							{
								label: "today ❇️",
								link: "sql/functions/today",
							},
							{
								label: "tomorrow ❇️",
								link: "sql/functions/tomorrow",
							},
							{
								label: "year",
								link: "sql/functions/year",
							},
							{
								label: "yyyymmdd ❇️ 🚧",
								link: "sql/functions/yyyymmdd",
							},
						],
					},
					{
						label: "Funciones de texto",
						collapsed: true,
						items: [
							{
								label: "abc ❇️",
								link: "sql/functions/abc",
							},
							{
								label: "ascii",
								link: "sql/functions/ascii",
							},
							{
								label: "charindex",
								link: "sql/functions/charindex",
							},
							{
								label: "compress",
								link: "sql/functions/compress",
							},
							{
								label: "concat ❤️",
								link: "sql/functions/concat",
							},
							{
								label: "decompress",
								link: "sql/functions/decompress",
							},
							{
								label: "difference",
								link: "sql/functions/difference",
							},
							{
								label: "format",
								link: "sql/functions/format",
							},
							{
								label: "hashbytes",
								link: "sql/functions/hashbytes",
							},
							{
								label: "left ❇️ ❤️",
								link: "sql/functions/left",
							},
							{
								label: "len",
								link: "sql/functions/len",
							},
							{
								label: "lower",
								link: "sql/functions/lower",
							},
							{
								label: "ltrim",
								link: "sql/functions/ltrim",
							},
							{
								label: "nchar",
								link: "sql/functions/nchar",
							},
							{
								label: "patindex",
								link: "sql/functions/patindex",
							},
							{
								label: "quotename",
								link: "sql/functions/quotename",
							},
							{
								label: "replace ❤️",
								link: "sql/functions/replace",
							},
							{
								label: "replicate",
								link: "sql/functions/replicate",
							},
							{
								label: "reverse",
								link: "sql/functions/reverse",
							},
							{
								label: "right ❇️",
								link: "sql/functions/right",
							},
							{
								label: "rtrim",
								link: "sql/functions/rtrim",
							},
							{
								label: "soundex",
								link: "sql/functions/soundex",
							},
							{
								label: "str",
								link: "sql/functions/str",
							},
							{
								label: "string_split",
								link: "sql/functions/string_split",
							},
							{
								label: "stuff",
								link: "sql/functions/stuff",
							},
							{
								label: "substring",
								link: "sql/functions/substring",
							},
							{
								label: "trim ❇️",
								link: "sql/functions/trim",
							},
							{
								label: "unicode",
								link: "sql/functions/unicode",
							},
							{
								label: "upper",
								link: "sql/functions/upper",
							},
						],
					},
					{
						label: "Funciones matemáticas",
						collapsed: true,
						items: [
							{
								label: "abs ❤️",
								link: "sql/functions/abs",
							},
							{
								label: "acos",
								link: "sql/functions/acos",
							},
							{
								label: "addition ❇️ ❤️",
								link: "sql/functions/addition",
							},
							{
								label: "asin",
								link: "sql/functions/asin",
							},
							{
								label: "atan",
								link: "sql/functions/atan",
							},
							{
								label: "atn2",
								link: "sql/functions/atn2",
							},
							{
								label: "ceiling",
								link: "sql/functions/ceiling",
							},
							{
								label: "cos",
								link: "sql/functions/cos",
							},
							{
								label: "cot",
								link: "sql/functions/cot",
							},
							{
								label: "degrees",
								link: "sql/functions/degrees",
							},
							{
								label: "divide ❇️",
								link: "sql/functions/divide",
							},
							{
								label: "exp",
								link: "sql/functions/exp",
							},
							{
								label: "floor",
								link: "sql/functions/floor",
							},
							{
								label: "generate_series",
								link: "sql/functions/generate_series",
							},
							{
								label: "greatest",
								link: "sql/functions/greatest",
							},
							{
								label: "log",
								link: "sql/functions/log",
							},
							{
								label: "log10",
								link: "sql/functions/log10",
							},
							{
								label: "margin ❇️",
								link: "sql/functions/margin",
							},
							{
								label: "markup ❇️",
								link: "sql/functions/markup",
							},
							{
								label: "maximum ❇️",
								link: "sql/functions/maximum",
							},
							{
								label: "minimum ❇️",
								link: "sql/functions/minimum",
							},
							{
								label: "mod ❇️",
								link: "sql/functions/mod",
							},
							{
								label: "pi",
								link: "sql/functions/pi",
							},
							{
								label: "power",
								link: "sql/functions/power",
							},
							{
								label: "radians",
								link: "sql/functions/radians",
							},
							{
								label: "rand",
								link: "sql/functions/rand",
							},
							{
								label: "round ❇️ ❤️",
								link: "sql/functions/round",
							},
							{
								label: "sign",
								link: "sql/functions/sign",
							},
							{
								label: "sin",
								link: "sql/functions/sin",
							},
							{
								label: "space",
								link: "sql/functions/space",
							},
							{
								label: "sqrt",
								link: "sql/functions/sqrt",
							},
							{
								label: "square",
								link: "sql/functions/square",
							},
							{
								label: "substraction ❇️",
								link: "sql/functions/substraction",
							},
							{
								label: "tan",
								link: "sql/functions/tan",
							},
						],
					},
					{
						label: "Funciones de sistema",
						collapsed: true,
						items: [
							{
								label: "checksum",
								link: "sql/functions/checksum",
							},
							{
								label: "col_length",
								link: "sql/functions/col_length",
							},
							{
								label: "col_name",
								link: "sql/functions/col_name",
							},
							{
								label: "collationproperty",
								link: "sql/functions/collationproperty",
							},
							{
								label: "columnproperty",
								link: "sql/functions/columnproperty",
							},
							{
								label: "columns_updated",
								link: "sql/functions/columns_updated",
							},
							{
								label: "current_transaction_id",
								link: "sql/functions/current_transaction_id",
							},
							{
								label: "current_user ❇️",
								link: "sql/functions/current_user",
							},
							{
								label: "currentusername ❇️ ❤️",
								link: "sql/functions/currentusername",
							},
							{
								label: "cursor_status",
								link: "sql/functions/cursor_status",
							},
							{
								label: "database_principal_id",
								link: "sql/functions/database_principal_id",
							},
							{
								label: "databaseproperty 🚧",
								link: "sql/functions/databaseproperty",
							},
							{
								label: "databasepropertyex",
								link: "sql/functions/databasepropertyex",
							},
							{
								label: "datalength",
								link: "sql/functions/datalength",
							},
							{
								label: "date_bucket",
								link: "sql/functions/date_bucket",
							},
							{
								label: "db_id",
								link: "sql/functions/db_id",
							},
							{
								label: "db_name",
								link: "sql/functions/db_name",
							},
							{
								label: "error_line",
								link: "sql/functions/error_line",
							},
							{
								label: "error_message",
								link: "sql/functions/error_message",
							},
							{
								label: "error_number",
								link: "sql/functions/error_number",
							},
							{
								label: "error_procedure",
								link: "sql/functions/error_procedure",
							},
							{
								label: "error_severity",
								link: "sql/functions/error_severity",
							},
							{
								label: "error_state",
								link: "sql/functions/error_state",
							},
							{
								label: "file_name",
								link: "sql/functions/file_name",
							},
							{
								label: "filegroup_id",
								link: "sql/functions/filegroup_id",
							},
							{
								label: "filegroup_name",
								link: "sql/functions/filegroup_name",
							},
							{
								label: "filegroupproperty",
								link: "sql/functions/filegroupproperty",
							},
							{
								label: "fileproperty",
								link: "sql/functions/fileproperty",
							},
							{
								label: "formatmessage",
								link: "sql/functions/formatmessage",
							},
							{
								label: "fulltextcatalogproperty",
								link: "sql/functions/fulltextcatalogproperty",
							},
							{
								label: "fulltextserviceproperty",
								link: "sql/functions/fulltextserviceproperty",
							},
							{
								label: "getansinull",
								link: "sql/functions/getansinull",
							},
							{
								label: "has_dbaccess",
								link: "sql/functions/has_dbaccess",
							},
							{
								label: "host_id",
								link: "sql/functions/host_id",
							},
							{
								label: "host_name",
								link: "sql/functions/host_name",
							},
							{
								label: "ident_current",
								link: "sql/functions/ident_current",
							},
							{
								label: "ident_incr",
								link: "sql/functions/ident_incr",
							},
							{
								label: "ident_seed",
								link: "sql/functions/ident_seed",
							},
							{
								label: "identity",
								link: "sql/functions/identity",
							},
							{
								label: "index_col",
								link: "sql/functions/index_col",
							},
							{
								label: "indexproperty",
								link: "sql/functions/indexproperty",
							},
							{
								label: "is_member",
								link: "sql/functions/is_member",
							},
							{
								label: "is_srvrolemember",
								link: "sql/functions/is_srvrolemember",
							},
							{
								label: "ismemberof ❇️",
								link: "sql/functions/ismemberof",
							},
							{
								label: "memberof ❇️",
								link: "sql/functions/memberof",
							},
							{
								label: "newid",
								link: "sql/functions/newid",
							},
							{
								label: "newsequentialid",
								link: "sql/functions/newsequentialid",
							},
							{
								label: "object_id",
								link: "sql/functions/object_id",
							},
							{
								label: "object_name",
								link: "sql/functions/object_name",
							},
							{
								label: "objectproperty",
								link: "sql/functions/objectproperty",
							},
							{
								label: "opendatasource",
								link: "sql/functions/opendatasource",
							},
							{
								label: "openquery",
								link: "sql/functions/openquery",
							},
							{
								label: "openrowset",
								link: "sql/functions/openrowset",
							},
							{
								label: "parsename",
								link: "sql/functions/parsename",
							},
							{
								label: "permissions",
								link: "sql/functions/permissions",
							},
							{
								label: "rowcount_big",
								link: "sql/functions/rowcount_big",
							},
							{
								label: "schema_id",
								link: "sql/functions/schema_id",
							},
							{
								label: "schema_name",
								link: "sql/functions/schema_name",
							},
							{
								label: "scope_identity",
								link: "sql/functions/scope_identity",
							},
							{
								label: "security",
								link: "sql/functions/security",
							},
							{
								label: "serverproperty",
								link: "sql/functions/serverproperty",
							},
							{
								label: "session_user ❇️",
								link: "sql/functions/session_user",
							},
							{
								label: "sessionproperty",
								link: "sql/functions/sessionproperty",
							},
							{
								label: "sql_variant_property",
								link: "sql/functions/sql_variant_property",
							},
							{
								label: "stats_date",
								link: "sql/functions/stats_date",
							},
							{
								label: "suser_id",
								link: "sql/functions/suser_id",
							},
							{
								label: "suser_name",
								link: "sql/functions/suser_name",
							},
							{
								label: "suser_sid",
								link: "sql/functions/suser_sid",
							},
							{
								label: "suser_sname",
								link: "sql/functions/suser_sname",
							},
							{
								label: "system_user ❇️",
								link: "sql/functions/system_user",
							},
							{
								label: "type_name",
								link: "sql/functions/type_name",
							},
							{
								label: "typeproperty",
								link: "sql/functions/typeproperty",
							},
							{
								label: "user_name",
								link: "sql/functions/user_name",
							},
						],
					},
				],
			},
			{
				label: "Vistas",
				collapsed: true,
				items: [
					{
						label: "Vistas de base de datos",
						collapsed: true,
						items: [
							{
								label: "Crono$AnsiColumns",
								link: "sql/views/cronoansicolumns",
							},
							{
								label: "Crono$AnsiForeignKeys",
								link: "sql/views/cronoansiforeignkeys",
							},
							{
								label: "Crono$ColumnExtendedProperties",
								link: "sql/views/cronocolumnextendedproperties",
							},
							{
								label: "Crono$Columns ❤️",
								link: "sql/views/cronocolumns",
							},
							{
								label: "Crono$Constraints",
								link: "sql/views/cronoconstraints",
							},
							{
								label: "Crono$ConstraintsColumns",
								link: "sql/views/cronoconstraintscolumns",
							},
							{
								label: "Crono$DatabaseExtendedProperties",
								link: "sql/views/cronodatabaseextendedproperties",
							},
							{
								label: "Crono$Databases",
								link: "sql/views/cronodatabases",
							},
							{
								label: "Crono$ForeignKeys",
								link: "sql/views/cronoforeignkeys",
							},
							{
								label: "Crono$IndexColumns",
								link: "sql/views/cronoindexcolumns",
							},
							{
								label: "Crono$Indexes",
								link: "sql/views/cronoindexes",
							},
							{
								label: "Crono$Parameters",
								link: "sql/views/cronoparameters",
							},
							{
								label: "Crono$ProcedureExtendedProperties",
								link: "sql/views/cronoprocedureextendedproperties",
							},
							{
								label: "Crono$Procedures ❤️",
								link: "sql/views/cronoprocedures",
							},
							{
								label: "Crono$Routines",
								link: "sql/views/cronoroutines",
							},
							{
								label: "Crono$Schemas",
								link: "sql/views/cronoschemas",
							},
							{
								label: "Crono$TableExtendedProperties",
								link: "sql/views/cronotableextendedproperties",
							},
							{
								label: "Crono$Tables ❤️",
								link: "sql/views/cronotables",
							},
						],
					},
					{
						label: "Vistas de metadata de Crono",
						collapsed: true,
						items: [
							{
								label: "Crono$CronoFunctions",
								link: "sql/views/cronocronofunctions",
							},
							{
								label: "Crono$CronoViews",
								link: "sql/views/cronocronoviews",
							},
							{
								label: "Crono$Emojis",
								link: "sql/views/cronoemojis",
							},
							{
								label: "Crono$Functions",
								link: "sql/views/cronofunctions",
							},
							{
								label: "Crono$Keywords",
								link: "sql/views/cronokeywords",
							},
							{
								label: "Crono$SqlFunctions",
								link: "sql/views/cronosqlfunctions",
							},
							{
								label: "Crono$UnicodeChars",
								link: "sql/views/cronounicodechars",
							},
							{
								label: "Crono$UnicodeTable",
								link: "sql/views/cronounicodetable",
							},
						],
					},
					{
						label: "Vistas de tiempo",
						collapsed: true,
						items: [
							{
								label: "Crono$Dates ❤️",
								link: "sql/views/cronodates",
							},
							{
								label: "Crono$Months",
								link: "sql/views/cronomonths",
							},
							{
								label: "Crono$Weeks",
								link: "sql/views/cronoweeks",
							},
						],
					},
					{
						label: "Vistas del Directorio Activo",
						collapsed: true,
						items: [
							{
								label: "Crono$ActiveDirectoryGroups",
								link: "sql/views/cronoactivedirectorygroups",
							},
							{
								label: "Crono$ActiveDirectoryGroupsOf",
								link: "sql/views/cronoactivedirectorygroupsof",
							},
							{
								label: "Crono$ActiveDirectoryMyGroups",
								link: "sql/views/cronoactivedirectorymygroups",
							},
							{
								label: "Crono$ActiveDirectoryUsers",
								link: "sql/views/cronoactivedirectoryusers",
							},
						],
					},
					{
						label: "Vistas misceláneas",
						collapsed: true,
						items: [
							{
								label: "Crono$Countries",
								link: "sql/views/cronocountries",
							},
							{
								label: "Crono$SpanishCities",
								link: "sql/views/cronospanishcities",
							},
							{
								label: "Crono$SpanishProvinces",
								link: "sql/views/cronospanishprovinces",
							},
							{
								label: "Crono$SpanishRegions",
								link: "sql/views/cronospanishregions",
							},
							{
								label: "Crono$TimeZones",
								link: "sql/views/cronotimezones",
							},
						],
					},
				],
			},
		],
	},
],
		}),
	],
});

// AUTO-GENERADO por scripts/sync-language-data.mjs — NO EDITAR A MANO.
// Fuentes de verdad: crono.org/src/content/docs/etl/**/*.md
// Regenerar con: npm run sync

export interface EtlActionDoc {
  description: string;
  docs: string;
}

export interface EtlPropertyDoc {
  description: string;
  appliesTo: string[];
}

export const ETL_ACTION_DOCS: Record<string, EtlActionDoc> = {
  "BULK TABLE": {
    "description": "La acción `BULK TABLE` realiza una carga masiva de datos desde una tabla de origen a una tabla de destino, que puede estar en una conexión distinta.",
    "docs": "etl/data-movement/bulk-table"
  },
  "COPY FILE": {
    "description": "La acción `COPY FILE` copia un fichero de una ubicación a otra. El origen y el destino pueden ser carpetas o cualquier ubicación de [almacenamiento](/etl/configuration/storage/) definida en el proyecto, en cualquier combinación: de una carpeta local a un bucket de Amazon S3, de Google Cloud Storage a un repositorio de GitHub, etc.",
    "docs": "etl/data-movement/copy-file"
  },
  "EXPORT PARQUET": {
    "description": "La acción `EXPORT PARQUET` exporta el contenido de una tabla o vista a un fichero Parquet. El fichero puede escribirse en una carpeta o en cualquier ubicación de [almacenamiento](/etl/configuration/storage/) definida en el proyecto.",
    "docs": "etl/data-movement/export-parquet"
  },
  "IMPORT PARQUET": {
    "description": "La acción `IMPORT PARQUET` carga el contenido de un fichero Parquet en una tabla de la base de datos. El fichero puede leerse de una carpeta o de cualquier ubicación de [almacenamiento](/etl/configuration/storage/) definida en el proyecto.",
    "docs": "etl/data-movement/import-parquet"
  },
  "WORKFLOW": {
    "description": "La acción `WORKFLOW` ejecuta una sucesión de pasos: cargas de tablas, procedimientos, ficheros de código Crono SQL u otros ficheros `.job`. Es la acción que orquesta un proceso de carga completo, y define qué se ejecuta, en qué orden y qué puede ejecutarse en paralelo.",
    "docs": "etl/orchestration/workflow"
  }
};

export const ETL_ACTION_PROPERTIES: Record<string, string[]> = {
  "BULK TABLE": [
    "source_connection_name",
    "database_name",
    "schema_name",
    "table_name",
    "target_connection_name",
    "target_schema_name",
    "target_table_name",
    "clean_mode",
    "create_if_not_exists",
    "collation",
    "command_timeout",
    "skip_empty_tables",
    "parallel_execution",
    "max_degree_of_parallelism",
    "data"
  ],
  "COPY FILE": [
    "source_location",
    "target_location",
    "data"
  ],
  "EXPORT PARQUET": [
    "source_connection_name",
    "schema_name",
    "table_name",
    "target_location",
    "filename",
    "data"
  ],
  "IMPORT PARQUET": [
    "target_connection_name",
    "source_location",
    "schema_name",
    "table_name",
    "data"
  ],
  "WORKFLOW": []
};

export const ETL_PROPERTY_DOCS: Record<string, EtlPropertyDoc> = {
  "source_connection_name": {
    "description": "Conexión de origen.",
    "appliesTo": [
      "BULK TABLE",
      "EXPORT PARQUET"
    ]
  },
  "database_name": {
    "description": "Base de datos de origen. Si se informa, sustituye a la definida en la conexión.",
    "appliesTo": [
      "BULK TABLE"
    ]
  },
  "schema_name": {
    "description": "Esquema de la tabla de origen.",
    "appliesTo": [
      "BULK TABLE",
      "EXPORT PARQUET",
      "IMPORT PARQUET"
    ]
  },
  "table_name": {
    "description": "Tabla de origen.",
    "appliesTo": [
      "BULK TABLE",
      "EXPORT PARQUET",
      "IMPORT PARQUET"
    ]
  },
  "target_connection_name": {
    "description": "Conexión de destino. Si no se informa, se utiliza la conexión activa.",
    "appliesTo": [
      "BULK TABLE",
      "IMPORT PARQUET"
    ]
  },
  "target_schema_name": {
    "description": "Esquema de la tabla de destino. Por defecto, `staging`.",
    "appliesTo": [
      "BULK TABLE"
    ]
  },
  "target_table_name": {
    "description": "Tabla de destino. Si no se informa, se utiliza el nombre de la tabla de origen.",
    "appliesTo": [
      "BULK TABLE"
    ]
  },
  "clean_mode": {
    "description": "Cómo se vacía la tabla de destino antes de la carga: `Drop`, `Delete` o `Truncate`. Por defecto, `Drop`.",
    "appliesTo": [
      "BULK TABLE"
    ]
  },
  "create_if_not_exists": {
    "description": "`YES`/`NO`. Crea la tabla de destino si no existe. Por defecto, `YES`.",
    "appliesTo": [
      "BULK TABLE"
    ]
  },
  "collation": {
    "description": "Intercalación con la que se leen las columnas de texto cuando el origen es SQL Server. Consulta [Intercalación de las columnas de texto](#intercalación-de-las-columnas-de-texto).",
    "appliesTo": [
      "BULK TABLE"
    ]
  },
  "command_timeout": {
    "description": "Tiempo máximo de ejecución, en segundos. Por defecto, `30`.",
    "appliesTo": [
      "BULK TABLE"
    ]
  },
  "skip_empty_tables": {
    "description": "`YES`/`NO`. Omite las tablas de origen vacías. Por defecto, `NO`.",
    "appliesTo": [
      "BULK TABLE"
    ]
  },
  "parallel_execution": {
    "description": "`YES`/`NO`. Ejecuta en paralelo las cargas definidas mediante `data`. Por defecto, `NO`.",
    "appliesTo": [
      "BULK TABLE"
    ]
  },
  "max_degree_of_parallelism": {
    "description": "Número máximo de cargas simultáneas cuando `parallel_execution` está activo. Por defecto, `10`.",
    "appliesTo": [
      "BULK TABLE"
    ]
  },
  "data": {
    "description": "Consulta que devuelve una fila por cada carga a realizar. Consulta [La propiedad data](/etl/actions/#la-propiedad-data).",
    "appliesTo": [
      "BULK TABLE",
      "COPY FILE",
      "EXPORT PARQUET",
      "IMPORT PARQUET"
    ]
  },
  "source_location": {
    "description": "Ubicación del fichero que se copia, incluido el nombre del fichero.",
    "appliesTo": [
      "COPY FILE",
      "IMPORT PARQUET"
    ]
  },
  "target_location": {
    "description": "Ubicación de destino, incluido el nombre del fichero.",
    "appliesTo": [
      "COPY FILE",
      "EXPORT PARQUET"
    ]
  },
  "filename": {
    "description": "Nombre del fichero Parquet, sin ruta y con su extensión.",
    "appliesTo": [
      "EXPORT PARQUET"
    ]
  }
};

export const AUDIT_HEADER_PROPERTIES: Record<string, string> = {
  "jobname": "Nombre del job. Activa la ejecución auditada.",
  "sendlogto": "Direcciones que reciben el correo de fin de carga, sea cual sea el resultado.",
  "sendsuccesslogto": "Direcciones que reciben el correo solo si la ejecución termina correctamente.",
  "sendfailurelogto": "Direcciones que reciben el correo solo si la ejecución falla.",
  "logcontent": "Texto con el que empieza el cuerpo del correo.",
  "okmark": "Texto que se añade al asunto del correo cuando la ejecución termina correctamente. Por defecto, vacío.",
  "errormark": "Texto que se añade al asunto del correo cuando la ejecución falla. Por defecto, `' (ERROR)'`.",
  "savelog": "`YES`/`NO`. Guarda el log en la carpeta de logs del equipo. Por defecto, `YES`.",
  "savetocalendas": "`YES`/`NO`. Publica el log en Calendas. Por defecto, `YES`.",
  "condition": "Consulta que decide si la acción se ejecuta. Consulta [Ejecución condicional](#ejecución-condicional)."
};

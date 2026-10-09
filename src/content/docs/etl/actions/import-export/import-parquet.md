---
title: "IMPORT PARQUET"
description: "Carga un fichero Parquet en una tabla."
---

La acción `IMPORT PARQUET` carga el contenido de un fichero Parquet en una tabla de la base de datos. El fichero puede leerse de una carpeta o de cualquier ubicación de [almacenamiento](/etl/configuration/storage/) definida en el proyecto.

## Sintaxis

La acción indica qué fichero se importa y en qué tabla se cargan sus datos:

```
[import parquet](
	source_location='filestore://datalake/customers_data.parquet',
	schema_name='staging',
	table_name='customers_data'
)
```

En este ejemplo, el fichero `customers_data.parquet` del almacenamiento `datalake` se carga en la tabla `staging.customers_data` de la conexión activa.

Para cargar el fichero en una conexión distinta de la activa, se informa `target_connection_name`:

```
[import parquet](
	target_connection_name='DWH',
	source_location='filestore://datalake/customers_data.parquet',
	schema_name='staging',
	table_name='customers_data'
)
```

## Propiedades

| Propiedad | Descripción |
| --- | --- |
| `target_connection_name` | Conexión en la que se cargan los datos. Si no se informa, se utiliza la conexión activa. |
| `source_location` | Ubicación del fichero Parquet que se importa, incluido el nombre del fichero. Consulta [Ubicación del fichero](#ubicación-del-fichero). |
| `schema_name` | Esquema de la tabla de destino. |
| `table_name` | Tabla de destino. |
| `data` | Consulta que devuelve una fila por cada importación a realizar. Consulta [La propiedad data](/etl/actions/data-property/). |

Las propiedades `source_location`, `schema_name` y `table_name` son obligatorias y no tienen valor por defecto. Pueden informarse en la acción o, si se utiliza `data`, en las columnas de la consulta.

## Ubicación del fichero

La propiedad `source_location` admite los mismos tipos de valor que la ubicación de destino de [EXPORT PARQUET](/etl/actions/import-export/export-parquet/#ubicación-de-destino), seguidos del nombre del fichero:

| Tipo | Ejemplo |
| --- | --- |
| Almacenamiento | `filestore://datalake/exports/customers_data.parquet` |
| Ruta relativa | `exports/parquet/customers_data.parquet` |
| Ruta absoluta | `C:\exports\customers_data.parquet` |

Se recomienda utilizar siempre un almacenamiento, de modo que el job no contenga rutas ni credenciales.

## Tabla de destino

Si la tabla de destino no existe, Crono ETL la crea a partir de las columnas del fichero. Si ya existe, las filas del fichero se añaden a las que contiene.

:::caution
La acción no vacía la tabla antes de la carga. Si se importa dos veces el mismo fichero en la misma tabla, sus filas quedan duplicadas.
:::

<!-- PENDIENTE: Está previsto añadir clean_mode para vaciar o recrear la tabla antes de la carga, como en BULK TABLE. Cuando exista, documentarlo aquí y revisar el aviso anterior. Ojo: en BigQuery, la carga desde Google Cloud Storage usa LOAD DATA OVERWRITE y hoy reemplaza el contenido de la tabla, a diferencia del resto de casos. -->

## Importación de varios ficheros

Con la propiedad `data`, una sola acción puede importar varios ficheros. La consulta devuelve una fila por fichero, y sus columnas sustituyen a las propiedades del mismo nombre en cada ejecución:

```
[import parquet](
	schema_name='staging',
	[data]=(
		select source_location, table_name
		from audit.parquet_files
	)
)
```

En este ejemplo, cada fichero registrado en `audit.parquet_files` se carga en su tabla del esquema `staging`. Para incorporar un fichero nuevo a la carga basta con añadir una fila, sin modificar el job.

Las columnas de `data` pueden informar cualquier propiedad de la acción, no solo el fichero y la tabla: también la conexión de destino. Las importaciones se ejecutan de una en una, ya que esta acción no admite la propiedad `parallel_execution`.

## Cómo se realiza la carga

Crono ETL no carga los datos mediante sentencias `INSERT` individuales: en cada motor utiliza su mecanismo de carga masiva, para obtener el máximo rendimiento. Cuando ese mecanismo necesita el fichero en un lugar concreto, Crono ETL lo deja allí antes de cargar. Por ejemplo, si el fichero está en un almacenamiento en la nube y el motor solo puede leerlo en local, primero lo descarga a una carpeta temporal del equipo que ejecuta el job.

| Motor de destino | Mecanismo de carga | Lectura del fichero |
| --- | --- | --- |
| SQL Server | `SqlBulkCopy`, la API de carga masiva del cliente de SQL Server | Crono ETL lee el fichero en local y envía las filas al servidor |
| Fabric | `SqlBulkCopy`, igual que en SQL Server | Crono ETL lee el fichero en local y envía las filas al servidor |
| PostgreSQL | `COPY ... FROM STDIN` en formato binario | Crono ETL lee el fichero en local y envía las filas al servidor |
| DuckDB | `COPY ... FROM` en formato Parquet | DuckDB lee directamente el fichero en local |
| BigQuery | `LOAD DATA` si el fichero está en Google Cloud Storage; trabajo de carga de la API de BigQuery en el resto de casos | BigQuery lee el fichero directamente del bucket; en el resto de casos, Crono ETL lo sube con el trabajo de carga |

### BigQuery

Cuando el fichero está en un almacenamiento de Google Cloud Storage, BigQuery lo lee directamente del bucket, sin que los datos pasen por el equipo que ejecuta el job. Para que funcione:

- La cuenta de servicio de la conexión de BigQuery necesita permiso de lectura sobre el bucket, por ejemplo el rol "Visualizador de objetos de Storage".
- El bucket debe estar en una ubicación compatible con la del dataset de destino; por ejemplo, ambos en la Unión Europea.

<!-- PENDIENTE (corregir en Crono ETL): Redshift. Hoy descarga el fichero a local y lo carga con INSERT sucesivos, lo que contradice el párrafo general de esta sección. Por eso no figura en la tabla. Solución prevista: COPY ... FROM 's3://...' FORMAT AS PARQUET con el rol IAM del almacenamiento; si el fichero no está en S3, subirlo antes a un almacenamiento S3 de trabajo. Al corregirlo, añadir la fila y una nota con los requisitos (rol IAM asociado al namespace, permisos de lectura sobre el bucket). -->

<!-- PENDIENTE: Completar la tabla con Databricks y Snowflake, y añadir notas por motor cuando haya requisitos de configuración o limitaciones. A 8/10/2026: SQL Server, Fabric, PostgreSQL, DuckDB y BigQuery validados desde todos los tipos de ubicación; el resto de motores, solo con fichero en ruta absoluta. -->

## Uso junto con EXPORT PARQUET

Combinada con la acción [EXPORT PARQUET](/etl/actions/import-export/export-parquet/), `IMPORT PARQUET` permite mover tablas de gran volumen entre motores distintos: la tabla se exporta a un fichero Parquet desde la conexión de origen y ese fichero se importa en la conexión de destino. Es la alternativa recomendada a [BULK TABLE](/etl/actions/import-export/bulk-table/#compatibilidad-con-los-motores-de-destino) cuando el motor de destino no dispone de carga masiva nativa.

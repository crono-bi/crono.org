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
| Redshift | `COPY ... FROM 's3://...' FORMAT AS PARQUET` | Redshift lee el fichero directamente del bucket de S3; si el fichero está en otra ubicación, Crono ETL lo sube antes al almacenamiento intermedio de la conexión |
| Snowflake | `PUT` al stage interno del usuario y `COPY INTO` en formato Parquet | Crono ETL lee el fichero en local y lo sube al almacenamiento interno de Snowflake |

### BigQuery

Cuando el fichero está en un almacenamiento de Google Cloud Storage, BigQuery lo lee directamente del bucket, sin que los datos pasen por el equipo que ejecuta el job. Para que funcione:

- La cuenta de servicio de la conexión de BigQuery necesita permiso de lectura sobre el bucket, por ejemplo el rol "Visualizador de objetos de Storage".
- El bucket debe estar en una ubicación compatible con la del dataset de destino; por ejemplo, ambos en la Unión Europea.

### Redshift

Redshift solo carga ficheros Parquet desde Amazon S3, así que la carga se resuelve siempre con una sentencia `COPY` que lee el fichero de un bucket:

- Si el fichero está en un almacenamiento de S3, Redshift lo lee directamente de ese bucket, sin que los datos pasen por el equipo que ejecuta el job.
- Si el fichero está en cualquier otra ubicación (una carpeta local, Google Cloud Storage...), Crono ETL lo copia primero a la carpeta `tmp` del **almacenamiento intermedio** configurado en la conexión de Redshift, que debe ser un almacenamiento de S3. Si la conexión no tiene almacenamiento intermedio, la acción termina con error.

Redshift accede al bucket con un rol IAM, no con las credenciales de la conexión ni con las del almacenamiento. El rol se indica en la conexión de Redshift; si no se informa, se utiliza el rol por defecto del clúster o del namespace (`IAM_ROLE default`). Para que la carga funcione:

- El rol debe estar asociado al clúster o al namespace de Redshift Serverless.
- El rol necesita los permisos `s3:ListBucket` y `s3:GetObject` sobre el bucket del fichero o, en su caso, sobre el del almacenamiento intermedio.
- El bucket debe estar en la misma región de AWS que Redshift.

Redshift asigna las columnas del fichero a las de la tabla por posición, no por nombre: la tabla debe tener las mismas columnas que el fichero, en el mismo orden y con tipos compatibles.

<!-- PENDIENTE (corregir en Crono ETL): Redshift no crea la tabla de destino si no existe; COPY requiere que exista y Redshift no deduce el esquema del Parquet, por lo que hoy la carga falla. Solución prevista: comprobar si la tabla existe y, solo si no, leer el esquema del fichero (descargándolo o leyendo el pie con peticiones por rango) y llamar a CreateTableIfNotExists antes del COPY. Hasta entonces, lo dicho en "Tabla de destino" no se cumple en Redshift. Revisar también: el fichero copiado al almacenamiento intermedio no se borra (deleteOnFinish nunca se pone a True), y si StagingFileStoreName no coincide se usa el primer almacenamiento S3 (provisional). -->

### Snowflake

Snowflake no necesita ninguna configuración adicional: no hace falta un bucket propio, ni un rol IAM, ni una integración de almacenamiento. Crono ETL sube el fichero con `PUT` al stage interno del usuario de la conexión, un espacio de almacenamiento que Snowflake incluye para cada usuario, y lo carga desde allí con `COPY INTO`. Al terminar, el fichero se elimina del stage.

Si el fichero está en un almacenamiento en la nube, Crono ETL lo descarga primero a una carpeta temporal y lo sube desde allí, de modo que los datos pasan por el equipo que ejecuta el job.

Las columnas del fichero se asignan a las de la tabla por nombre, sin distinguir mayúsculas de minúsculas, así que el orden de las columnas en la tabla no importa.

<!-- PENDIENTE (revisar en Crono ETL): el REMOVE del stage y el borrado del temporal local se ejecutan solo si la carga termina bien (decisión consciente: si falla, los ficheros quedan para revisarlos o reintentar a mano). Los restos de cargas fallidas se acumulan en @~/crono/ y en la carpeta temporal; se pueden limpiar con REMOVE @~/crono/. Optimización futura, si hay casos reales: con una storage integration en la conexión y el fichero en S3, COPY directo desde el bucket sin pasar por el equipo del job. El campo "Integración Snowflake" del almacenamiento queda sin uso. -->

<!-- PENDIENTE: Completar la tabla con Databricks y añadir su nota si tiene requisitos de configuración o limitaciones. A 10/10/2026: SQL Server, Fabric, PostgreSQL, DuckDB, BigQuery, Redshift y Snowflake validados desde todos los tipos de ubicación; Databricks, solo con fichero en ruta absoluta. -->

## Uso junto con EXPORT PARQUET

Combinada con la acción [EXPORT PARQUET](/etl/actions/import-export/export-parquet/), `IMPORT PARQUET` permite mover tablas de gran volumen entre motores distintos: la tabla se exporta a un fichero Parquet desde la conexión de origen y ese fichero se importa en la conexión de destino. Es la alternativa recomendada a [BULK TABLE](/etl/actions/import-export/bulk-table/#compatibilidad-con-los-motores-de-destino) cuando el motor de destino no dispone de carga masiva nativa.

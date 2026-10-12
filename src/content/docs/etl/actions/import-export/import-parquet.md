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

Se recomienda utilizar siempre un almacenamiento, de modo que la acción no contenga rutas ni credenciales.

## Tabla de destino

Antes de cargar el fichero, Crono ETL prepara la tabla de destino:

- Si la tabla ya existe, se vacía. El contenido de la tabla tras la carga es, por tanto, exactamente el del fichero, y la importación puede repetirse sin duplicar filas.
- Si la tabla no existe, se crea a partir de las columnas y los tipos del fichero.

En BigQuery, la tabla no se crea previamente: la crea el propio motor durante la carga, a partir del fichero. Así se evita descargar el fichero solo para leer su estructura. Los tipos de las columnas los decide BigQuery, por lo que pueden diferir ligeramente de los que asignaría Crono ETL; por ejemplo, una fecha y hora en UTC puede llegar como `TIMESTAMP` en lugar de `DATETIME`.

:::caution
Como la tabla se vacía en cada importación, no es posible acumular varios ficheros en una misma tabla: si varias importaciones apuntan a la misma tabla, solo se conservan las filas del último fichero.
:::

<!-- PENDIENTE: Está previsto añadir clean_mode (Drop/Delete/Truncate, y probablemente un modo que no vacíe la tabla), como en BULK TABLE. Cuando exista, documentarlo aquí y revisar el aviso anterior. Hoy se ejecuta siempre TRUNCATE TABLE. -->

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

En este ejemplo, cada fichero registrado en `audit.parquet_files` se carga en su tabla del esquema `staging`. Para incorporar un fichero nuevo a la carga basta con añadir una fila, sin modificar la acción. Cada fila debe apuntar a una tabla distinta, ya que cada importación vacía la tabla de destino antes de cargarla.

Las columnas de `data` pueden informar cualquier propiedad de la acción, no solo el fichero y la tabla: también la conexión de destino. Las importaciones se ejecutan de una en una, ya que esta acción no admite la propiedad `parallel_execution`.

## Cómo se realiza la carga

Crono ETL no carga los datos mediante sentencias `INSERT` individuales: en cada motor utiliza su mecanismo de carga masiva, para obtener el máximo rendimiento. Cuando ese mecanismo necesita el fichero en un lugar concreto, Crono ETL lo deja allí antes de cargar. Por ejemplo, si el fichero está en un almacenamiento en la nube y el motor solo puede leerlo en local, primero lo descarga a una carpeta temporal del equipo que ejecuta Crono ETL.

| Motor de destino | Mecanismo de carga | Lectura del fichero |
| --- | --- | --- |
| SQL Server | `SqlBulkCopy`, la API de carga masiva del cliente de SQL Server | Crono ETL lee el fichero en local y envía las filas al servidor |
| Fabric | `SqlBulkCopy`, igual que en SQL Server | Crono ETL lee el fichero en local y envía las filas al servidor |
| PostgreSQL | `COPY ... FROM STDIN` en formato binario | Crono ETL lee el fichero en local y envía las filas al servidor |
| DuckDB | `COPY ... FROM` en formato Parquet | DuckDB lee directamente el fichero en local |
| BigQuery | `LOAD DATA` si el fichero está en Google Cloud Storage; trabajo de carga de la API de BigQuery en el resto de casos | BigQuery lee el fichero directamente del bucket; en el resto de casos, Crono ETL lo sube con el trabajo de carga |
| Redshift | `COPY ... FROM 's3://...' FORMAT AS PARQUET` | Redshift lee el fichero directamente del bucket de S3; si el fichero está en otra ubicación, Crono ETL lo sube antes al almacenamiento intermedio de la conexión |
| Snowflake | `PUT` al stage interno del usuario y `COPY INTO` en formato Parquet | Crono ETL lee el fichero en local y lo sube al almacenamiento interno de Snowflake |
| Databricks | `COPY INTO` en formato Parquet desde un volumen de Unity Catalog | Crono ETL lee el fichero en local y lo sube al volumen intermedio de la conexión |

### BigQuery

Cuando el fichero está en un almacenamiento de Google Cloud Storage, BigQuery lo lee directamente del bucket, sin que los datos pasen por el equipo que ejecuta Crono ETL. Para que funcione:

- La cuenta de servicio de la conexión de BigQuery necesita permiso de lectura sobre el bucket, por ejemplo el rol "Visualizador de objetos de Storage".
- El bucket debe estar en una ubicación compatible con la del dataset de destino; por ejemplo, ambos en la Unión Europea.

### Redshift

Redshift solo carga ficheros Parquet desde Amazon S3, así que la carga se resuelve siempre con una sentencia `COPY` que lee el fichero de un bucket:

- Si el fichero está en un almacenamiento de S3, Redshift lo lee directamente de ese bucket, sin que los datos pasen por el equipo que ejecuta Crono ETL.
- Si el fichero está en cualquier otra ubicación (una carpeta local, Google Cloud Storage...), Crono ETL lo copia primero a una carpeta temporal del **almacenamiento intermedio** (`crono/aaaamm/aaaammdd-xxxxxxxx/`) configurado en la conexión de Redshift, que debe ser un almacenamiento de S3. Si la conexión no tiene almacenamiento intermedio, la acción termina con error.

Redshift accede al bucket con un rol IAM, no con las credenciales de la conexión ni con las del almacenamiento. El rol se indica en la conexión de Redshift; si no se informa, se utiliza el rol por defecto del clúster o del namespace (`IAM_ROLE default`). Para que la carga funcione:

- El rol debe estar asociado al clúster o al namespace de Redshift Serverless.
- El rol necesita los permisos `s3:ListBucket` y `s3:GetObject` sobre el bucket del fichero o, en su caso, sobre el del almacenamiento intermedio.
- El bucket debe estar en la misma región de AWS que Redshift.

Redshift asigna las columnas del fichero a las de la tabla por posición, no por nombre: la tabla debe tener las mismas columnas que el fichero, en el mismo orden y con tipos compatibles.

### Snowflake

Snowflake no necesita ninguna configuración adicional: no hace falta un bucket propio, ni un rol IAM, ni una integración de almacenamiento. Crono ETL sube el fichero con `PUT` al stage interno del usuario de la conexión, un espacio de almacenamiento que Snowflake incluye para cada usuario, y lo carga desde allí con `COPY INTO`. Al terminar, el fichero se elimina del stage.

Si el fichero está en un almacenamiento en la nube, Crono ETL lo descarga primero a una carpeta temporal y lo sube desde allí, de modo que los datos pasan por el equipo que ejecuta Crono ETL.

Las columnas del fichero se asignan a las de la tabla por nombre, sin distinguir mayúsculas de minúsculas, así que el orden de las columnas en la tabla no importa.

<!-- PENDIENTE (revisar en Crono ETL): el REMOVE del stage solo se ejecuta si la carga termina bien (decisión consciente: si falla, el fichero queda para revisarlo o reintentar a mano); el temporal local se borra siempre. Los restos de cargas fallidas se acumulan en @~/crono/; se pueden limpiar con REMOVE @~/crono/. Optimización futura, si hay casos reales: con una storage integration en la conexión y el fichero en S3, COPY directo desde el bucket sin pasar por el equipo que ejecuta Crono ETL. El campo "Integración Snowflake" del almacenamiento queda sin uso. -->

### Databricks

Databricks carga los ficheros desde un volumen de Unity Catalog. Crono ETL sube el fichero a una carpeta temporal del **volumen intermedio** de la conexión, lo carga con `COPY INTO` y lo elimina al terminar. Si el fichero está en un almacenamiento en la nube, Crono ETL lo descarga primero a una carpeta temporal y lo sube desde allí.

El volumen intermedio es necesario para esta acción y se indica en la conexión de Databricks como la ruta de un volumen existente, por ejemplo `/Volumes/crono/staging/crono_staging`. Para que la carga funcione:

- El workspace debe usar Unity Catalog.
- El usuario de la conexión necesita los permisos `READ VOLUME` y `WRITE VOLUME` sobre el volumen.
- Cada fichero puede ocupar como máximo 5 GB.

Para crear el volumen se puede usar el enlace **Crear volumen intermedio (si no existe)** del formulario de la [conexión](/etl/configuration/connections/#databricks) o una sentencia como esta, ejecutada en ambos casos por un usuario con permiso `CREATE VOLUME` sobre el esquema:

```sql
CREATE VOLUME IF NOT EXISTS crono.staging.crono_staging;
```

Las columnas del fichero se asignan a las de la tabla por nombre, así que el orden de las columnas en la tabla no importa.

<!-- PENDIENTE (revisar en Crono ETL): el REMOVE del fichero del volumen solo se ejecuta si la carga termina bien (como en Snowflake); el temporal local se borra siempre. El REMOVE borra el fichero pero deja vacía la carpeta aaaamm/fecha-hex. La conexión de Databricks no usa la entidad Credentials para el token. Optimización futura: COPY directo desde S3/ADLS con una external location. Ficheros de más de 5 GB: subida por partes. -->

<!-- PENDIENTE: A 11/10/2026 todos los motores validados desde todos los tipos de ubicación, sin INSERT individuales. -->

## Uso junto con EXPORT PARQUET

Combinada con la acción [EXPORT PARQUET](/etl/actions/import-export/export-parquet/), `IMPORT PARQUET` permite mover tablas de gran volumen entre motores distintos: la tabla se exporta a un fichero Parquet desde la conexión de origen y ese fichero se importa en la conexión de destino. Es la alternativa recomendada a [BULK TABLE](/etl/actions/import-export/bulk-table/#compatibilidad-con-los-motores-de-destino) cuando el motor de destino no dispone de carga masiva nativa.

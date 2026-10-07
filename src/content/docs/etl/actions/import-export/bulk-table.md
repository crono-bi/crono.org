---
title: "BULK TABLE"
description: "Carga masiva de una tabla de origen en una tabla de destino."
---

La acción `BULK TABLE` realiza una carga masiva de datos desde una tabla de origen a una tabla de destino, que puede estar en una conexión distinta.

## Sintaxis

En su forma básica, la acción indica la tabla de origen y la tabla de destino:

```
[bulk table](
	source_connection_name='ERP_SOURCE',
	schema_name='imp',
	table_name='customers_data',
	target_connection_name='DWH',
	target_schema_name='staging',
	target_table_name='customers_data'
)
```

Algunas propiedades pueden omitirse:

- Si no se informa `target_table_name`, la tabla de destino recibe el mismo nombre que la tabla de origen.
- Si no se informa `target_schema_name`, la tabla de destino se crea en el esquema `staging`.
- Si no se informa `target_connection_name`, se utiliza la conexión activa.

Así, si la conexión activa es la del DWH, la siguiente acción es equivalente a la anterior y copia la tabla `customers_data` al esquema `staging`:

```
[bulk table](
	source_connection_name='ERP_SOURCE',
	schema_name='imp',
	table_name='customers_data'
)
```

## Propiedades

| Propiedad | Descripción |
| --- | --- |
| `source_connection_name` | Conexión de origen. |
| `database_name` | Base de datos de origen. Si se informa, sustituye a la definida en la conexión. |
| `schema_name` | Esquema de la tabla de origen. |
| `table_name` | Tabla de origen. |
| `target_connection_name` | Conexión de destino. Si no se informa, se utiliza la conexión activa. |
| `target_schema_name` | Esquema de la tabla de destino. Por defecto, `staging`. |
| `target_table_name` | Tabla de destino. Si no se informa, se utiliza el nombre de la tabla de origen. |
| `clean_mode` | Cómo se vacía la tabla de destino antes de la carga: `Drop`, `Delete` o `Truncate`. Por defecto, `Drop`. |
| `create_if_not_exists` | `YES`/`NO`. Crea la tabla de destino si no existe. Por defecto, `YES`. |
| `collation` | Intercalación con la que se leen las columnas de texto cuando el origen es SQL Server. Consulta [Intercalación de las columnas de texto](#intercalación-de-las-columnas-de-texto). |
| `command_timeout` | Tiempo máximo de ejecución, en segundos. Por defecto, `30`. |
| `skip_empty_tables` | `YES`/`NO`. Omite las tablas de origen vacías. Por defecto, `NO`. |
| `parallel_execution` | `YES`/`NO`. Ejecuta en paralelo las cargas definidas mediante `data`. Por defecto, `NO`. |
| `max_degree_of_parallelism` | Número máximo de cargas simultáneas cuando `parallel_execution` está activo. Por defecto, `10`. |
| `data` | Consulta que devuelve una fila por cada carga a realizar. Consulta [La propiedad data](/etl/actions/data-property/). |

<!-- PENDIENTE: target_schema_name. Indicar si el esquema de destino debe existir antes de la carga o si Crono ETL lo crea. -->

<!-- PENDIENTE: clean_mode y create_if_not_exists. Explicar cómo se combinan: qué aporta create_if_not_exists cuando clean_mode es Drop, qué ocurre con Drop y create_if_not_exists=NO, y si existe algún modo de añadir filas sin vaciar la tabla. -->

<!-- PENDIENTE: command_timeout. Aclarar a qué se aplica el límite (lectura del origen, cada lote o la carga completa) y si conviene aumentarlo en tablas grandes. -->

## Carga de varias tablas

Uno de los usos más habituales de `BULK TABLE` es replicar en el DWH un conjunto amplio de tablas de origen. Con la propiedad `data`, una sola acción puede cargar decenas o centenares de tablas. La consulta devuelve una fila por tabla, y sus columnas sustituyen a las propiedades del mismo nombre en cada ejecución:

```
[bulk table](
	source_connection_name='ERP_SOURCE',
	target_schema_name='staging',
	parallel_execution=YES,
	[data]=(
		select schema_name, table_name
		from audit.source_tables
	)
)
```

En este ejemplo, todas las tablas registradas en `audit.source_tables` se copian al esquema `staging`. Al estar activada `parallel_execution`, las cargas se ejecutan en paralelo, con un máximo de 10 simultáneas (el valor por defecto de `max_degree_of_parallelism`).

La lista de tablas no está en el código: se mantiene como metadatos en una tabla (`audit.source_tables`). Para incorporar una tabla nueva a la carga basta con añadir una fila, sin modificar el job.

Las columnas de `data` pueden informar cualquier propiedad de la acción, no solo la tabla de origen: también la conexión de destino o la intercalación.

<!-- PENDIENTE: Indicar qué ocurre si una de las cargas falla: si las demás continúan o se interrumpe la acción, y si el comportamiento cambia con parallel_execution. -->

## Tabla de destino

Si la tabla de destino no existe, Crono ETL la crea a partir de las columnas leídas en el origen. El objetivo es replicar los datos de origen: el tipo de cada columna lo decide Crono ETL según el motor de destino.

:::caution
Con el modo `Drop`, el valor por defecto de `clean_mode`, la tabla de destino se elimina y se vuelve a crear en cada carga. Se pierden, por tanto, los permisos concedidos sobre ella y cualquier índice o ajuste añadido manualmente. Para conservarlos, se recomienda utilizar `Delete` o `Truncate`.
:::

:::note
En Redshift y Fabric, la longitud de las columnas de texto se mide en bytes, no en caracteres. Un valor con acentos u otros caracteres no ASCII que ocupe toda la longitud de la columna en origen puede no caber en la columna de destino.
:::

<!-- PENDIENTE: Revisar las dos notas anteriores (redactadas a partir de las pruebas, no del código) y añadir, si procede, las conversiones de tipo que el usuario vaya a notar; por ejemplo, cómo llegan las columnas de fecha a cada motor. -->

## Intercalación de las columnas de texto

Cuando el origen es SQL Server y el destino es SQL Server o Fabric, la carga puede fallar si la intercalación de las columnas de texto de origen no coincide con la del destino. El error es similar a este:

```
El id de configuración regional '3082' de la columna de origen 'last_name' y el id de configuración regional '1033' de la columna de destino 'last_name' no coinciden.
```

Es el caso habitual al cargar en Fabric desde un SQL Server con intercalación española. Para evitarlo, se informa en `collation` una intercalación compatible con la del destino:

```
[bulk table](
	source_connection_name='ERP_SOURCE',
	schema_name='imp',
	table_name='customers_data',
	target_connection_name='FABRIC',
	target_schema_name='staging',
	collation='Latin1_General_CI_AS'
)
```

Crono ETL lee entonces las columnas de texto del origen con esa intercalación y deja el resto de columnas sin cambios. La propiedad solo tiene efecto cuando el origen es SQL Server.

## Compatibilidad con los motores de destino

Crono ETL no dispone de carga masiva nativa para todos los motores de destino. Cuando no la hay, `BULK TABLE` sigue funcionando, pero inserta los registros mediante sentencias `INSERT` sucesivas. El resultado es el mismo, aunque el rendimiento es considerablemente inferior y se degrada a medida que crece el volumen de datos.

| Motor de destino | Carga masiva nativa |
| --- | --- |
| SQL Server | Sí |
| Fabric | Sí |
| PostgreSQL | Sí |
| BigQuery | No |
| Databricks | No |
| DuckDB | No |
| Redshift | No |
| Snowflake | No |

Cuando la carga se realiza mediante sentencias `INSERT`, el registro de ejecución lo indica con el siguiente aviso:

```
WARNING: Este motor no soporta carga masiva; se insertará fila a fila.
```

:::caution
Si el motor de destino no admite carga masiva nativa, se recomienda utilizar `BULK TABLE` únicamente con tablas de tamaño reducido.
:::

<!-- PENDIENTE: Cuantificar "tamaño reducido" con un orden de magnitud (número de filas) e indicar qué motores pueden utilizarse como origen. -->

Para tablas de mayor volumen, la alternativa recomendada es realizar la carga en dos pasos a través de un fichero Parquet intermedio:

1. Exportar la tabla de origen a un fichero Parquet en una ubicación de [almacenamiento](/etl/configuration/storage/), mediante la acción [EXPORT PARQUET](/etl/actions/import-export/export-parquet/).
2. Cargar ese fichero en la tabla de destino mediante la acción [IMPORT PARQUET](/etl/actions/import-export/import-parquet/).

Estos motores están optimizados para la lectura de ficheros Parquet, por lo que este procedimiento resulta mucho más eficiente que la inserción fila a fila.

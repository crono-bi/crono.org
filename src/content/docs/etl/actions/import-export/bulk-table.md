---
title: "BULK TABLE"
description: "Carga masiva de una tabla de origen en una tabla de destino."
---

La acción `BULK TABLE` realiza una carga masiva de datos desde una tabla de origen a una tabla de destino, que puede estar en una conexión distinta.

## Sintaxis

En su forma básica, la acción indica la tabla de origen y la tabla de destino:

```
[bulk table](
	SourceConnectionName='ERP_SOURCE',
	SchemaName='imp',
	TableName='customers_data',
	TargetConnectionName='DWH',
	TargetSchemaName='staging',
	TargetTableName='customers_data'
)
```

Algunas propiedades pueden omitirse:

- Si no se informa `TargetTableName`, la tabla de destino recibe el mismo nombre que la tabla de origen.
- Si no se informa `TargetSchemaName`, la tabla de destino se crea en el esquema `staging`.
- Si no se informa `TargetConnectionName`, se utiliza la conexión activa.

Así, si la conexión activa es la del DWH, la siguiente acción es equivalente a la anterior y copia la tabla `customers_data` al esquema `staging`:

```
[bulk table](
	SourceConnectionName='ERP_SOURCE',
	SchemaName='imp',
	TableName='customers_data'
)
```

## Propiedades

| Propiedad | Descripción |
| --- | --- |
| `SourceConnectionName` | Conexión de origen. |
| `DatabaseName` | Base de datos de origen. Si se informa, sustituye a la definida en la conexión. |
| `SchemaName` | Esquema de la tabla de origen. |
| `TableName` | Tabla de origen. |
| `TargetConnectionName` | Conexión de destino. Si no se informa, se utiliza la conexión activa. |
| `TargetSchemaName` | Esquema de la tabla de destino. Por defecto, `staging`. |
| `TargetTableName` | Tabla de destino. Si no se informa, se utiliza el nombre de la tabla de origen. |
| `CleanMode` | Cómo se vacía la tabla de destino antes de la carga: `Drop`, `Delete` o `Truncate`. Por defecto, `Drop`. |
| `CreateIfNotExists` | `YES`/`NO`. Crea la tabla de destino si no existe. Por defecto, `YES`. |
| `Collation` | Intercalación con la que se leen las columnas de texto cuando el origen es SQL Server. Consulta [Intercalación de las columnas de texto](#intercalación-de-las-columnas-de-texto). |
| `CommandTimeout` | Tiempo máximo de ejecución, en segundos. Por defecto, `30`. |
| `SkipEmptyTables` | `YES`/`NO`. Omite las tablas de origen vacías. Por defecto, `NO`. |
| `ParallelExecution` | `YES`/`NO`. Ejecuta en paralelo las cargas definidas mediante `Data`. Por defecto, `NO`. |
| `MaxDegreeOfParallelism` | Número máximo de cargas simultáneas cuando `ParallelExecution` está activo. Por defecto, `10`. |
| `Data` | Consulta que devuelve una fila por cada carga a realizar. Consulta [La propiedad Data](/etl/actions/data-property/). |

<!-- PENDIENTE: TargetSchemaName. Indicar si el esquema de destino debe existir antes de la carga o si Crono ETL lo crea. -->

<!-- PENDIENTE: CleanMode y CreateIfNotExists. Explicar cómo se combinan: qué aporta CreateIfNotExists cuando CleanMode es Drop, qué ocurre con Drop y CreateIfNotExists=NO, y si existe algún modo de añadir filas sin vaciar la tabla. -->

<!-- PENDIENTE: CommandTimeout. Aclarar a qué se aplica el límite (lectura del origen, cada lote o la carga completa) y si conviene aumentarlo en tablas grandes. -->

## Carga de varias tablas

Uno de los usos más habituales de `BULK TABLE` es replicar en el DWH un conjunto amplio de tablas de origen. Con la propiedad `Data`, una sola acción puede cargar decenas o centenares de tablas. La consulta devuelve una fila por tabla, y sus columnas sustituyen a las propiedades del mismo nombre en cada ejecución:

```
[bulk table](
	SourceConnectionName='ERP_SOURCE',
	TargetSchemaName='staging',
	ParallelExecution=YES,
	[Data]=(
		select schema_name as SchemaName, table_name as TableName
		from audit.source_tables
	)
)
```

En este ejemplo, todas las tablas registradas en `audit.source_tables` se copian al esquema `staging`. Al estar activada `ParallelExecution`, las cargas se ejecutan en paralelo, con un máximo de 10 simultáneas (el valor por defecto de `MaxDegreeOfParallelism`).

La lista de tablas no está en el código: se mantiene como metadatos en una tabla (`audit.source_tables`). Para incorporar una tabla nueva a la carga basta con añadir una fila, sin modificar el job.

<!-- PENDIENTE: Indicar qué ocurre si una de las cargas falla: si las demás continúan o se interrumpe la acción, y si el comportamiento cambia con ParallelExecution. -->

## Carga en varios destinos

Las columnas de `Data` no se limitan a las propiedades del origen: también pueden informar la conexión de destino o cualquier otra propiedad que deba variar de una carga a otra. En el siguiente ejemplo, la consulta recorre las conexiones del proyecto mediante la vista `crono.connections` y copia la misma tabla a cada una de ellas:

```
[bulk table](
	SourceConnectionName='ERP_SOURCE',
	SchemaName='imp',
	TableName='customers_data',
	TargetSchemaName='staging',
	[Data]=(
		select connection_name as TargetConnectionName,
			if(connection_name='FABRIC', 'Latin1_General_CI_AS') as Collation
		from crono.connections
		where connection_name<>'ERP_SOURCE'
		order by TargetConnectionName
	)
)
```

La consulta devuelve una fila por conexión, de modo que la acción se ejecuta una vez por cada destino, en el orden indicado. La función `if` solo devuelve una intercalación para la conexión `FABRIC`; en el resto de filas la columna `Collation` queda a nulo, lo que equivale a no informar la propiedad.

Para incorporar un destino nuevo basta con definir su conexión, sin modificar el job.

## Tabla de destino

Si la tabla de destino no existe, Crono ETL la crea a partir de las columnas leídas en el origen. El objetivo es replicar los datos de origen: el tipo de cada columna lo decide Crono ETL según el motor de destino.

:::caution
Con el modo `Drop`, el valor por defecto de `CleanMode`, la tabla de destino se elimina y se vuelve a crear en cada carga. Se pierden, por tanto, los permisos concedidos sobre ella y cualquier índice o ajuste añadido manualmente. Para conservarlos, se recomienda utilizar `Delete` o `Truncate`.
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

Es el caso habitual al cargar en Fabric desde un SQL Server con intercalación española. Para evitarlo, se informa en `Collation` una intercalación compatible con la del destino:

```
[bulk table](
	SourceConnectionName='ERP_SOURCE',
	SchemaName='imp',
	TableName='customers_data',
	TargetConnectionName='FABRIC',
	TargetSchemaName='staging',
	Collation='Latin1_General_CI_AS'
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

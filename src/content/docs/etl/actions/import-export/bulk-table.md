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
- Si no se informa `TargetConnectionName`, se utiliza la conexión activa.

Así, si la conexión activa es la del DWH, la siguiente acción es equivalente a la anterior y copia la tabla `customers_data` al esquema `staging`:

```
[bulk table](
	SourceConnectionName='ERP_SOURCE',
	SchemaName='imp',
	TableName='customers_data',
	TargetSchemaName='staging'
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
| `TargetSchemaName` | Esquema de la tabla de destino. |
| `TargetTableName` | Tabla de destino. Si no se informa, se utiliza el nombre de la tabla de origen. |
| `CleanMode` | Cómo se vacía la tabla de destino antes de la carga: `Drop`, `Delete` o `Truncate`. Por defecto, `Drop`. |
| `CreateIfNotExists` | `YES`/`NO`. Crea la tabla de destino si no existe. Por defecto, `YES`. |
| `Collation` | Si se informa y el origen es SQL Server, las columnas de texto se leen con esta intercalación. |
| `CommandTimeout` | Tiempo máximo de ejecución, en segundos. Por defecto, `30`. |
| `SkipEmptyTables` | `YES`/`NO`. Omite las tablas de origen vacías. Por defecto, `NO`. |
| `ParallelExecution` | `YES`/`NO`. Ejecuta en paralelo las cargas definidas mediante `Data`. Por defecto, `NO`. |
| `MaxDegreeOfParallelism` | Número máximo de cargas simultáneas cuando `ParallelExecution` está activo. Por defecto, `10`. |
| `Data` | Consulta que devuelve una fila por cada carga a realizar. Consulta [La propiedad Data](/etl/actions/data-property/). |

## Carga de varias tablas

Uno de los usos más habituales de `BULK TABLE` es replicar en el DWH un conjunto amplio de tablas de origen. Con la propiedad `Data`, una sola acción puede cargar decenas o centenares de tablas. La consulta devuelve una fila por tabla, y sus columnas sustituyen a las propiedades del mismo nombre en cada ejecución:

```
[bulk table](
	SourceConnectionName='ERP_SOURCE',
	TargetSchemaName='staging',
	ParallelExecution=YES,
	[Data]=(
		select schema as SchemaName, sourceTable as TableName
		from audit.source_tables
	)
)
```

En este ejemplo, todas las tablas registradas en `audit.source_tables` se copian al esquema `staging`. Al estar activada `ParallelExecution`, las cargas se ejecutan en paralelo, con un máximo de 10 simultáneas (el valor por defecto de `MaxDegreeOfParallelism`).

Estas pocas líneas sustituyen a lo que en una herramienta ETL tradicional exigiría un bucle, variables y control de errores, o bien un flujo de carga por cada tabla. El código declara qué se quiere hacer, no cómo hacerlo, y la lista de tablas no está en el código: se mantiene como metadatos en una tabla (`audit.source_tables`). Para incorporar una tabla nueva a la carga basta con añadir una fila, sin modificar el job.

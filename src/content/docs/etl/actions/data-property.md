---
title: "La propiedad Data"
sidebar:
  order: 1
---

Muchas acciones de Crono ETL admiten la propiedad `Data`. Esta propiedad permite ejecutar la misma acción varias veces, con valores distintos, sin necesidad de escribir un bucle ni repetir la acción.

Crono ETL no tiene instrucciones procedurales como bucles o condicionales. Esa lógica se expresa en SQL: la consulta de `Data` filtra, ordena y calcula los valores con los que se ejecuta la acción.

## Funcionamiento

`Data` contiene una consulta `SELECT`, que se ejecuta sobre la conexión activa. La acción se ejecuta una vez por cada fila que devuelve la consulta:

- Las propiedades informadas directamente en la acción son comunes a todas las ejecuciones.
- Cada columna de la consulta cuyo nombre coincide con una propiedad de la acción sustituye a esa propiedad en la ejecución correspondiente a su fila.

Por tanto, basta con renombrar las columnas de la consulta con el nombre de las propiedades que deben variar.

Como `data` es una palabra reservada, la propiedad se escribe siempre entre corchetes: `[Data]`.

## Ejemplo

La siguiente acción [BULK TABLE](/etl/actions/import-export/bulk-table/) carga en el esquema `staging` todas las tablas registradas en `audit.source_tables`. `SourceConnectionName` y `TargetSchemaName` son comunes, mientras que `SchemaName` y `TableName` cambian en cada fila:

```
[bulk table](
	SourceConnectionName='ERP_SOURCE',
	TargetSchemaName='staging',
	[Data]=(
		select schema as SchemaName, sourceTable as TableName
		from audit.source_tables
	)
)
```

### Escenario multiempresa

La ventaja de expresar la lógica en SQL se aprecia mejor en un caso más complejo. Supongamos una aplicación multiempresa en la que cada empresa tiene su propia base de datos, con la misma estructura de tablas. Hay que volcar las N tablas de cada una de las X empresas al área de staging.

Basta con añadir una tabla `audit.companies` con las empresas y combinarla con `audit.source_tables` mediante un `CROSS JOIN`. La consulta devuelve una fila por cada combinación de empresa y tabla, y una única acción realiza las N × X cargas:

```
[bulk table](
	SourceConnectionName='ERP_SOURCE',
	TargetSchemaName='staging',
	ParallelExecution=YES,
	[Data]=(
		select
			c.database_name as DatabaseName,
			t.schema as SchemaName,
			t.sourceTable as TableName,
			concat(c.code, '_', t.sourceTable) as TargetTableName
		from audit.companies c
		cross join audit.source_tables t
		where c.active = 1
	)
)
```

En cada ejecución, `DatabaseName` sustituye a la base de datos definida en la conexión `ERP_SOURCE`, de modo que una sola conexión sirve para todas las empresas. El código de empresa se antepone al nombre de la tabla de destino para que las cargas no se sobrescriban entre sí, y la cláusula `WHERE` limita la carga a las empresas activas.

Dar de alta una empresa nueva, o incorporar una tabla más a la carga, consiste en añadir una fila a la tabla correspondiente. El job no cambia.

## Ejecución en paralelo

Por defecto, las ejecuciones se realizan de una en una. En las acciones que admiten las propiedades `ParallelExecution` y `MaxDegreeOfParallelism`, pueden ejecutarse en paralelo:

| Propiedad | Descripción |
| --- | --- |
| `ParallelExecution` | `YES`/`NO`. Ejecuta en paralelo las filas de `Data`. Por defecto, `NO`. |
| `MaxDegreeOfParallelism` | Número máximo de ejecuciones simultáneas. Por defecto, `10`. |

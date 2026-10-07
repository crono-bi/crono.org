---
title: "EXPORT PARQUET"
description: "Exporta una tabla o vista a un fichero Parquet."
---

La acción `EXPORT PARQUET` exporta el contenido de una tabla o vista a un fichero Parquet. El fichero puede escribirse en una carpeta o en cualquier ubicación de [almacenamiento](/etl/configuration/storage/) definida en el proyecto.

## Sintaxis

La acción indica qué tabla se exporta, dónde se escribe el fichero y cómo se llama:

```
[export parquet](
	schema_name='staging',
	table_name='customers_data',
	target_location='filestore://datalake',
	filename='customers_data.parquet'
)
```

En este ejemplo, la tabla `staging.customers_data` de la conexión activa se exporta al fichero `customers_data.parquet` del almacenamiento `datalake`.

Para exportar desde una conexión distinta de la activa, se informa `source_connection_name`:

```
[export parquet](
	source_connection_name='ERP_SOURCE',
	schema_name='imp',
	table_name='customers_data',
	target_location='filestore://datalake',
	filename='customers_data.parquet'
)
```

## Propiedades

| Propiedad | Descripción |
| --- | --- |
| `source_connection_name` | Conexión de la que se leen los datos. Si no se informa, se utiliza la conexión activa. |
| `schema_name` | Esquema de la tabla o vista que se exporta. |
| `table_name` | Tabla o vista que se exporta. |
| `target_location` | Ubicación en la que se escribe el fichero. Consulta [Ubicación de destino](#ubicación-de-destino). |
| `filename` | Nombre del fichero Parquet, sin ruta y con su extensión. |
| `data` | Consulta que devuelve una fila por cada exportación a realizar. Consulta [La propiedad data](/etl/actions/data-property/). |

Todas las propiedades son obligatorias, salvo `source_connection_name` y `data`. Pueden informarse en la acción o, si se utiliza `data`, en las columnas de la consulta.

## Ubicación de destino

La propiedad `target_location` admite tres tipos de valor:

| Tipo | Ejemplo | Descripción |
| --- | --- | --- |
| Almacenamiento | `filestore://datalake` | Una ubicación de almacenamiento del proyecto, referenciada por su nombre. |
| Ruta relativa | `exports/parquet` | Una carpeta relativa a la carpeta del proyecto. |
| Ruta absoluta | `C:\exports` | Una carpeta indicada por su ruta completa. |

Un almacenamiento es una referencia con nombre a una carpeta, a un bucket de Amazon S3 o de Google Cloud Storage, o a un repositorio de GitHub, junto con las credenciales necesarias para acceder a él. Al referenciarlo por su nombre, el job no contiene rutas ni credenciales, y el código es el mismo sea cual sea el tipo de almacenamiento que haya detrás.

Tras el nombre del almacenamiento puede indicarse una subcarpeta: `filestore://datalake/exports/2026`. El nombre del almacenamiento no debe contener espacios. Si la carpeta de destino no existe, se crea automáticamente.

:::tip
Se recomienda utilizar siempre un almacenamiento. Una ruta absoluta liga el job al equipo en el que se escribió, mientras que un almacenamiento se define una vez en el entorno y puede cambiar de ubicación sin modificar el código.
:::

## Qué se exporta

La acción exporta el contenido completo de una tabla, de una vista o de una vista virtual. No dispone de propiedades para elegir columnas o filtrar filas: para exportar solo una parte de los datos, se declara una vista virtual con la consulta deseada y se exporta esa vista.

Una vista virtual es una consulta con nombre que se declara una vez y puede utilizarse desde cualquier parte del proyecto como si fuera una vista. No se crea en la base de datos: Crono ETL la resuelve al compilar.

```
declare virtual view staging.customers_spain
select customer_id, company_name, city
from staging.customers_data
where country='Spain'
```

Una vez declarada, se exporta igual que una tabla:

```
[export parquet](
	schema_name='staging',
	table_name='customers_spain',
	target_location='filestore://datalake',
	filename='customers_spain.parquet'
)
```

Cada exportación genera un único fichero. Si el fichero ya existe en el destino, se sobrescribe.

<!-- PENDIENTE: Enlazar la documentación de las vistas virtuales cuando exista. -->

## Exportación de varias tablas

Con la propiedad `data`, una sola acción puede exportar varias tablas. La consulta devuelve una fila por tabla, y sus columnas sustituyen a las propiedades del mismo nombre en cada ejecución:

```
[export parquet](
	target_location='filestore://datalake',
	[data]=(
		select schema_name, table_name, concat(table_name, '.parquet') as filename
		from crono.tables
		where schema_name='dwh'
	)
)
```

En este ejemplo se exportan todas las tablas y vistas del esquema `dwh`, sin mantener ninguna lista: la vista [crono.tables](/sql/views/metadata-database/crono-tables/) las obtiene de la propia base de datos. Como cada exportación genera un fichero, `filename` debe ser distinto en cada fila; aquí se construye a partir del nombre de la tabla. Si dos filas devolvieran el mismo nombre, la segunda exportación sobrescribiría el fichero de la primera.

Las exportaciones se ejecutan de una en una: esta acción no admite la propiedad `parallel_execution`.

## Varios orígenes y varios destinos

Las columnas de `data` también pueden informar la conexión de origen y la ubicación de destino. En el siguiente ejemplo, la consulta recorre los almacenamientos del proyecto mediante la vista [crono.file_stores](/sql/views/metadata-crono/crono-file_stores/) y escribe el mismo fichero en la carpeta `backup` de cada uno de ellos:

```
[export parquet](
	schema_name='staging',
	table_name='customers_data',
	filename='customers_data.parquet',
	[data]=(
		select $'filestore://{file_store_name}/backup' as target_location
		from crono.file_stores
	)
)
```

La cadena `$'...'` sustituye `{file_store_name}` por el valor de esa columna en cada fila, de modo que la acción se ejecuta una vez por almacenamiento.

Combinando esa vista con [crono.connections](/sql/views/metadata-crono/crono-connections/) mediante un `CROSS JOIN`, la misma acción exporta la tabla desde todas las conexiones del proyecto a todos los almacenamientos:

```
[export parquet](
	schema_name='staging',
	table_name='customers_data',
	[data]=(
		select
			connection_name as source_connection_name,
			$'filestore://{file_store_name}/backup' as target_location,
			$'customers_data_{connection_name}.parquet' as filename
		from crono.file_stores
		cross join crono.connections
	)
)
```

La consulta devuelve una fila por cada combinación de conexión y almacenamiento. El nombre de la conexión se incluye en `filename` para que las exportaciones de distintos orígenes no se sobrescriban entre sí en un mismo almacenamiento.

Para incorporar un origen o un destino nuevo basta con definir la conexión o el almacenamiento, sin modificar el job.

## Funcionamiento

Crono ETL lee los datos a través de la conexión de origen y escribe el fichero en el destino. La acción no depende, por tanto, de las funciones de exportación propias de cada motor: funciona con cualquier conexión y con cualquier tipo de almacenamiento, y la conversión de los tipos de datos al formato Parquet es automática.

Las columnas cuyo tipo no puede representarse en Parquet se omiten, y el registro de ejecución lo indica con un aviso.

:::note
Los datos pasan por el equipo que ejecuta el job. Al exportar desde una base de datos en la nube a un bucket, los datos se descargan y se vuelven a subir, por lo que el tiempo de exportación depende también de la conexión de red de ese equipo.
:::

## Uso junto con IMPORT PARQUET

Combinada con la acción [IMPORT PARQUET](/etl/actions/import-export/import-parquet/), `EXPORT PARQUET` permite mover tablas de gran volumen entre motores distintos. Es la alternativa recomendada a [BULK TABLE](/etl/actions/import-export/bulk-table/#compatibilidad-con-los-motores-de-destino) cuando el motor de destino no dispone de carga masiva nativa.

---
title: "COPY FILE"
description: "Copia un fichero de una ubicación a otra."
---

La acción `COPY FILE` copia un fichero de una ubicación a otra. El origen y el destino pueden ser carpetas o cualquier ubicación de [almacenamiento](/etl/configuration/storage/) definida en el proyecto, en cualquier combinación: de una carpeta local a un bucket de Amazon S3, de Google Cloud Storage a un repositorio de GitHub, etc.

## Sintaxis

La acción indica el fichero de origen y el de destino:

```
[copy file](
	source_location='exports/customers_data.parquet',
	target_location='filestore://datalake/exports/customers_data.parquet'
)
```

En este ejemplo, el fichero `customers_data.parquet` de la carpeta `exports` del proyecto se copia en la carpeta `exports` del almacenamiento `datalake`.

## Propiedades

| Propiedad | Descripción |
| --- | --- |
| `source_location` | Ubicación del fichero que se copia, incluido el nombre del fichero. |
| `target_location` | Ubicación de destino, incluido el nombre del fichero. |
| `data` | Consulta que devuelve una fila por cada copia a realizar. Consulta [La propiedad data](/etl/actions/data-property/). |

Las propiedades `source_location` y `target_location` son obligatorias. Pueden informarse en la acción o, si se utiliza `data`, en las columnas de la consulta.

## Ubicaciones de origen y destino

Las dos propiedades admiten los mismos tipos de valor que el resto de ubicaciones de Crono ETL (un almacenamiento, una ruta relativa a la carpeta del proyecto o una ruta absoluta), seguidos siempre del nombre del fichero:

| Tipo | Ejemplo |
| --- | --- |
| Almacenamiento | `filestore://datalake/exports/customers_data.parquet` |
| Ruta relativa | `exports/customers_data.parquet` |
| Ruta absoluta | `C:\exports\customers_data.parquet` |

Como el destino incluye el nombre del fichero, este puede ser distinto del de origen: la acción copia y renombra en un solo paso.

## Comportamiento

- Cada ejecución copia un único fichero.
- El fichero de origen no se modifica.
- Si el fichero de destino ya existe, se sobrescribe.
- Si la carpeta de destino no existe, se crea automáticamente.

## Copia de varios ficheros

Con la propiedad `data`, una sola acción puede copiar varios ficheros. La consulta devuelve una fila por fichero, y sus columnas sustituyen a las propiedades del mismo nombre en cada ejecución:

```
[copy file](
	[data]=(
		select source_location, target_location
		from audit.files_to_copy
	)
)
```

En este ejemplo se copian todos los ficheros registrados en `audit.files_to_copy`. Las columnas también pueden construirse en la propia consulta; por ejemplo, recorriendo la vista [crono.file_stores](/sql/views/metadata-crono/crono-file_stores/) para copiar el mismo fichero en todos los almacenamientos del proyecto.

<!-- PENDIENTE: Indicar si esta acción admite parallel_execution. -->

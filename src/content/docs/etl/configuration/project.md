---
title: "Proyecto"
description: "Configuración que se guarda con el proyecto: entornos, campos de auditoría, Calendas, ficheros de declaraciones y preferencias del IDE."
---

La configuración del proyecto define cómo trabaja Crono con ese proyecto. Incluye:

- Los [entornos](/etl/configuration/connections/), con sus conexiones, almacenamientos y credenciales.
- Los nombres de los campos de auditoría que se añaden a las tablas.
- El proyecto de Calendas en el que se publican los logs.
- Los ficheros de declaraciones.
- Algunas preferencias de Crono ETL para Windows.

Se guarda en la carpeta del proyecto, junto con el código, así que se versiona con él y es la misma para todos los que trabajan en el proyecto. En Crono ETL se configura desde la ventana **Propiedades del proyecto**.

Lo que depende de cada máquina, como el correo o la carpeta de logs, no forma parte del proyecto: se define en la configuración del [equipo](/etl/configuration/machine/).

## Dónde se guarda

La configuración se reparte entre dos ficheros:

| Fichero | Contenido |
| --- | --- |
| `.crono/config.jsonc` | Las propiedades que necesita cualquier ejecución del proyecto, también desde Crono CLI: opciones ETL, cuenta de Calendas y ficheros de declaraciones. |
| `Crono.etlproj` | Las propiedades que solo usa Crono ETL para Windows: carpeta de jobs, límite de filas de los resultados, consulta del registro de cargas, catálogos, paneles visibles… Crono CLI no lo utiliza. |

Además, cada equipo guarda en `C:\ProgramData\Crono\Projects\<proyecto>` la configuración local del proyecto: la información propia de ese equipo que no debe subirse a Git, como el entorno activo.

Este es un ejemplo de `.crono/config.jsonc`:

```jsonc
{
  "etl-options": {
    "inserted-date-column-name": "insert_date",
    "updated-date-column-name": "update_date",
    "deleted-date-column-name": "delete_date",
    "start-date-column-name": "start_date",
    "end-date-column-name": "end_date",
    "default-end-date": "2100-01-01"
  },
  "calendas": {
    "calendas-id": "my-company/my-project",
    "calendas-token": "[ENCRYPTED TEXT]"
  },
  "declaration-locations": [
    "procedures\\load_strategies.sql",
    "models\\virtual_views.sql"
  ]
}
```

Los entornos no están en este fichero: cada uno tiene el suyo en `.crono/environments/`.

## General

La pestaña **General** reúne las preferencias del IDE y la cuenta de Calendas:

![Pestaña General de las propiedades del proyecto](/images/etl/configuration/project/general.png)

| Nombre | Propiedad | Fichero | Descripción |
| --- | --- | --- | --- |
| Límite de filas | `MaxRows` | `Crono.etlproj` | Número máximo de filas que muestra el IDE al ejecutar una consulta. Solo afecta a Crono ETL para Windows. |
| Carpeta de jobs | `JobsFolderPath` | `Crono.etlproj` | Carpeta del proyecto cuyos ficheros `.job` muestra el IDE en el panel lateral. |
| Identificador de Calendas | `calendas-id` | `config.jsonc` | Proyecto de [Calendas](/etl/orchestration/audited-execution/#calendas) en el que se publican los logs de las ejecuciones auditadas. El botón del lápiz permite elegirlo entre los proyectos a los que da acceso el token. |
| Token de Calendas | `calendas-token` | `config.jsonc` | Token de acceso a Calendas. Se guarda cifrado. El botón ✔ comprueba que es válido. |
| Permitir guardar con errores | `AllowSaveWithErrors` | `Crono.etlproj` | Permite guardar ficheros con errores de sintaxis. Por defecto, no. |
| Consulta del registro de cargas | `LoadsLogQuery` | `Crono.etlproj` | Consulta que devuelve el resultado de las últimas cargas. Consulta [Registro de cargas](#registro-de-cargas). |

### Registro de cargas

Si el proyecto tiene una consulta del registro de cargas, Crono ETL muestra en la barra de estado el resultado de la última carga y, desde ella, la lista de las últimas cargas. Así se conoce el estado de los datos sin consultar tablas ni entrar en Calendas. Los catálogos de Crono Metadata admiten una consulta similar, para que los usuarios vean esta información desde su herramienta de análisis.

La consulta debe devolver estas columnas:

| Columna | Contenido |
| --- | --- |
| `Date` | Fecha de la carga. |
| `Message` | Nombre o descripción de la carga. |
| `IsCorrect` | Indica si la carga ha terminado correctamente. |
| `Duration` | Duración de la carga, en minutos. |

Por ejemplo, a partir de la tabla de log de los procedimientos:

```crono-sql
SELECT TOP 100
	start_date AS [Date],
	procedure_name AS Message,
	if(error_message IS NULL) AS IsCorrect,
	duration_seconds / 60.0 AS Duration
FROM audit.logs
WHERE procedure_name = 'DWH Load'
ORDER BY start_date DESC
```

Los enlaces **Project folder** y **Project local configuration folder** abren en el explorador de Windows la carpeta del proyecto y la de su configuración local en el equipo.

<!-- PENDIENTE: el MCP podrá consultar también el registro de cargas. Enlazar la consulta equivalente de los catálogos cuando se documente Crono Metadata. Las columnas del ejemplo de audit.logs son orientativas: ajustarlas cuando se documente la tabla de log. La configuración local guardará también el secreto que permite leer las credenciales de los entornos: actualizar cuando exista. -->

## Declaraciones

La pestaña **Declaraciones** indica los ficheros de declaraciones del proyecto: ficheros Crono SQL con definiciones que se tienen en cuenta en todo el proyecto, como las estrategias de carga o las vistas virtuales. Habitualmente, las estrategias de carga se guardan en la carpeta `procedures/` y las vistas virtuales en `models/`.

![Pestaña Declaraciones de las propiedades del proyecto](/images/etl/configuration/project/declarations.png)

| Nombre | Propiedad | Fichero | Descripción |
| --- | --- | --- | --- |
| Ficheros de declaraciones | `declaration-locations` | `config.jsonc` | Lista de ficheros de declaraciones, con su ruta relativa a la carpeta del proyecto. |

<!-- PENDIENTE: documentación de las vistas virtuales y de las estrategias de carga aplazada (las vistas virtuales quizá en Crono SQL); enlazarla cuando exista. ¿El orden de la lista importa? -->

## Opciones ETL

La pestaña **Opciones ETL** define los nombres de los campos de auditoría: las columnas que Crono SQL añade automáticamente a las tablas que carga con `MERGE` y que mantiene en cada carga.

![Pestaña Opciones ETL de las propiedades del proyecto](/images/etl/configuration/project/etl-options.png)

| Nombre | Propiedad | Fichero | Descripción |
| --- | --- | --- | --- |
| Fecha de inserción | `inserted-date-column-name` | `config.jsonc` | Nombre de la columna con la fecha en que se insertó cada registro. |
| Fecha de modificación | `updated-date-column-name` | `config.jsonc` | Nombre de la columna con la fecha de la última modificación. |
| Fecha de eliminación | `deleted-date-column-name` | `config.jsonc` | Nombre de la columna con la fecha en que se marcó el registro como eliminado, en los borrados lógicos. |
| Fecha de inicio | `start-date-column-name` | `config.jsonc` | Nombre de la columna con la fecha de inicio de vigencia, en las tablas historificadas. |
| Fecha de fin | `end-date-column-name` | `config.jsonc` | Nombre de la columna con la fecha de fin de vigencia, en las tablas historificadas. |
| Fecha de fin por defecto | `default-end-date` | `config.jsonc` | Fecha de fin de vigencia de los registros vigentes. Por defecto, `2100-01-01`. |

Qué campos añade cada patrón de carga se explica en [Auditoría](/sql/language/load-patterns/#auditoría), en la documentación de Crono SQL. En un proyecto nuevo, los nombres son `insert_date`, `update_date`, `delete_date`, `start_date` y `end_date`.

<!-- PENDIENTE: ¿qué pasa si se cambian los nombres en un proyecto con tablas ya creadas? (si conviene, recomendar fijarlos al empezar). Create procedure extended properties (solo SQL Server) no se documenta por ahora. Verificar que un proyecto nuevo usa los nombres en snake_case (proyectos antiguos: InsertDate, UpdateDate...). -->

## Catálogos

La pestaña **Catálogos** muestra los catálogos de Crono Metadata que conoce Crono ETL y permite añadir uno nuevo. Con ellos, el IDE puede transpilar y ejecutar consultas al catálogo, exactamente las mismas que hacen los usuarios desde su herramienta de análisis. La lista se guarda en `Crono.etlproj`.

![Pestaña Catálogos de las propiedades del proyecto](/images/etl/configuration/project/catalogs.png)

<!-- PENDIENTE: confirmar el nombre de la propiedad de los catálogos en Crono.etlproj. -->

## Entornos

La pestaña **Entornos** muestra los entornos del proyecto y permite crear uno nuevo o editar sus [conexiones](/etl/configuration/connections/), [almacenamientos](/etl/configuration/storage/) y [credenciales](/etl/configuration/credentials/). Cada entorno se guarda en su propio fichero, `.crono/environments/<entorno>.jsonc`.

![Pestaña Entornos de las propiedades del proyecto](/images/etl/configuration/project/environments.png)

El entorno activo aparece en negrita, y se cambia desde el menú contextual. Se guarda en la configuración local del proyecto, así que cada equipo puede trabajar con un entorno distinto.

Con Crono CLI, el entorno activo se consulta con `crono environment current` y se cambia con `crono environment set-current`:

```
crono environment set-current --name prod
```

## Vistas

La pestaña **Vistas** elige qué paneles muestra el IDE en la barra lateral:

![Pestaña Vistas de las propiedades del proyecto](/images/etl/configuration/project/views.png)

| Nombre | Propiedad | Fichero | Descripción |
| --- | --- | --- | --- |
| Orígenes | `IsSourceViewVisible` | `Crono.etlproj` | Muestra el panel de orígenes. |
| Otros | `IsOthersViewVisible` | `Crono.etlproj` | Muestra el panel de otros ficheros. |
| Jobs | `IsJobViewVisible` | `Crono.etlproj` | Muestra el panel de jobs. |

Son preferencias del IDE: no afectan a la ejecución del proyecto.

## Ficheros excluidos

Por defecto, todos los ficheros `.sql` de la carpeta del proyecto forman parte del proyecto: Crono ETL los analiza en segundo plano para encontrar referencias y permitir navegar de un fichero a otro. Desde el menú contextual de un fichero, la opción **Exclude from the project** lo excluye de ese análisis. Los ficheros excluidos se guardan en la propiedad `ExcludedFiles` de `Crono.etlproj`.

<!-- La vista de procedimientos (IsProceduresViewVisible, ProceduresViewMode) se eliminará: no se documenta. TableFilter, de poca importancia, tampoco. -->

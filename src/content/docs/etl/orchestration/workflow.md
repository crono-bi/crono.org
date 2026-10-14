---
title: "WORKFLOW"
description: "Ejecuta una sucesión de acciones, en secuencia o en paralelo."
---

La acción `WORKFLOW` ejecuta una sucesión de pasos: cargas de tablas, procedimientos, ficheros de código Crono SQL u otros ficheros `.job`. Es la acción que orquesta un proceso de carga completo, y define qué se ejecuta, en qué orden y qué puede ejecutarse en paralelo.

Como el resto de acciones, un workflow se escribe en un fichero `.job`, que contiene esa única acción. Sin embargo, tiene una sintaxis propia: no se define mediante propiedades, sino mediante bloques que contienen una lista de pasos.

## Sintaxis

En su forma más sencilla, un workflow es una lista de tablas que se cargan una tras otra:

```
WORKFLOW 'Ventas' (
	dwh.customers,
	dwh.products,
	dwh.invoices,
	dwh.invoice_lines
)
```

Cada bloque empieza con una palabra clave (`WORKFLOW`, `PARALLEL` o `ASYNC`), que determina cómo se ejecutan sus pasos, seguida de un nombre opcional y, entre paréntesis, de la lista de pasos separados por comas. El nombre es solo informativo: identifica el bloque en el UI y en el registro de ejecución, pero no afecta a la ejecución.

Un paso puede ser a su vez otro bloque, de modo que un proceso de carga completo se organiza como un árbol de bloques:

```
WORKFLOW (
	WORKFLOW 'Maestros' (
		dwh.customers,
		dwh.products,
		dwh.dates
	),
	WORKFLOW 'Ventas' (
		dwh.invoices,
		dwh.invoice_lines
	),
	WORKFLOW 'Contabilidad' (
		dwh.accounts,
		dwh.journal_entries
	)
)
```

`WORKFLOW`, `PARALLEL`, `ASYNC`, `PROCEDURE` y `FILE` son palabras clave del lenguaje y, como `SELECT` en una consulta, se escriben siempre sin corchetes.

Dentro de un workflow pueden utilizarse comentarios `--`, por ejemplo para desactivar temporalmente un paso.

## Tipos de bloque

| Bloque | Ejecución |
| --- | --- |
| `WORKFLOW` | Ejecuta sus pasos de uno en uno, en el orden en que están escritos. |
| `PARALLEL` | Inicia todos sus pasos a la vez y espera a que terminen todos antes de continuar con el paso siguiente. |
| `ASYNC` | Ejecuta sus pasos de uno en uno, como `WORKFLOW`, pero en segundo plano: el bloque que lo contiene continúa inmediatamente con el paso siguiente, sin esperar a que terminen. |

Los bloques pueden combinarse libremente. En el siguiente ejemplo, las tablas de fechas se cargan una tras otra en segundo plano mientras se cargan en paralelo los maestros, y las ventas no empiezan hasta que han terminado todos los maestros:

```
WORKFLOW (
	ASYNC 'Tiempo' (
		dwh.months,
		dwh.weeks,
		dwh.dates
	),
	PARALLEL 'Maestros' (
		dwh.customers,
		dwh.products,
		dwh.employees
	),
	WORKFLOW 'Ventas' (
		dwh.invoices,
		dwh.invoice_lines
	)
)
```

Para ejecutar en segundo plano varios pasos a la vez, se anida un bloque `PARALLEL` dentro de un bloque `ASYNC`:

```
ASYNC (
	PARALLEL (
		dwh.months,
		dwh.weeks,
		dwh.dates
	)
)
```

:::tip
Agrupa en un bloque `PARALLEL` las cargas que no dependen entre sí, como la mayoría de las dimensiones, y deja en bloques `WORKFLOW` las que deben esperar a otras, como las tablas de hechos que consultan esas dimensiones.
:::

<!-- PENDIENTE: ASYNC. Revisar qué ocurre con el resultado de los pasos lanzados (si se esperan al final del workflow y si un error en ellos detiene la ejecución). De momento no se documenta. -->

## Pasos

Un bloque puede contener cuatro tipos de paso:

| Paso | Ejemplo | Descripción |
| --- | --- | --- |
| Tabla | `dwh.customers` | Ejecuta el procedimiento que carga la tabla. |
| `PROCEDURE` | `PROCEDURE dwh.final_checks` | Ejecuta un procedimiento concreto, con parámetros si los necesita. |
| `FILE` | `FILE 'Bulk ERP.job'` | Ejecuta un fichero `.job` o un fichero de código Crono SQL. |
| Bloque | `PARALLEL 'Maestros' (...)` | Ejecuta un bloque anidado. |

Todos los pasos se ejecutan sobre la conexión activa, salvo las acciones que indican otra conexión de forma explícita.

### Tabla

El paso más habitual es el nombre de una tabla, que indica que debe ejecutarse el procedimiento que la carga.

En un proyecto DWH típico, los datos de origen ya están en el área de staging, de modo que cargar una tabla del DWH es una operación que puede realizarse íntegramente en la base de datos. Crono propone un patrón que conviene respetar: cada tabla se carga desde un único procedimiento. El procedimiento se declara sin nombre, a partir de la tabla que carga:

```
CREATE OR REPLACE PROCEDURE
MERGE CLONE dwh.customers(customer_id)
SELECT
	code      customer_code KEY,
	name      customer_name,
	tax_id    tax_id
FROM staging.customers
```

Crono asigna al procedimiento un nombre derivado de la tabla, siguiendo una convención propia de cada motor. Por eso, en el workflow basta con escribir `dwh.customers`: Crono ETL sabe qué procedimiento debe ejecutar.

El procedimiento debe existir en la base de datos en el momento de ejecutar el workflow; se crea al desplegar el proyecto.

<!-- PENDIENTE: Enlazar la documentación de CREATE PROCEDURE (convención de nombres por motor) y la del despliegue cuando existan. -->

### PROCEDURE

`PROCEDURE` ejecuta un procedimiento concreto, por su nombre. Se utiliza para los procedimientos que no cargan una tabla, como comprobaciones finales o tareas de mantenimiento:

```
PROCEDURE dwh.final_checks
```

Si el procedimiento tiene parámetros, sus valores se indican entre paréntesis, por posición y separados por comas, como en una llamada SQL:

```
PROCEDURE dwh.close_period('2026-09', 1)
```

### FILE

`FILE` ejecuta un fichero. Admite dos tipos:

- **Ficheros `.job`.** Ejecuta la acción que contiene el fichero: una carga con [BULK TABLE](/etl/data-movement/bulk-table/), una exportación con [EXPORT PARQUET](/etl/data-movement/export-parquet/)… o incluso otro workflow. Así, un proceso extenso puede dividirse en varios workflows y reutilizarlos desde distintos procesos.
- **Ficheros `.sql`.** Ejecuta el código Crono SQL que contiene el fichero. El código se transpila al dialecto de la conexión activa inmediatamente antes de ejecutarse.

Los ficheros `.sql` cubren los casos que no encajan en el patrón de un procedimiento por tabla. El caso típico es crear una tabla o una vista a partir de datos que no están en la base de datos, como una API, un fichero CSV o una hoja de Excel:

```
WORKFLOW 'Contabilidad' (
	FILE '/Tables/dwh.account_groups.sql',
	dwh.accounts,
	dwh.journal_entries
)
```

La ruta del fichero puede indicarse de varias formas:

| Tipo | Ejemplo | Descripción |
| --- | --- | --- |
| Relativa al workflow | `'Bulk ERP.job'`, `'../Tables/staging.open_orders.sql'` | Relativa a la carpeta del fichero `.job` del workflow. |
| Relativa al proyecto | `'/Tables/dwh.account_groups.sql'` | Empieza por una barra y es relativa a la carpeta raíz del proyecto. |
| Almacenamiento | `'filestore://scripts/dwh.account_groups.sql'` | Un fichero de una ubicación de [almacenamiento](/etl/configuration/storage/). |
| Absoluta | `'C:\scripts\dwh.account_groups.sql'` | Un fichero indicado por su ruta completa. |

En las rutas puede utilizarse indistintamente `/` o `\` como separador. El fichero debe existir en el momento de ejecutar el workflow.

<!-- PENDIENTE: Ejecución de un workflow directamente desde GitHub con Crono CLI (las rutas relativas se resuelven en el repositorio; "pasar a producción" con un push). Decidir si se documenta aquí o en la página de Crono CLI / despliegue. -->

## Ejemplo completo

El siguiente workflow recoge un proceso de carga nocturna habitual. Primero se copian las tablas de origen al área de staging, después se cargan los maestros en paralelo y, a continuación, las tablas de hechos. Al final se ejecuta un procedimiento de comprobación:

```
WORKFLOW 'Carga DWH' (
	FILE 'Bulk ERP.job',
	WORKFLOW 'Ficheros externos' (
		FILE '/Tables/staging.budget.sql'
	),
	PARALLEL 'Maestros' (
		dwh.customers,
		dwh.products,
		dwh.employees,
		dwh.cost_centers
	),
	WORKFLOW 'Ventas' (
		dwh.invoices,
		dwh.invoice_lines
	),
	WORKFLOW 'Contabilidad' (
		dwh.accounts,
		dwh.journal_entries,
		dwh.budget
	),
	PROCEDURE dwh.final_checks
)
```

El fichero `Bulk ERP.job` contiene una acción [BULK TABLE](/etl/data-movement/bulk-table/) que copia las tablas del ERP al área de staging. El resto del proceso se ejecuta íntegramente en la base de datos del DWH.

Este esquema se adapta sin dificultad a proyectos de cualquier tamaño: añadir una tabla al proceso es añadir una línea al bloque que le corresponde.

## Errores

Si falla un paso, el workflow se detiene y no se ejecuta ningún paso más. En un bloque `PARALLEL`, no se inicia ningún paso nuevo y se intentan cancelar los que están en curso.

Desde el UI de Crono ETL, el workflow se muestra como un árbol con sus bloques y pasos, y puede relanzarse a partir de un paso concreto, sin repetir los que ya terminaron correctamente.

<!-- PENDIENTE: Captura del árbol del workflow en el UI (public/images/etl/orchestration/workflow/). Confirmar el comportamiento exacto de la cancelación en PARALLEL. -->

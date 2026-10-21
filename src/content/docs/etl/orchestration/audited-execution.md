---
title: "Ejecución auditada"
description: "Convierte la ejecución de una acción en un job auditado: log, Calendas y correo de fin de carga."
---

Cualquier acción puede ejecutarse de forma auditada añadiendo una cabecera YAML al principio de su fichero `.job`. Una ejecución auditada, o *job*, queda registrada en un log, se publica en [Calendas](#calendas) y se notifica por correo electrónico al terminar, indicando si ha ido bien o ha fallado.

Lo habitual es auditar únicamente el proceso de carga completo: la cabecera se añade al fichero del [workflow](/etl/orchestration/workflow/) principal, el que se lanza cada noche, y no a los ficheros `.job` que este ejecuta.

## Sintaxis

La cabecera va al principio del fichero, entre dos líneas `---`, y la acción se escribe a continuación:

```
---
JobName: DWH Load
OkMark: ' (OK)'
LogContent: 'La carga ha finalizado.'
SendLogTo: it@example.com, finance@example.com
SendFailureLogTo: support@example.com
---

WORKFLOW (
	FILE 'Bulk ERP.job',
	PARALLEL 'Master data' (
		dwh.customers,
		dwh.products
	),
	WORKFLOW 'Sales' (
		dwh.invoices,
		dwh.invoice_lines
	)
)
```

La propiedad que activa la auditoría es `JobName`: da nombre al job, y ese nombre es el que aparece en Calendas, en el log y en el asunto del correo. Sin `JobName`, la acción se ejecuta de forma normal, sin auditar.

La ejecución es auditada tanto desde Crono ETL como desde Crono CLI.

## Propiedades

| Propiedad | Descripción |
| --- | --- |
| `JobName` | Nombre del job. Activa la ejecución auditada. |
| `SendLogTo` | Direcciones que reciben el correo de fin de carga, sea cual sea el resultado. |
| `SendSuccessLogTo` | Direcciones que reciben el correo solo si la ejecución termina correctamente. |
| `SendFailureLogTo` | Direcciones que reciben el correo solo si la ejecución falla. |
| `LogContent` | Texto con el que empieza el cuerpo del correo. |
| `OkMark` | Texto que se añade al asunto del correo cuando la ejecución termina correctamente. Por defecto, vacío. |
| `ErrorMark` | Texto que se añade al asunto del correo cuando la ejecución falla. Por defecto, `' (ERROR)'`. |
| `SaveLog` | `YES`/`NO`. Guarda el log en la carpeta de logs del equipo. Por defecto, `YES`. |
| `SaveToCalendas` | `YES`/`NO`. Publica el log en Calendas. Por defecto, `YES`. |
| `Condition` | Consulta que decide si la acción se ejecuta. Consulta [Ejecución condicional](#ejecución-condicional). |

En las propiedades de correo, varias direcciones se separan con comas. Los textos que empiezan o terminan con espacios, como `' (OK)'`, se escriben entre comillas.

<!-- PENDIENTE: snake_case en la cabecera (job_name, send_log_to...). Documentarlo cuando esté implementado. Los ficheros .md (correos condicionales) no se documentan por ahora. -->

## Correo de fin de carga

Al terminar, el job envía un correo cuyo asunto es el nombre del job seguido de la marca del resultado: con la cabecera del ejemplo, `DWH Load (OK)` o `DWH Load (ERROR)`. Así, el resultado se conoce sin abrir el mensaje.

El cuerpo empieza con el texto de `LogContent` e incluye los enlaces al log publicado en Calendas.

Los destinatarios pueden repartirse según el resultado. Un reparto habitual es que el cliente reciba siempre la confirmación de la carga (`SendLogTo`) y que el equipo de soporte reciba solo los fallos (`SendFailureLogTo`), ya que el resto de cargas puede revisarlas en Calendas.

### Configuración del correo

El remitente de los correos se configura en las [opciones generales del equipo](/etl/configuration/machine/), que comparten todas las aplicaciones de Crono y todos los usuarios de la máquina. Basta con indicar un nombre y una dirección de correo: los mensajes se envían con ese nombre, y las respuestas llegan a esa dirección.

No es necesario configurar ningún servidor de correo. Por defecto, Crono envía los mensajes a través de su propio servicio de envío, desde una dirección del tipo `nombre_del_equipo@system.crono.net`. Opcionalmente, puede configurarse un servidor SMTP propio, aunque se recomienda mantener el servicio de Crono, que no requiere mantenimiento.

## Log de ejecución

El log recoge el resultado de la ejecución:

- Una cabecera con el equipo, el usuario, la versión de Crono, la fecha de inicio, la duración y el estado final (`Status`). Si la ejecución falla, incluye también el mensaje de error y el paso en el que se produjo.
- El árbol de pasos ejecutados, con la duración de cada uno y, en las cargas, el número de registros leídos.

No es un registro exhaustivo, pero basta para saber qué paso ha fallado y cuánto ha tardado cada parte del proceso.

El log se guarda en la carpeta de logs del equipo, con una subcarpeta por mes, y puede consultarse desde Crono ETL. La carpeta se configura en las opciones generales del equipo. El log también se publica en Calendas y queda registrado en tablas de la base de datos.

<!-- PENDIENTE: En las opciones generales, la carpeta de logs aparece como "Download Directory": revisar el literal del UI. Registro en tablas de la base de datos: se tratará en la página de auditoría. -->

## Calendas

Calendas es la aplicación web en la que Crono publica los logs de ejecución. Permite conocer el resultado de cada carga sin consultar tablas ni abrir correos: un calendario muestra, día a día, qué cargas han terminado correctamente y cuáles han fallado, y desde cada evento se accede a su log. Calendas es también el panel de seguimiento del proyecto, con las incidencias y la dedicación.

Para publicar en Calendas, el proyecto debe tener configurada su cuenta de Calendas (identificador y token) en la [configuración del proyecto](/etl/configuration/project/).

<!-- PENDIENTE: Captura del calendario de logs de Calendas (public/images/etl/orchestration/audited-execution/). Decidir si Calendas será obligatorio para los nuevos clientes. -->

## Ejecución condicional

La propiedad `Condition` contiene una consulta Crono SQL que devuelve un valor lógico. Se evalúa sobre la conexión activa antes de ejecutar la acción, y la acción solo se ejecuta si la consulta devuelve verdadero. Por ejemplo, para cargar solo cuando hay datos pendientes:

```
---
JobName: DWH Load
Condition:
	SELECT IF(COUNT(*)<>0)
	FROM audit.pending_loads
---
```

<!-- PENDIENTE: Confirmar qué ocurre cuando la condición no se cumple (si se registra en el log/Calendas y si se envía correo). -->

## Jobs anidados

Los jobs no se anidan. Si un workflow auditado ejecuta otro fichero `.job` que también tiene cabecera, la ejecución se audita una sola vez: se publica un único log en Calendas y se envía un único correo, el del job principal.

---
title: "crono.routines"
---

Devuelve información sobre los procedimientos almacenados y las funciones de la base de datos, incluyendo su tipo, definición y fechas de creación y modificación.

Es similar a la vista ANSI `INFORMATION_SCHEMA.ROUTINES`

La vista `crono.routines` devuelve las siguientes columnas:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `schema_name` | Nombre del esquema al que pertenece la rutina |
| `routine_name` | Nombre del procedimiento o función |
| `routine_type` | Tipo de rutina (`PROCEDURE` o `FUNCTION`) |
| `data_type` | Tipo de datos del valor de retorno (solo para funciones) |
| `routine_definition` | Definición del cuerpo de la rutina |
| `routine_body` | Indica si la rutina está escrita en SQL o en un lenguaje externo |
| `external_language` | Lenguaje externo de implementación |
| `created` | Fecha de creación de la rutina |
| `last_altered` | Fecha de la última modificación |

El siguiente ejemplo devuelve todos los procedimientos y funciones de la base de datos:

```crono-sql
select *
from crono.routines
```

El siguiente ejemplo lista únicamente las funciones definidas en la base de datos:

```crono-sql
select schema_name, routine_name, data_type
from crono.routines
where routine_type = 'FUNCTION'
order by schema_name, routine_name
```

El siguiente ejemplo muestra las rutinas modificadas en los últimos 30 días:

```crono-sql
select schema_name, routine_name, routine_type, last_altered
from crono.routines
where last_altered >= dateadd(day, -30, getdate())
order by last_altered desc
```




Si el motor de base de datos no soporta esta funcionalidad, la vista devuelve un conjunto de resultados vacío sin producir ningún error.

## Comentario

Esta pseudovista es muy similar a `crono.procedures`. La diferencia es que `crono.routines` solo llama a vistas de `INFORMATION_SCHEMA` que forman parte del estándar ANSI, por lo que puede usarse en cualquier base de datos que cumpla el estándar. En cambio `crono.procedures` utiliza vistas o funciones de sistema que son propias de **SQL Server**.

## Compatibilidad

**DuckDB** no admite procedimientos almacenados ni funciones definidas por el usuario en el sentido tradicional, y no expone la vista `INFORMATION_SCHEMA.ROUTINES`. En este caso la vista devuelve un conjunto de resultados vacío sin producir ningún error.

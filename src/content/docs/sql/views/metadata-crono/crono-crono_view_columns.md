---
title: "crono.crono_view_columns"
---

La vista `crono.crono_view_columns` devuelve el listado de columnas de cada una de las vistas de Crono.

Sus columnas son las siguientes:

| Columna | Descripción |
|---|---|
| `schema_name` | Nombre del esquema al que pertenece la vista |
| `view_name` | Nombre de la vista |
| `full_name` | Nombre completo de la vista, incluyendo el esquema |
| `position` | Posición ordinal de la columna en la vista |
| `column_name` | Nombre de la columna |

## Ejemplos

El siguiente ejemplo devuelve todas las columnas de todas las vistas de Crono:

```crono-sql
select *
from crono.crono_view_columns
```

El siguiente ejemplo lista las columnas de una vista concreta:

```crono-sql
select position, column_name
from crono.crono_view_columns
where full_name = 'crono.tables'
order by position
```

## Vistas relacionadas

[`crono.crono_views`](/sql/views/metadata-crono/crono-crono_views/) devuelve el listado de vistas de Crono.

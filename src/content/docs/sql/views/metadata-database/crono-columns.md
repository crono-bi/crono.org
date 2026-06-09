---
title: "crono.columns"
---

Devuelve información sobre todas las columnas de todas las tablas y vistas de la base de datos, incluyendo el tipo de datos, la posibilidad de contener nulos y el valor predeterminado de cada columna.

Es similar a la vista ANSI `INFORMATION_SCHEMA.COLUMNS`

La vista `crono.columns` devuelve las siguientes columnas:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `schema_name` | Nombre del esquema al que pertenece la tabla o vista |
| `table_name` | Nombre de la tabla o vista |
| `column_name` | Nombre de la columna |
| `position` | Posición ordinal de la columna en la tabla |
| `column_default` | Valor predeterminado de la columna |
| `is_nullable` | `true` si la columna admite valores nulos; `false` en caso contrario |
| `data_type` | Tipo de datos de la columna |
| `max_length` | Longitud máxima en bytes para tipos de cadena |
| `numeric_precision` | Precisión numérica para tipos numéricos |
| `numeric_scale` | Escala numérica para tipos numéricos |
| `collation_name` | Nombre de la intercalación de la columna |

El siguiente ejemplo devuelve todas las columnas de todas las tablas y vistas de la base de datos:

```crono-sql
select *
from crono.columns
```

El siguiente ejemplo lista todas las columnas que admiten valores nulos:

```crono-sql
select schema_name, table_name, column_name, data_type
from crono.columns
where is_nullable = TRUE
order by schema_name, table_name, position
```

El siguiente ejemplo muestra todas las columnas de tipo `varchar`, junto con su longitud máxima:

```crono-sql
select schema_name, table_name, column_name, max_length
from crono.columns
where data_type = 'varchar'
order by schema_name, table_name, position
```

## Comentario

Esta pseudovista es muy similar a `crono.AnsiColumns`. La diferencia es que `crono.AnsiColumns` solo llama a vistas de `INFORMATION_SCHEMA` que forman parte del estándar ANSI, por lo que puede usarse en cualquier base de datos que cumpla el estándar. En cambio `crono.columns` utiliza vistas o funciones de sistema que son propias de **SQL Server**.

---
title: "crono.columns"
---

La vista `crono.columns` devuelve información sobre todas las columnas de todas las tablas y vistas de la base de datos, incluyendo el tipo de datos, la posibilidad de contener nulos y el valor predeterminado de cada columna.

Es similar a la vista ANSI `INFORMATION_SCHEMA.COLUMNS`

Sus columnas son las siguientes:

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

## Ejemplos

El siguiente ejemplo devuelve todas las columnas de todas las tablas y vistas de la base de datos:

```crono-sql
select *
from crono.columns
```

El siguiente ejemplo lista todas las columnas que admiten valores nulos:

```crono-sql
select 
  schema_name,
 table_name, 
 column_name, data_type
from crono.columns
where is_nullable = TRUE
order by schema_name, table_name, position
```

El siguiente ejemplo muestra las tablas que tienen algún campo de tipo `datetime`:

```crono-sql
select *
from crono.tables
semi join crono.columns filter (data_type = 'datetime')
```

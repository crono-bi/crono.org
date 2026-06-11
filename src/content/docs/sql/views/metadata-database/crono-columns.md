---
title: "crono.columns"
---

La vista `crono.columns` devuelve información sobre todas las columnas de todas las tablas y vistas de la base de datos. Es similar a la vista ANSI `INFORMATION_SCHEMA.COLUMNS`, pero la vista de Crono está muy enriquecida: además del tipo de datos y las propiedades básicas de cada columna, indica si la columna forma parte de una clave primaria, de una clave externa o de un índice, y si tiene una restricción de valor predeterminado definida.

Sus columnas son las siguientes:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `schema_name` | Nombre del esquema al que pertenece la tabla o vista |
| `table_name` | Nombre de la tabla o vista |
| `column_name` | Nombre de la columna |
| `position` | Posición ordinal de la columna en la tabla |
| `column_default` | Valor predeterminado de la columna |
| `data_type` | Tipo de datos de la columna |
| `maximum_length` | Longitud máxima en bytes para tipos de cadena |
| `numeric_precision` | Precisión numérica para tipos numéricos |
| `numeric_scale` | Escala numérica para tipos numéricos |
| `collation_name` | Nombre de la intercalación de la columna |
| `is_nullable` | `true` si la columna admite valores nulos; `false` en caso contrario |
| `is_primary_key` | `true` si la columna forma parte de la clave primaria; `false` en caso contrario |
| `is_identity` | `true` si la columna es autonumérica (identity); `false` en caso contrario |
| `is_unique` | `true` si la columna tiene una restricción de unicidad; `false` en caso contrario |
| `is_non_unique_index` | `true` si la columna forma parte de un índice no único; `false` en caso contrario |
| `is_foreign_key` | `true` si la columna forma parte de una clave externa; `false` en caso contrario |
| `default_constraint_name` | Nombre de la restricción de valor predeterminado asociada a la columna |
| `non_unique_index_name` | Nombre del índice no único al que pertenece la columna |

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

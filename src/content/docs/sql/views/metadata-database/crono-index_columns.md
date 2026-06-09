---
title: "crono.index_columns"
---

Devuelve información sobre las columnas que forman parte de cada índice de la base de datos. Cuando un índice está compuesto por varias columnas, aparece una fila por cada columna que lo integra.

Toma información de la vista de sistema `sys.index_columns` de **SQL Server**.

La vista `crono.index_columns` devuelve las siguientes columnas:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `schema_name` | Nombre del esquema al que pertenece la tabla |
| `table_name` | Nombre de la tabla |
| `index_name` | Nombre del índice |
| `is_unique` | `true` si el índice es único; `false` en caso contrario |
| `is_primary_key` | `true` si el índice corresponde a la clave primaria; `false` en caso contrario |
| `is_disabled` | `true` si el índice está deshabilitado; `false` en caso contrario |
| `is_clustered` | `true` si el índice es agrupado (*clustered*); `false` en caso contrario |
| `column_name` | Nombre de la columna que forma parte del índice |

El siguiente ejemplo devuelve todas las columnas de todos los índices de la base de datos:

```crono-sql
select *
from crono.index_columns
```

El siguiente ejemplo lista las columnas que forman parte de las claves primarias:

```crono-sql
select schema_name, table_name, index_name, column_name
from crono.index_columns
where is_primary_key = TRUE
order by schema_name, table_name
```

El siguiente ejemplo muestra todas las columnas indexadas de una tabla concreta:

```crono-sql
select index_name, column_name, is_unique, is_clustered
from crono.index_columns
where table_name = 'Orders'
order by index_name
```

## Compatibilidad

**Snowflake**, **BigQuery**, **Databricks** y **DuckDB** no admiten índices definidos por el usuario. En estos motores la vista devuelve un conjunto de resultados vacío sin producir ningún error.

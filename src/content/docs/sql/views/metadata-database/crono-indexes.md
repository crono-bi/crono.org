---
title: "crono.indexes"
---

Devuelve información sobre todos los índices definidos en la base de datos, incluyendo si son únicos, agrupados o si corresponden a una clave primaria.

Toma información de la vista de sistema `sys.indexes` de **SQL Server**.

La vista `crono.indexes` devuelve las siguientes columnas:

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

El siguiente ejemplo devuelve todos los índices de la base de datos:

```crono-sql
select *
from crono.indexes
```

El siguiente ejemplo lista las tablas que no tienen ningún índice definido:

```crono-sql
select t.schema_name, t.table_name
from crono.tables t
where t.is_table = TRUE
  and not exists (
    select 1
    from crono.indexes i
    where i.schema_name = t.schema_name
      and i.table_name = t.table_name
  )
```

El siguiente ejemplo muestra los índices únicos no agrupados de la base de datos:

```crono-sql
select schema_name, table_name, index_name
from crono.indexes
where is_unique = TRUE
    and is_clustered = FALSE
    and is_primary_key = FALSE
order by schema_name, table_name
```

## Compatibilidad

**Snowflake**, **BigQuery**, **Databricks** y **DuckDB** no admiten índices definidos por el usuario. En estos motores la vista devuelve un conjunto de resultados vacío sin producir ningún error.

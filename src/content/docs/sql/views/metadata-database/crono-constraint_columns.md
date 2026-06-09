---
title: "crono.constraint_columns"
---

Devuelve información sobre las columnas que participan en las restricciones de todas las tablas de la base de datos. Cuando una restricción está compuesta por varias columnas, aparece una fila por cada columna que la integra.

Es similar a la vista ANSI `INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE`

La vista `crono.constraint_columns` devuelve las siguientes columnas:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `schema_name` | Nombre del esquema al que pertenece la tabla |
| `table_name` | Nombre de la tabla |
| `constraint_name` | Nombre de la restricción |
| `position` | Posición ordinal de la columna en la restricción |
| `column_name` | Nombre de la columna que participa en la restricción |

El siguiente ejemplo devuelve todas las columnas de todas las restricciones de la base de datos:

```crono-sql
select *
from crono.constraint_columns
```

El siguiente ejemplo lista las columnas que forman parte de claves primarias:

```crono-sql
select cc.schema_name, cc.table_name, cc.column_name
from crono.constraint_columns cc
  inner join crono.constraints c
    on c.schema_name = cc.schema_name
    and c.table_name = cc.table_name
    and c.constraint_name = cc.constraint_name
where c.is_primary_key
order by cc.schema_name, cc.table_name, cc.position
```

El siguiente ejemplo muestra todas las columnas de las restricciones de una tabla concreta:

```crono-sql
select constraint_name, position, column_name
from crono.constraint_columns
where table_name = 'Orders'
order by constraint_name, position
```

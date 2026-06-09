---
title: "crono.constraint_columns"
---

La vista `crono.constraint_columns` devuelve información sobre las columnas que participan en las restricciones de todas las tablas de la base de datos. Cuando una restricción está compuesta por varias columnas, aparece una fila por cada columna que la integra.

Es similar a la vista ANSI `INFORMATION_SCHEMA.KEY_COLUMN_USAGE`

Sus columnas son las siguientes:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `schema_name` | Nombre del esquema al que pertenece la tabla |
| `table_name` | Nombre de la tabla |
| `constraint_name` | Nombre de la restricción |
| `position` | Posición ordinal de la columna en la restricción |
| `column_name` | Nombre de la columna que participa en la restricción |

## Ejemplos

El siguiente ejemplo devuelve todas las columnas de todas las restricciones de la base de datos:

```crono-sql
select *
from crono.constraint_columns
```

El siguiente ejemplo lista las columnas que forman parte de claves primarias:

```crono-sql
select 
  cc.schema_name, 
  cc.table_name,
  cc.column_name
from crono.constraint_columns cc
inner join crono.constraints c using (schema_name, table_name, constraint_name)
where c.is_primary_key = TRUE
```


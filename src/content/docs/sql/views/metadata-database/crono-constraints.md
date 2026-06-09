---
title: "crono.constraints"
---

La vista `crono.constraints` devuelve información sobre las restricciones definidas en todas las tablas de la base de datos. Incluye claves primarias (`PRIMARY KEY`), claves externas (`FOREIGN KEY`), restricciones de unicidad (`UNIQUE`) y restricciones de comprobación (`CHECK`).

Es similar a la vista ANSI `INFORMATION_SCHEMA.TABLE_CONSTRAINTS`, pero la vista de Crono está enriquecida con información adicional: añade indicadores booleanos por tipo de restricción y, en el caso de las claves externas, incluye información sobre la clave primaria referenciada (`pk_database_name`, `pk_schema_name`, `pk_table_name`, `primary_key_name`).

Sus columnas son las siguientes:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `schema_name` | Nombre del esquema al que pertenece la tabla |
| `table_name` | Nombre de la tabla |
| `constraint_name` | Nombre de la restricción |
| `constraint_type` | Tipo de restricción (`PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `CHECK`) |
| `is_primary_key` | `true` si la restricción es una clave primaria; `false` en caso contrario |
| `is_foreign_key` | `true` si la restricción es una clave externa; `false` en caso contrario |
| `is_unique` | `true` si la restricción es un índice único; `false` en caso contrario |
| `is_check` | `true` si la restricción es una restricción `CHECK`; `false` en caso contrario |
| `primary_key_name` | Nombre de la clave primaria referenciada (solo para claves externas) |
| `pk_database_name` | Base de datos de la clave primaria referenciada |
| `pk_schema_name` | Esquema de la clave primaria referenciada |
| `pk_table_name` | Tabla de la clave primaria referenciada |

## Ejemplos

El siguiente ejemplo devuelve todas las restricciones de la base de datos:

```crono-sql
select *
from crono.constraints
```

El siguiente ejemplo identifica las tablas que no tienen ninguna clave primaria definida:

```crono-sql
select 
  t.schema_name, 
  t.table_name
from crono.tables filter (is_table = TRUE) t
anti join crono.constraints filter (is_primary_key = TRUE) c using (schema_name, table_name)
```

## Vistas relacionadas

[`crono.constraint_columns`](/sql/views/metadata-database/crono-constraint_columns/) permite identificar las columnas que participan en cada restricción.

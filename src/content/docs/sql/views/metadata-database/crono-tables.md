---
title: "crono.tables"
---

La vista `crono.tables` devuelve información sobre todas las tablas y vistas de la base de datos.

Es similar a la vista ANSI `INFORMATION_SCHEMA.TABLES`

Sus columnas son las siguientes:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `schema_name` | Nombre del esquema al que pertenece la tabla o vista |
| `table_name` | Nombre de la tabla o vista |
| `table_type` | Tipo de objeto; el valor concreto puede variar según el motor de base de datos |
| `is_table` | `true` si el objeto es una tabla; `false` en caso contrario |
| `is_view` | `true` si el objeto es una vista; `false` en caso contrario |

## Ejemplos

El siguiente ejemplo devuelve todas las tablas y vistas de la base de datos:

```crono-sql
select *
from crono.tables
```

El siguiente ejemplo lista únicamente las tablas de usuario, excluyendo las vistas:

```crono-sql
select *
from crono.tables
where is_table = TRUE
```

El siguiente ejemplo identifica las tablas que no tienen ninguna clave primaria definida:

```crono-sql
select t.schema_name, t.table_name
from crono.tables t
where t.is_table = TRUE
  and not exists (
    select 1
    from crono.constraints c
    where c.schema_name = t.schema_name
      and c.table_name = t.table_name
      and c.is_primary_key = TRUE
  )
```

## Vistas relacionadas

Las siguientes vistas permiten consultar los elementos asociados a las tablas:

- [`crono.columns`](/sql/views/metadata-database/crono-columns/) devuelve las columnas de cada tabla.
- [`crono.indexes`](/sql/views/metadata-database/crono-indexes/) devuelve los índices definidos sobre las tablas.
- [`crono.foreign_keys`](/sql/views/metadata-database/crono-foreign_keys/) devuelve las claves externas de las tablas.
- [`crono.constraints`](/sql/views/metadata-database/crono-constraints/) devuelve las restricciones definidas sobre las tablas.

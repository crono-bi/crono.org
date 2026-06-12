---
title: "crono.foreign_keys"
---

La vista `crono.foreign_keys` devuelve información sobre todas las claves externas de la base de datos, incluyendo la tabla y la clave primaria referenciada, así como las reglas de actualización y eliminación definidas.

Es similar a la vista `INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS`

Sus columnas son las siguientes:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `schema_name` | Nombre del esquema al que pertenece la tabla |
| `table_name` | Nombre de la tabla que define la clave externa |
| `constraint_name` | Nombre de la clave externa |
| `unique_constraint_name` | Nombre de la restricción única referenciada |
| `unique_constraint_type` | Tipo de la restricción única referenciada |
| `referenced_database_name` | Nombre de la base de datos referenciada |
| `referenced_schema_name` | Nombre del esquema de la tabla referenciada |
| `referenced_table_name` | Nombre de la tabla referenciada |
| `match_option` | Opción de coincidencia de la clave externa |
| `update_rule` | Acción al actualizar la clave referenciada |
| `delete_rule` | Acción al eliminar la clave referenciada |

## Ejemplos

El siguiente ejemplo devuelve todas las claves externas de la base de datos:

```crono-sql
select *
from crono.foreign_keys
```

El siguiente ejemplo lista todas las claves externas que referencian a una tabla concreta:

```crono-sql
select schema_name, table_name, constraint_name
from crono.foreign_keys
where referenced_table_name = 'Customers'
order by schema_name, table_name
```

El siguiente ejemplo muestra las claves externas que tienen una regla de eliminación en cascada:

```crono-sql
select schema_name, table_name, constraint_name, referenced_table_name
from crono.foreign_keys
where delete_rule = 'CASCADE'
order by schema_name, table_name
```

## Vistas relacionadas

[`crono.foreign_key_columns`](/sql/views/metadata-database/crono-foreign_key_columns/) permite identificar las columnas que participan en cada clave externa.

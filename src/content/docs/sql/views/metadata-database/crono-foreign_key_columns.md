---
title: "crono.foreign_key_columns"
---

La vista `crono.foreign_key_columns` devuelve información sobre las columnas que participan en las claves externas de la base de datos. Cuando una clave externa está compuesta por varias columnas, aparece una fila por cada columna que la integra.

Sus columnas son las siguientes:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `schema_name` | Nombre del esquema al que pertenece la tabla |
| `constraint_name` | Nombre de la clave externa |
| `table_name` | Nombre de la tabla que define la clave externa |
| `position` | Posición ordinal de la columna en la clave externa |
| `column_name` | Nombre de la columna de la tabla origen |
| `is_nullable` | `true` si la columna admite valores nulos; `false` en caso contrario |
| `referenced_database_name` | Nombre de la base de datos referenciada |
| `referenced_schema_name` | Nombre del esquema de la tabla referenciada |
| `referenced_table_name` | Nombre de la tabla referenciada |
| `referenced_column_name` | Nombre de la columna referenciada |

## Ejemplos

El siguiente ejemplo devuelve todas las columnas de todas las claves externas de la base de datos:

```crono-sql
select *
from crono.foreign_key_columns
```

El siguiente ejemplo muestra el detalle de columnas de una clave externa concreta, ordenado por posición:

```crono-sql
select position, column_name, referenced_table_name, referenced_column_name
from crono.foreign_key_columns
where constraint_name = 'FK_Orders_Customers'
order by position
```

El siguiente ejemplo lista las columnas que forman parte de claves externas y admiten valores nulos:

```crono-sql
select schema_name, table_name, constraint_name, column_name
from crono.foreign_key_columns
where is_nullable = TRUE
order by schema_name, table_name
```

---
title: "crono.schemas"
---

Devuelve información sobre los esquemas de la base de datos. Un esquema es un contenedor lógico que agrupa objetos como tablas, vistas y procedimientos.

Es similar a la vista ANSI `INFORMATION_SCHEMA.SCHEMATA`

La vista `crono.schemas` devuelve las siguientes columnas:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `schema_name` | Nombre del esquema |
| `schema_owner` | Propietario del esquema |
| `default_character_set_name` | Nombre del juego de caracteres predeterminado del esquema |

El siguiente ejemplo devuelve todos los esquemas de la base de datos:

```crono-sql
select *
from crono.schemas
```

El siguiente ejemplo lista los esquemas junto con su propietario, ordenados por nombre:

```crono-sql
select schema_name, schema_owner
from crono.schemas
order by schema_name
```

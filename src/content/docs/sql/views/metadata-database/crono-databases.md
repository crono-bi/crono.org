---
title: "crono.databases"
---

La vista `crono.databases` devuelve información sobre todas las bases de datos de la instancia, incluyendo su estado, el modo de acceso configurado y si se trata de una base de datos del sistema.

Sus columnas son las siguientes:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `collation_name` | Nombre de la intercalación de la base de datos |
| `user_access` | Modo de acceso de usuario configurado en la base de datos |
| `state` | Estado de la base de datos |
| `is_system_database` | `true` si es una base de datos del sistema; `false` en caso contrario |

## Ejemplos

El siguiente ejemplo devuelve todas las bases de datos de la instancia:

```crono-sql
select *
from crono.databases
```

El siguiente ejemplo lista únicamente las bases de datos de usuario, excluyendo las del sistema:

```crono-sql
select *
from crono.databases
where is_system_database = FALSE
```

## Vistas relacionadas

- [`crono.schemas`](/sql/views/metadata-database/crono-schemas/) permite consultar los esquemas de cada base de datos.
- [`crono.tables`](/sql/views/metadata-database/crono-tables/) permite consultar las tablas y vistas de cada base de datos.

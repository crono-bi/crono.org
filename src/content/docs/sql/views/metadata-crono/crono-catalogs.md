---
title: "crono.catalogs"
---


La vista `crono.catalogs` devuelve información sobre los catálogos definidos en el proyecto Crono ETL.

```crono-sql
select *
from crono.catalogs
```

## Columnas

| Columna | Descripción |
|---|---|
| `catalog_name` | Nombre del catálogo |
| `guid` | Identificador único del catálogo |
| `business_item_count` | Número de elementos de negocio del catálogo |
| `table_count` | Número de tablas del catálogo |
| `join_count` | Número de joins del catálogo |


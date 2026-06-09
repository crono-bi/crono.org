---
title: "crono.catalogs"
---

La vista `crono.catalogs` devuelve información sobre los catálogos definidos en el proyecto Crono ETL.

```crono-sql
select *
from crono.catalogs
```

:::caution[En construcción]
Esta documentación está en proceso de construcción. Los nombres de las columnas finalmente respetarán la convención snake_case.
:::

## Columnas

| Columna | Descripción |
|---|---|
| Name | Nombre del catálogo |
| Guid | Identificador único del catálogo |
| BusinessItemCount | Número de elementos de negocio del catálogo |
| TableCount | Número de tablas del catálogo |
| JoinCount | Número de joins del catálogo |

---
title: "crono.virtual_views"
---

La vista `crono.virtual_views` devuelve las vistas virtuales definidas en el proyecto Crono ETL.

```crono-sql
select *
from crono.virtual_views
```

:::caution[En construcción]
Esta documentación está en proceso de construcción. Los nombres de las columnas finalmente respetarán la convención snake_case.
:::

## Columnas

| Columna | Descripción |
|---|---|
| Name | Nombre de la vista virtual |
| SchemaName | Nombre del esquema de la tabla subyacente |
| TableName | Nombre de la tabla subyacente |

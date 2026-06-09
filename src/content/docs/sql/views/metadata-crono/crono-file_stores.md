---
title: "crono.file_stores"
---

La vista `crono.file_stores` devuelve los almacenes de ficheros configurados en el proyecto Crono ETL.

```crono-sql
select *
from crono.file_stores
```

:::caution[En construcción]
Esta documentación está en proceso de construcción. Los nombres de las columnas finalmente respetarán la convención snake_case.
:::

## Columnas

| Columna | Descripción |
|---|---|
| Name | Nombre del almacén de ficheros |
| Type | Tipo de almacén de ficheros |
| Description | Descripción del almacén de ficheros |

---
title: "crono.file_stores"
---


La vista `crono.file_stores` devuelve los almacenes de ficheros configurados en el proyecto Crono ETL.

```crono-sql
select *
from crono.file_stores
```

## Columnas

| Columna | Descripción |
|---|---|
| `file_store_name` | Nombre del almacén de ficheros |
| `file_store_type` | Tipo de almacén de ficheros |
| `description` | Descripción del almacén de ficheros |


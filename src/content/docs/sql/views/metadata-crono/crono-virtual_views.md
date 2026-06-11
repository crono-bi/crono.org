---
title: "crono.virtual_views"
---


La vista `crono.virtual_views` devuelve las vistas virtuales definidas en el proyecto Crono ETL.

```crono-sql
select *
from crono.virtual_views
```

## Columnas

| Columna | Descripción |
|---|---|
| `schema_name` | Nombre del esquema de la vista virtual |
| `view_name` | Nombre de la vista virtual |
| `full_name` | Nombre completo de la vista virtual, incluyendo el esquema |


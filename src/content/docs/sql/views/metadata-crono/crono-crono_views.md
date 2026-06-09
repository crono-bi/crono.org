---
title: "crono.crono_views"
---



Devuelve el listado de pseudovistas propias de Crono.

```crono-sql
select *
from crono.crono_views
```

## Columnas

| Columna | Descripción |
|---|---|
| `schema_name` | Nombre del esquema al que pertenece la vista |
| `view_name` | Nombre de la vista |
| `full_name` | Nombre completo de la vista, incluyendo el esquema |
| `category` | Categoría de la vista |
| `is_stable` | Indica si la vista es estable |
| `assembly` | Ensamblado en el que está implementada la vista |
| `base_type` | Tipo base de la vista |

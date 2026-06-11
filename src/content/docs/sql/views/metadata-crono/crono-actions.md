---
title: "crono.actions"
---




La función `crono.actions` devuelve el listado de acciones propias de Crono.

```crono-sql
select *
from crono.actions
```

## Columnas

| Columna | Descripción |
|---|---|
| `action_name` | Nombre de la acción |
| `alternative_name` | Nombre alternativo, disponible en algunas acciones, que puede usarse igual que el nombre principal |
| `internal_type_name` | Nombre interno identificativo de la acción |
| `category` | Categoría de la acción (meramente informativo) |
| `has_data_property` | `true` si la acción admite la propiedad `Data`; `false` en caso contrario |





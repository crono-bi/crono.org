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
| Name | Nombre de la acción |
| AlternativeName | Nombre alternativo, disponible en algunas acciones, que puede usarse igual que el nombre principal |
| TypeName | Nombre interno identificativo de la acción |
| Category | Categoría de la acción (meramente informativo) |
| HasDataProperty | Indica si la acción admite la propiedad `Data` |




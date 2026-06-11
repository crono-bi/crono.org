---
title: "crono.action_properties"
---



La función `crono.action_properties` devuelve las propiedades que admiten las acciones propias de Crono.


```crono-sql
select *
from crono.action_properties
```

## Columnas

| Columna | Descripción |
|---|---|
| `action_name` | Nombre de la acción |
| `property_name` | Nombre de la propiedad |
| `property_type` | Tipo de dato de la propiedad (numérico, texto, booleano, etc.) |
| `alternative_property_name` | Nombre alternativo de la propiedad |


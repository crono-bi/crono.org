---
title: "crono.action_properties"
---


La función `crono.action_properties` devuelve las propiedades que admiten las acciones propias de Crono.


```crono-sql
select *
from crono.action_properties
```

:::caution[En construcción]
Esta documentación está en proceso de construcción. Los nombres de las columnas finalmente respetarán la convención snake_case.
:::

## Columnas

| Columna | Descripción |
|---|---|
| Name | Nombre de la acción |
| TypeName | Nombre interno identificativo de la acción |
| PropertyName | Nombre de la propiedad |
| PropertyType | Tipo de dato de la propiedad (numérico, texto, booleano, etc.) |
| AlternativeName | Nombre alternativo que puede usarse para referirse a la propiedad |

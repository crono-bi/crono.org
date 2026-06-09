---
title: "crono.crono_view_properties"
---



La pseudovista `crono.crono_view_properties` devuelve las propiedades que admiten las pseudovistas con parámetros.

```crono-sql
SELECT *
FROM crono.crono_view_properties
```

:::caution[En construcción]
Esta documentación está en proceso de construcción. Los nombres de las columnas finalmente respetarán la convención snake_case.
:::

## Columnas

| Columna | Descripción |
|---|---|
| Name | Nombre de la pseudovista |
| PropertyName | Nombre de la propiedad |
| PropertyType | Tipo de dato de la propiedad (numérico, texto, booleano, etc.) |


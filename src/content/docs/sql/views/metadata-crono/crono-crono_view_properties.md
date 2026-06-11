---
title: "crono.crono_view_properties"
---




La pseudovista `crono.crono_view_properties` devuelve las propiedades que admiten las pseudovistas con parámetros.

```crono-sql
SELECT *
FROM crono.crono_view_properties
```

## Columnas

| Columna | Descripción |
|---|---|
| `schema_name` | Nombre del esquema al que pertenece la vista |
| `view_name` | Nombre de la vista |
| `full_name` | Nombre completo de la vista, incluyendo el esquema |
| `property_name` | Nombre de la propiedad |
| `property_type` | Tipo de dato de la propiedad (numérico, texto, booleano, etc.) |



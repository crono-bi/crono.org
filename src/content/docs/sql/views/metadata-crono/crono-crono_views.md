---
title: "crono.crono_views"
---

La vista `crono.crono_views` devuelve el catálogo de vistas propias de Crono SQL. Aunque se denominan "vistas" y se invocan con la sintaxis habitual de vistas, no son objetos físicos en la base de datos: Crono SQL las resuelve generando subconsultas adaptadas al dialecto de cada motor en el momento de compilar el código.

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


El campo `category` agrupa las vistas en las mismas 4 categorías que se documentan en el apartado **Vistas** de este manual:

- **Tiempo** — vistas de fechas, semanas y meses.
- **Metadatos Crono** — vistas propias del lenguaje Crono SQL.
- **Metadatos DB** — metadatos y esquema de las bases de datos.
- **ETL** — vistas orientadas a la carga y transformación de datos.

El campo `is_stable` distingue las vistas oficiales de las experimentales. Las vistas estables funcionan correctamente en todos los motores soportados. Las vistas no estables tienen carácter experimental: su comportamiento no está garantizado en todos los motores, y pueden cambiar o desaparecer en versiones futuras. Se desaconseja su uso en entornos productivos.

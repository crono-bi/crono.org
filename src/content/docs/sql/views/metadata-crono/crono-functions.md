---
title: "crono.functions"
---




Devuelve el listado de funciones SQL soportadas por Crono. Incluye las funciones propias de Crono, las funciones SQL ANSI, y las principales funciones de SQL Server u otros motores de bases de datos.

Este listado es meramente informativo, pues Crono permite usar cualquier función que soporte la base de datos (esté incluido en este listado o no)

```crono-sql
select *
from crono.functions
```

## Columnas

| Columna | Descripción |
|---|---|
| `function_category` | Categoría de la función |
| `function_name` | Nombre de la función |
| `synonyms` | Sinónimos o nombres alternativos de la función |

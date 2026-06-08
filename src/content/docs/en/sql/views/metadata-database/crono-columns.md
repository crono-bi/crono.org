---
title: "crono.columns"
---


Devuelve información sobre todas las columnas de todas las vistas y tablas de la base de datos.

Es similar a la vista ANSI `INFORMATION_SCHEMA.[COLUMNS]`


```crono-sql
select *
from crono.columns
```

## Comentario

Esta pseudovista es muy similar a `crono.AnsiColumns`. La diferencia es que `crono.AnsiColumns` solo llama a vistas de `INFORMATION_SCHEMA` que forman parte del estándar ANSI, por lo que puede usarse en cualquier base de datos que cumpla el estándar. En cambio `crono.columns` utiliza vistas o funciones de sistema que son propias de **SQL Server**.

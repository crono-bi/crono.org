---
SidebarGroup: "Metadatos base de datos"
---

# Crono$Columns

Devuelve información sobre todas las columnas de todas las vistas y tablas de la base de datos.

Es similar a la vista ANSI `INFORMATION_SCHEMA.[COLUMNS]`


```
select *
from Crono$Columns
```

## Comentario

Esta pseudovista es muy similar a `Crono$AnsiColumns`. La diferencia es que `Crono$AnsiColumns` solo llama a vistas de `INFORMATION_SCHEMA` que forman parte del estándar ANSI, por lo que puede usarse en cualquier base de datos que cumpla el estándar. En cambio `Crono$Columns` utiliza vistas o funciones de sistema que son propias de **SQL Server**.

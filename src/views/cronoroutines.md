---
SidebarGroup: "index-db-views"
---

# Crono$Routines


Devuelve información sobre los procedimientos y funciones de la base de datos. 



Es similar a la vista ANSI `INFORMATION_SCHEMA.[ROUTINES]`


```
select *
from Crono$Routines
```


## Comentario

Esta pseudovista es muy similar a `Crono$Procedures`. La diferencia es que `Crono$Routines` solo llama a vistas de `INFORMATION_SCHEMA` que forman parte del estándar ANSI, por lo que puede usarse en cualquier base de datos que cumpla el estándar. En cambio `Crono$Procedures` utiliza vistas o funciones de sistema que son propias de **SQL Server**.

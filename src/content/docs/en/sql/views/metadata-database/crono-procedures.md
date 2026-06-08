---
title: "crono.procedures"
---



Devuelve información sobre los procedimientos y funciones de la base de datos. 



Es similar a la vista ANSI `INFORMATION_SCHEMA.[ROUTINES]`


```crono-sql
select *
from crono.procedures
```


## Comentario

Esta pseudovista es muy similar a `crono.routines`. La diferencia es que `crono.routines` solo llama a vistas de `INFORMATION_SCHEMA` que forman parte del estándar ANSI, por lo que puede usarse en cualquier base de datos que cumpla el estándar. En cambio `crono.procedures` utiliza vistas o funciones de sistema que son propias de **SQL Server**.

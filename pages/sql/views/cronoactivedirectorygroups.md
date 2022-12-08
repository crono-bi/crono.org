---
SidebarGroup: "index-ad-views"
---

# Crono$ActiveDirectoryGroups

Devuelve el listado de grupos del Directorio Activo, incluyendo su nombre y su *DistinguishedName*.

```
select *
from Crono$ActiveDirectoryGroups
```


## Comentario

Como todas las pseudo-vistas contra el Direcotrio Activo, `Crono$ActiveDirectoryGroups` se evalúa mientras se genera el código SQL y no mientras se ejecuta la sentencia. No lo evalúa la base de datos.

Se recomienda utilizar estas pseudo-vistas para guardar la información relevante de cada proyecto en tablas propias, y llamar a estas tablas propias desde la aplicación.
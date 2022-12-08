---
SidebarGroup: "index-ad-views"
---

# Crono$ActiveDirectoryUsers



Devuelve el listado de usuarios del Directorio Activo.

```
select *
from Crono$ActiveDirectoryUsers
```

Si se incluye un argumento con el nombre de un grupo, devuelve los usuarios de dicho grupo.


```
select *
from Crono$ActiveDirectoryUsers('Administradores')
```


## Comentario

Como todas las pseudo-vistas contra el Direcotrio Activo, `Crono$ActiveDirectoryMyGroups` se evalúa mientras se genera el código SQL y no mientras se ejecuta la sentencia. No lo evalúa la base de datos.

Se recomienda utilizar estas pseudo-vistas para guardar la información relevante de cada proyecto en tablas propias, y llamar a estas tablas propias desde la aplicación.
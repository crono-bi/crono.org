﻿---
SidebarGroup: "index-date-functions"
Autogenerated: true
---

# tomorrow ❇️

La función `tomorrow` devuelve la fecha (tipo **date**) correspondiente al día de mañana.


## Ejemplo

```
select tomorrow() as result;
```

El código SQL generado es:

```
SELECT cast(getdate()+1 as date) AS result
```


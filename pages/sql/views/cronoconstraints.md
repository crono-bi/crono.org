﻿---
SidebarGroup: "index-db-views"
---

# Crono$Constraints


Devuelve información sobre las restricciones de todas las tablas de la base de datos. Incluye información sobre todas las `FOREIGN KEY`, `PRIMARY KEY` y  `UNIQUE INDEXES` de las tablas.

Es similar a la vista ANSI `INFORMATION_SCHEMA.TABLE_CONSTRAINTS`


```
select *
from Crono$Constraints
```

---
title: "crono.connections"
---


La vista `crono.connections` devuelve las conexiones de base de datos definidas en el proyecto Crono ETL.

```crono-sql
select *
from crono.connections
```

## Columnas

| Columna | Descripción |
|---|---|
| `connection_name` | Nombre de la conexión |
| `sql_dialect` | Dialecto SQL del motor de base de datos |
| `connection_type` | Tipo de conexión |
| `is_default_connection` | `true` si es la conexión predeterminada del proyecto; `false` en caso contrario |


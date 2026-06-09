---
title: "crono.connections"
---

La vista `crono.connections` devuelve las conexiones de base de datos definidas en el proyecto Crono ETL.

```crono-sql
select *
from crono.connections
```

:::caution[En construcción]
Esta documentación está en proceso de construcción. Los nombres de las columnas finalmente respetarán la convención snake_case.
:::

## Columnas

| Columna | Descripción |
|---|---|
| Name | Nombre de la conexión |
| SqlDialect | Dialecto SQL del motor de base de datos |
| Type | Tipo de conexión |
| DefaultConnection | Indica si es la conexión predeterminada del proyecto |

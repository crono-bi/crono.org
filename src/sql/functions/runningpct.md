﻿---
SidebarGroup: "index-aggregation-functions"
Autogenerated: true
---

# runningpct ❇️

La función `runningpct` es una función de ventana que devuelve el porcentaje acumulado de un indicador desde el inicio del rango respecto el total.

Requiere la cláusula ORDER BY en la partición OVER.

Se puede usar tanto la sintaxis `OVER` del SQL estándar como la sintaxis compacta propia de Crono.

## Ejemplo

La siguiente consulta devuelve el porcentaje de ventas acumulado (*year to date* ) para cada mes .

```
select 
  year(fecha) anyo,
  month(fecha) mes,
  sum(unidades) ventas,
  runningpct(ventas partition by anyo order by mes)
from dbo.lb_ventas
group by all
```

La consulta SQL generada es:

```
SELECT
  year(fecha) AS anyo,
  month(fecha) AS mes,
  sum(unidades) AS ventas,
  CASE WHEN sum(sum(unidades)) OVER (PARTITION BY year(fecha))<>0 THEN 1.0*sum(sum(unidades)) OVER (PARTITION BY year(fecha) ORDER BY month(fecha) ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)/sum(sum(unidades)) OVER (PARTITION BY year(fecha)) END AS expr4
FROM dbo.lb_ventas
GROUP BY
  year(fecha),
  month(fecha)
```


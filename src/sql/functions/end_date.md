
# end_date

La función `end_date` en una función de ventana que calcula la fecha final de un periodo *inicio-fin* a partir de la fecha inicial.

Es útil para calcular la fdecha final del periodo en aquellos casos donde la tabla solo contiene la fecha de inicio de cada periodio.

**Sintaxis:**

````
end_date(fecha_inicio) OVER (PARTITION BY <columns>)
```

Como en todas las funciones de ventana se puede usar la sintaxis compacta:


````
end_date(fecha_inicio PARTITION BY <columns>)
```

## Ejemplo:

El siguiente ejemplo muestra la fecha de inicio y fin de cada escandallo:

```
select 
	articulo, 
	coste, 
	fecha FechaInicio, 
	end_date(fecha partition by articulo) FechaFin
from stg.escandallos
```

El código generado es:

```
SELECT
  articulo,
  coste,
  fecha AS FechaInicio,
  coalesce(max(dateadd(d,-1,fecha)) OVER (PARTITION BY articulo ORDER BY fecha ROWS BETWEEN 1 FOLLOWING And 1 FOLLOWING),'21000101') AS FechaFin
FROM stg.escandallos
```

 ## Comentarios

 - La fecha de inicio debe ser una fecha `DATE` sin hora.
 - La función `END_DATETIME` es equivalente cuando la fecha inicial es `DATETIME`
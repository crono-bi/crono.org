
# is_last

La función `is_last` es una función de ventana que identifica la fila final del rango.

**Sintaxis:**

```
is_last() over (PARTITION BY ... ORDER BY ...)
````

Como todas las funciones de ventana admite la sintaxis compacta:

```
is_last(PARTITION BY ... ORDER BY ...)
```

# Ejemplo

La siguiente sentencia usa las funciiones `is_first` y `is_last` para identificar el primer y último escandallo de cada artículo.

```
select 
	articulo, 
	coste, 
	fecha FechaInicio, 
	end_datetime(fecha partition by articulo) Fechafin,
	is_first(partition by articulo order by fecha) EsPrimerEscandallo,
	is_last(partition by articulo order by fecha) EsUltimoEscandallo
from stg.escandallos
```

El código generado es:

```
SELECT
  articulo,
  coste,
  fecha AS FechaInicio,
  coalesce(max(fecha) OVER (PARTITION BY articulo ORDER BY fecha ROWS BETWEEN 1 FOLLOWING And 1 FOLLOWING),'21000101') AS Fechafin,
  CAST(CASE WHEN ROW_NUMBER() OVER (PARTITION BY articulo ORDER BY fecha)=1 THEN 1 ELSE 0 END AS bit) AS EsPrimerEscandallo,
  CAST(CASE WHEN ROW_NUMBER() OVER (PARTITION BY articulo ORDER BY fecha DESC)=1 THEN 1 ELSE 0 END AS bit) AS EsUltimoEscandallo
FROM stg.escandallos
```

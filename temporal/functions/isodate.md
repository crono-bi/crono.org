

# isodate



La función `ISODATE()`convierte una fecha en una cadena de texto con el formato ISO 8601, es decir, 'YYYY-MM-DD'. 

Este formato es estándar, ordenable alfabéticamente y ampliamente utilizado para representar fechas de forma clara y sin ambigüedades.


## Ejemplo


```
select ISODATE(cast('20260101' as date)) as result; -- Devuelve 2026-01-01
```

El código SQL generado es:

```
SELECT CONVERT(char(10), CAST('20260101' AS date),126) AS result
```

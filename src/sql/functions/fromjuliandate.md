
# fromjuliandate


La función `fromjuliandate` convierte un número de fecha juliana (Julian Date) a una fecha del calendario gregoriano en formato `DATE` o `DATETIME`.

**Sintaxis:**

```sql
fromjuliandate(julian_number)
```

Parámetros:

- julian_number (INT o FLOAT): El número correspondiente a una fecha juliana. Puede incluir parte decimal para representar horas, minutos y segundos.


## Ejemplo

La siguiente sentencia convierte el número juliano 2460677 a fecha 


```
SELECT fromjuliandate(2460677);
-- Resultado: '2025-01-01'
```


El código generado es:


```
SELECT dateadd(d,2460677-2451545,CAST('20000101' AS date)) AS expr1
```

## Comentarios

- El sistema de fecha juliana es un conteo continuo de días desde el 1 de enero del año 4713 a.C.
- Si el número incluye decimales, la parte fraccionaria representa el tiempo dentro del día (por ejemplo, .5 es mediodía).
- Útil en aplicaciones astronómicas, históricas o cuando se manejan fuentes de datos que utilizan fechas julianas.
- No debe confundirse con el “número de día juliano” (año + día del año) usado en algunos entornos comerciales.


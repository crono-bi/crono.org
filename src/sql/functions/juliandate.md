
# juliandate


La función `juliandate` convierte una fecha del calendario gregoriano a su equivalente en formato de **fecha juliana** (Julian Date), que representa el número de días (y fracción del día) transcurridos desde el 1 de enero del año 4713 a.C. a las 12:00 UTC.


**Sintaxis:**  

```sql
juliandate(fecha)
```


## Ejemplo

La siguiente sentencia convierte '2023-01-01 00:00:00' a número juliano

```
SELECT juliandate('2023-01-01');
-- Resultado: 2459946 (¿2460130.5?)
```

## Comentarios

- Funciona como el inverso de `fromjuliandate`, es decir:
- Útil en astronomía, historia, y aplicaciones que manejan cálculos precisos de fechas sin depender del calendario gregoriano.



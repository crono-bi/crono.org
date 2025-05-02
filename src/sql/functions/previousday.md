
# previousday

La función `PREVIOUSDAY()` devuelve la fecha del día anterior a la fecha proporcionada, como un valor de tipo DATE. 

Es útil para realizar comparaciones, cálculos de rangos o filtrado basado en fechas anteriores.



## Ejemplo


```
SELECT PREVIOUSDAY('2025-01-01'); -- Devuelve 2024-12-31
```

El código SQL generado es:

```
SELECT dateadd(d,-1,'2025-01-01') AS expr1
```

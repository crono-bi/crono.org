
# daysago


La función `daysago` devuelve el número de días transcurridos desde una fecha determinada hasta la fecha actual del sistema.


# Ejemplo

La siguiente sentencia devuelve el número de días transcurridos desde el 1 de enero de 2025.

```
SELECT daysago('20150101') num;
```

El código generado es:

```
SELECT datediff(d,'20250101',CAST(CURRENT_TIMESTAMP AS DATE)) AS num
```

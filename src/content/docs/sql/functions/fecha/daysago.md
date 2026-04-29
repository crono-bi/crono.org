---
title: "daysago"
---



La función `daysago` devuelve el número de días transcurridos desde una fecha determinada hasta la fecha actual del sistema.


# Ejemplo

La siguiente sentencia devuelve el número de días transcurridos desde el 1 de enero de 2025.

```crono-sql
SELECT daysago('20150101') num;
```

El código generado es:

```crono-sql
SELECT datediff(d,'20250101',CAST(CURRENT_TIMESTAMP AS DATE)) AS num
```

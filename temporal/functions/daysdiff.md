# daysdiff

La función `daysdiff` calcula el número de días completos entre dos fechas. El resultado es un valor entero que representa la diferencia en días, y puede ser positivo, negativo o cero.

**Sintaxis:**  

```sql
daysdiff(startDate, endDate)
```


## Ejemplo

La siguiente sentencia devuelve el número de días entre el 1 de enero del 2025 y el 1 de mayo de 2025.

```
select  daysdiff('20250101','20250401') num;
-- Devuelve 90
```

El código generado es:

```
SELECT datediff(d,'20250101','20250401') AS num
```



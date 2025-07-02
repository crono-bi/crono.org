
# countvalues

**Descripción:**  

La función `COUNTVALUES` devuelve el número de valores no nulos de una lista de valores proporcionados como argumentos.


**Sintaxis:**  

```sql
COUNTVALUES(valor1, valor2, ..., valorN)
```sql

## Ejemplo


```sql
-- Cuenta el número de valores no nulos
SELECT COUNTVALUES(1, 2, 3, 4, 6.5);
-- Resultado: 5
```sql

Los valores nulos se ignoran a efectos del cálculo promedio:

```sql
select COUNTVALUES(1,null,3); -- El resultado es 2
```sql




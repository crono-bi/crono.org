
# average

**Descripción:**  

La función `average` calcula el valor promedio (media aritmética) de una lista de valores numéricos proporcionados como argumentos.

Los valores nulos se ignoran a efectos del cálculo promedio.


**Sintaxis:**  

```sql
average(valor1, valor2, ..., valorN)
```

## Ejemplo


```
-- Calcula el promedio de los valores 1, 2, 3, 4 y 6.5
SELECT average(1, 2, 3, 4, 6.5);
-- Resultado: 3.3
```

Los valores nulos se ignoran a efectos del cálculo promedio:

```
select average(1,null,3); -- El resultado es 2
```





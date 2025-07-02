# adddays

La función adddays devuelve una nueva fecha que resulta de sumar un número determinado de días a una fecha base especificada.


**Sintaxis:**  

```sql
adddays(fecha_base, numero_dias)
```sql

**Argumentos:**

- fecha_base (DATETIME o DATE): Fecha inicial a la que se le agregarán (o restarán) días. Puede ser una constante, una columna o una función como getdate().
- numero_dias (INT): Número de días a agregar. Si es positivo, se suman días; si es negativo, se restan.

## Ejemplo


```sql
SELECt adddayes(getdate(),3);
```sql

El codigo generado es:

```sql
SELECT dateadd(d,3,getdate())
```sql



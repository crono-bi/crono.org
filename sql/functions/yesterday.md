

# yesterday

La función `yesterday` devuelve la fecha (tipo **date**) correspondiente al día de ayer.


## Ejemplo

```sql
select yesterday() as result;
```sql

El código SQL generado es:

```sql
SELECT cast(getdate()-1 as date) AS result
```sql


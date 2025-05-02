

# yesterday

La función `yesterday` devuelve la fecha (tipo **date**) correspondiente al día de ayer.


## Ejemplo

```
select yesterday() as result;
```

El código SQL generado es:

```
SELECT cast(getdate()-1 as date) AS result
```


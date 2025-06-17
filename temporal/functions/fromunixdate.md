
# fromunixdate

La función `fromunixdate` convierte un valor de marca de tiempo Unix (Unix timestamp) a una fecha y hora en formato `DATETIME`.


**Sintaxis:**  

```sql
fromunixdate(unix_timestamp)
```


## Ejemplo

La siguiente sentencia convierte el timestamp 1704067200 a fecha

```
SELECT fromunixdate(1704067200);
-- Resultado: '2024-01-01 00:00:00'
```

El código generado es:


```
SELECT dateadd(s,1704067200, '1970-01-01') AS expr1
```


## Comentarios

- Si se proporciona un valor decimal o en milisegundos, este debe ser convertido previamente (por ejemplo, dividiendo entre 1000 si está en milisegundos).
- El resultado puede ajustarse a la zona horaria del sistema, según el motor de base de datos.
- Equivalente a `FROM_UNIXTIME()` en MySQL o `to_timestamp()` en PostgreSQL.
- Útil para trabajar con datos almacenados en formato epoch, común en sistemas Unix, APIs y registros de eventos.



# yyyymm


La función `YYYYMM` devuelve la combinación del año y el mes de una fecha como una cadena de texto de 6 caracteres (`CHAR(6)`), en formato 'YYYYMM'. 

Es útil para generar claves temporales, agrupar registros por mes, o presentar fechas en formato compacto y ordenable.


## Ejemplo


```
select yyyy('2026-01-01') as result;  -- Devuelve 202601
```

El código SQL generado es:

```
SELECT CONVERT(CHAR(6),'2026-01-01',112) AS result
```

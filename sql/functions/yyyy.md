
# yyyy

La función `yyyy` devuelve el año de una fecha como una cadena de texto de 4 caracteres (CHAR(4)), en formato 'YYYY'. 

Es útil para extraer el año de una fecha con formato textual, ideal para etiquetar, agrupar o presentar resultados legibles.

## Ejemplo


```
select yyyy('2026-01-01') as result;  -- Devuelve 2026
```

El código SQL generado es:

```
SELECT CONVERT(CHAR(4),'2026-01-01',112) AS result
```

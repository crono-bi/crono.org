

# weekdaynumber

La función `WEEKDAY` devuelve devuelve el día de la semana de una fecha, como un número. El valor devuelto depende del primer día de la semana configurado mediante la opción SET DATEFIRST. Es comúnmente utilizada para clasificar o filtrar registros según el día de la semana.


## Ejemplo

```
select WEEKDAY('2025-01-01') as result;
```

El código SQL generado es:

```
SELECT DATENAME([WEEKDAY],'2025-01-01') AS result --Devuelve 3 (miércoles)
```

La siguiente consulta devuelve la configuración de `DATEFIRST` (el lunes será 1, martes 2, ..., domingo 7), el nombre del día de la semana y el número del número de la semana, según la configuración de `DATEFIRST`.


```
select @@DATEFIRST,weekday('2024-12-30'),weekdaynumber('2024-12-30') as result;
```

## Comentarios

- El valor devuelto depende del primer día de la semana configurado mediante la opción SET DATEFIRST.
- Si se usa SET DATEFIRST 1, el lunes será 1, martes 2, ..., domingo 7.
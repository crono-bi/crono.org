

# weekday

La función `WEEKDAY` devuelve el nombre del día de la semana correspondiente a una fecha, como un literal de texto (por ejemplo, 'lunes', 'martes', etc.). Es útil para agrupar, filtrar o mostrar información basada en el día de la semana de una fecha dada.


## Ejemplo

```
select WEEKDAY('2025-01-01') as result;
```

El código SQL generado es:

```
SELECT DATENAME([WEEKDAY],'2025-01-01') AS result --Devuelve miércoles
```


La siguiente consulta devuelve la configuración de `DATEFIRST` (el lunes será 1, martes 2, ..., domingo 7), el nombre del día de la semana y el número del número de la semana, según la configuración de `DATEFIRST`.


```
select @@DATEFIRST,weekday('2024-12-30'),weekdaynumber('2024-12-30') as result;
```


## Comentarios

- El idioma del resultado puede controlarse mediante SET LANGUAGE o la configuración de la base de datos.
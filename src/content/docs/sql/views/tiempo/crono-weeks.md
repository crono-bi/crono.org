---
title: "crono.weeks"
---


Devuelve el listado de semanas ISO, incluyendo su código y las fechas de cada día de la semana.

## Columnas

| Columna | Descripción |
|---|---|
| IsoWeek | Semana ISO |
| YYYYWW | Año y semana en formato YYYYWW |
| IsoWeekYear | Año de la semana ISO |
| IsoWeekNumber | Número de semana ISO |
| IsoWeekNumberCode | Código de semana ISO |
| Monday | Fecha del lunes |
| Tuesday | Fecha del martes |
| Wednesday | Fecha del miércoles |
| Thursday | Fecha del jueves |
| Friday | Fecha del viernes |
| Saturday | Fecha del sábado |
| Sunday | Fecha del domingo |

## Ejemplo

```crono-sql
SELECT *
FROM crono.weeks
WHERE IsoWeekYear = current_year()
```

---
title: "crono.weeks"
---

Devuelve el listado de semanas ISO, incluyendo su código y las fechas de cada día de la semana.

## Columnas

| Columna | Descripción |
|---|---|
| `iso_week` | Semana ISO |
| `yyyyww` | Año y semana en formato YYYYWW |
| `iso_week_year` | Año de la semana ISO |
| `iso_week_number` | Número de semana ISO |
| `iso_week_number_code` | Código de semana ISO |
| `monday` | Fecha del lunes |
| `tuesday` | Fecha del martes |
| `wednesday` | Fecha del miércoles |
| `thursday` | Fecha del jueves |
| `friday` | Fecha del viernes |
| `saturday` | Fecha del sábado |
| `sunday` | Fecha del domingo |

## Ejemplo

```crono-sql
select *
from crono.weeks
where iso_week_year = current_year()
```

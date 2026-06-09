---
title: "crono.dates"
---

Devuelve un listado de fechas desde 1900 hasta 2100. Es especialmente útil para generar la tabla de tiempo del data warehouse.

## Columnas

| Columna | Descripción |
|---|---|
| date | Fecha |
| iso_date | Fecha en formato ISO (YYYY-MM-DD) |
| year | Año |
| quarter | Trimestre |
| year_quarter | Año y trimestre |
| month_number | Número de mes (1-12) |
| yyyymm | Año y mes en formato YYYYMM |
| yyyymmdd | Fecha en formato YYYYMMDD |
| month | Nombre del mes |
| month_year | Mes y año |
| year_month | Año y mes |
| day | Día del mes |
| week_day | Nombre del día de la semana |
| week_day_number | Número del día de la semana |
| day_of_year | Día del año |
| iso_week_number | Número de semana ISO |
| iso_week_number_code | Código de semana ISO |
| iso_week_year | Año de la semana ISO |
| iso_week | Semana ISO |

## Ejemplo

El siguiente ejemplo muestra cómo usar `crono.dates` para crear y mantener actualizada la tabla de tiempo del data warehouse:

```crono-sql
MERGE CLONE dwh.dates KEY (date)
SELECT
	date			date PRIMARY KEY,
	iso_date,
	year,
	quarter,
	month_number,
	month,
	month_year,
	day,
	week_day_number,
	iso_week_number,
	iso_week_number_code,
	iso_week_year,
	iso_week,
	max(date partition by month_year)	last_month_date
FROM crono.dates
WHERE year BETWEEN 2015 AND current_year()
```

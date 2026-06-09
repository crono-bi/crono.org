---
title: "iso_week_year"
---

La función `iso_week_year` devuelve el año ISO de la semana a la que pertenece una fecha determinada.

La norma ISO 8601 establece que la semana comienza el lunes y que la primera semana del año es aquella que contiene el primer jueves del año. El año ISO de una fecha no coincide necesariamente con su año natural.

## Ejemplo

```crono-sql
select iso_week_year('2022-01-01') anyo_iso, iso_week('2022-01-01') semana;
```

El resultado es:

| anyo_iso | semana |
|----------|--------|
| 2021     | 52     |

El 1 de enero de 2022 pertenece a la semana 52 del año ISO 2021, ya que esa semana comenzó en diciembre de 2021.

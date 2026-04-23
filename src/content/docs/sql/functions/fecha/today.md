---
title: "today"
---


La función `today` devuelve la fecha (tipo **date**) correspondiente al día de hoy.


## Ejemplo

```sql
select today() as result;
```

El código SQL generado es:

```sql
SELECT cast(getdate() as date) AS result
```


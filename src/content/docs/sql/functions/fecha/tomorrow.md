---
title: "tomorrow"
---


La función `tomorrow` devuelve la fecha (tipo **date**) correspondiente al día de mañana.


## Ejemplo

```sql
select tomorrow() as result;
```

El código SQL generado es:

```sql
SELECT cast(getdate()+1 as date) AS result
```


---
title: "yesterday"
---



La función `yesterday` devuelve la fecha (tipo **date**) correspondiente al día de ayer.


## Ejemplo

```crono-sql
select yesterday() as result;
```

El código SQL generado es:

```crono-sql
SELECT cast(getdate()-1 as date) AS result
```


---
title: "Tabla de tiempo"
sidebar:
  order: 11
---


La subconsulta predefinida **TIME_TABLE** permite obtener algunos de los campos habituales de una tabla de tiempo.

```sql
select *
from time_table
where 
   year between 2000 and year(getdate())
```

  

  <details>
<summary>Ver SQL compilado</summary>

```sql
SELECT *
FROM time_table
WHERE year BETWEEN 2000 AND year(getdate())

```

</details>


Se puede utilizar la subconsulta predefinida **TIME_TABLE** para construir la tabla de tiempo que sea necesaria en cada proyecto.
    
```sql
select *
from time_table
where 
   year between 2000 and year(getdate())
```

  

  <details>
<summary>Ver SQL compilado</summary>

```sql
SELECT *
FROM time_table
WHERE year BETWEEN 2000 AND year(getdate())

```

</details>

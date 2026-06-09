---
title: "crono.routine_parameters"
---

Devuelve información sobre los parámetros de los procedimientos almacenados y las funciones de la base de datos, incluyendo el tipo de datos y el modo de cada parámetro.

Es similar a la vista ANSI `INFORMATION_SCHEMA.PARAMETERS`

La vista `crono.routine_parameters` devuelve las siguientes columnas:

| Columna | Descripción |
|---|---|
| `database_name` | Nombre de la base de datos |
| `schema_name` | Nombre del esquema al que pertenece la rutina |
| `routine_name` | Nombre del procedimiento o función |
| `position` | Posición ordinal del parámetro |
| `parameter_mode` | Modo del parámetro (`IN`, `OUT`, `INOUT`) |
| `parameter_name` | Nombre del parámetro |
| `data_type` | Tipo de datos del parámetro |
| `max_length` | Longitud máxima en bytes para tipos de cadena |
| `numeric_precision` | Precisión numérica para tipos numéricos |
| `numeric_scale` | Escala numérica para tipos numéricos |

El siguiente ejemplo devuelve todos los parámetros de todos los procedimientos y funciones de la base de datos:

```crono-sql
select *
from crono.routine_parameters
```

El siguiente ejemplo lista los parámetros de una rutina concreta, ordenados por posición:

```crono-sql
select position, parameter_name, parameter_mode, data_type
from crono.routine_parameters
where routine_name = 'GetOrders'
order by position
```

El siguiente ejemplo identifica las rutinas que no tienen ningún parámetro definido:

```crono-sql
select r.schema_name, r.routine_name, r.routine_type
from crono.routines r
where not exists (
    select 1
    from crono.routine_parameters p
    where p.schema_name = r.schema_name
      and p.routine_name = r.routine_name
  )
order by r.schema_name, r.routine_name
```



Si el motor de base de datos no soporta esta funcionalidad, la vista devuelve un conjunto de resultados vacío sin producir ningún error.

## Compatibilidad

**DuckDB** no admite procedimientos almacenados ni funciones definidas por el usuario en el sentido tradicional, y no expone la vista `INFORMATION_SCHEMA.ROUTINES`. En este caso la vista devuelve un conjunto de resultados vacío sin producir ningún error.

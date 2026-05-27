---
title: "count"
---


Esta función devuelve el número de elementos encontrados en un grupo. `COUNT` funciona como la función [COUNT_BIG](../../t-sql/functions/count-big-transact-sql.md). Estas funciones difieren solo en los tipos de datos de sus valores de retorno. `COUNT` siempre devuelve un valor de tipo de datos **int**. `COUNT_BIG` siempre devuelve un valor de tipo de datos **bigint**.

## Comentarios 


## Ejemplos con sintaxis Crono SQL

```crono-sql
-- Función count estándar
SELECT count(*) total_registros FROM tabla;

-- Funciones de agregación de Crono SQL
SELECT 
    count(*) total,
    end_date(fecha_inicio) OVER (PARTITION BY id) fecha_fin,
    runningpct(valor) OVER (ORDER BY fecha) porcentaje_acumulado,
    is_first() OVER (ORDER BY fecha) primer_registro
FROM datos;

-- Keywords de Crono SQL
MATERIALIZE vista_cte AS (
    SELECT 
        count(*) total,
        margin(ventas, coste) margen_beneficio
    FROM transacciones
    WHERE CHECK SNOWFLAKE
)

CALCULATE metrica = SUM(valor)
FILTER dimension = 'categoria'
```

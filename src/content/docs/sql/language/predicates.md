---
title: "Predicados"
sidebar:
  order: 14
---

Un predicado es una expresión que se evalúa como verdadera o falsa. En **Crono SQL** los predicados se usan en cualquier lugar donde se necesite una condición: la cláusula `WHERE`, la cláusula `HAVING`, las condiciones `FILTER` de los JOINs, y funciones como `if` o `case`.

**Crono SQL** soporta todos los predicados estándar de SQL ANSI y añade algunos propios que resultan especialmente útiles en proyectos ETL/DWH: `STARTS WITH`, `ENDS WITH` y `CONTAINS`, con soporte de listas de valores, y el modificador `EXCLUSIVE` para rangos `BETWEEN`.


## Comparaciones matemáticas

Los operadores de comparación estándar comparan dos expresiones y devuelven un valor booleano.

| Operador | Significado |
|----------|-------------|
| `=`  | Igual |
| `<>` | Distinto |
| `<`  | Menor que |
| `<=` | Menor o igual que |
| `>`  | Mayor que |
| `>=` | Mayor o igual que |

Se pueden combinar varias condiciones con `AND` y `OR`:

```crono-sql
SELECT *
FROM staging.orders
WHERE freight > 50 AND year(order_date) = 2024
```

### IS DISTINCT FROM / IS NOT DISTINCT FROM

Los operadores de comparación estándar tratan el `NULL` de forma especial: cualquier comparación con `NULL` devuelve `NULL`, nunca `TRUE` ni `FALSE`. `IS DISTINCT FROM` e `IS NOT DISTINCT FROM` comparan dos expresiones tratando el `NULL` como un valor normal, lo que los hace seguros cuando alguno de los operandos puede ser nulo.

```crono-sql
SELECT *
FROM staging.orders
WHERE ship_region IS DISTINCT FROM required_region
```


## LIKE

`LIKE` compara una cadena de texto con un patrón. El carácter `%` representa cualquier secuencia de caracteres y `_` representa un único carácter.

```crono-sql
SELECT *
FROM staging.customers
WHERE company_name LIKE 'A%'
```


## IN

`IN` comprueba si una expresión está incluida en una lista de valores.

```crono-sql
SELECT *
FROM staging.orders
WHERE ship_country IN ('Germany', 'France', 'Spain')
```


## STARTS WITH

`STARTS WITH` comprueba si una cadena comienza por un prefijo. Admite un único valor o una lista de valores.

```crono-sql
SELECT *
FROM staging.customers
WHERE company_name STARTS WITH 'Al'
```

Con lista de prefijos:

```crono-sql
SELECT *
FROM staging.customers
WHERE company_name STARTS WITH ('Al', 'Be', 'Co')
```


## ENDS WITH

`ENDS WITH` comprueba si una cadena termina por un sufijo. Admite un único valor o una lista de valores.

```crono-sql
SELECT *
FROM staging.products
WHERE product_name ENDS WITH 'Mix'
```

Con lista de sufijos:

```crono-sql
SELECT *
FROM staging.products
WHERE product_name ENDS WITH ('Mix', 'Sauce', 'Syrup')
```


## CONTAINS

`CONTAINS` comprueba si una cadena contiene una subcadena. Admite un único valor o una lista de valores.

```crono-sql
SELECT *
FROM staging.products
WHERE product_name CONTAINS 'Cha'
```

Con lista de subcadenas:

```crono-sql
SELECT *
FROM staging.products
WHERE product_name CONTAINS ('Cha', 'Chef', 'Anton')
```


## BETWEEN

`BETWEEN` comprueba si una expresión está dentro de un rango. Por defecto el rango es **inclusivo en ambos extremos**. El modificador `EXCLUSIVE` hace el límite superior exclusivo.

```crono-sql
SELECT *
FROM staging.orders
WHERE freight BETWEEN 20 AND 100
```

Con `EXCLUSIVE`, el límite superior queda excluido (`<` en lugar de `<=`). Es la forma natural de expresar rangos de fechas donde el extremo final no debe incluirse:

```crono-sql
SELECT *
FROM ventas
WHERE fecha BETWEEN date('2026-01-01') AND current_date EXCLUSIVE
```


## IS NULL / IS NOT NULL

Comprueban si una expresión tiene valor nulo o no.

```crono-sql
SELECT *
FROM staging.orders
WHERE shipped_date IS NULL
```


## EXISTS

`EXISTS` comprueba si una subconsulta devuelve al menos una fila.

```crono-sql
SELECT *
FROM staging.customers
WHERE EXISTS (
  SELECT 1 FROM staging.orders WHERE orders.customer_id = customers.customer_id
)
```

En la mayoría de los casos, `SEMI JOIN` expresa el mismo patrón de forma más legible. Ver [Operador JOIN](/sql/language/join/).


## NOT

`NOT` niega cualquier predicado.

```crono-sql
SELECT *
FROM staging.customers
WHERE NOT company_name STARTS WITH 'A'
```

`NOT` se puede combinar con cualquier otro predicado, incluidos `IN`, `LIKE`, `BETWEEN` o `EXISTS`:

```crono-sql
SELECT *
FROM staging.orders
WHERE ship_country NOT IN ('Germany', 'France')
```

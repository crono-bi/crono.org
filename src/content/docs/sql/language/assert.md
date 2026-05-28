---
title: "ASSERT"
sidebar:
  order: 80
---

La sentencia **ASSERT** permite añadir validaciones de calidad del dato al proceso de carga. Si la condición no se cumple, la ejecución se detiene y se lanza el mensaje de error indicado, impidiendo que datos incorrectos lleguen a la tabla de destino.

Existen dos variantes:

- **ASSERT EXISTS OR RAISE** — falla si la consulta no devuelve ningún registro.
- **ASSERT NOT EXISTS OR RAISE** — falla si la consulta devuelve algún registro.

Las aserciones pueden utilizar toda la potencia del **SELECT** de **Crono SQL**: SELECTs apilados, **FILTER**, agregaciones, **ANTI JOIN**, **SEMI JOIN**, etc.


## ASSERT NOT EXISTS OR RAISE

La forma más habitual es **ASSERT NOT EXISTS OR RAISE**: se escribe la consulta que describe los registros problemáticos, y si esa consulta devuelve algún resultado, la carga falla con el mensaje indicado.

Este ejemplo verifica que no exista ninguna línea de detalle con producto o cantidad nulos:

```crono-sql
ASSERT NOT EXISTS OR RAISE 'Líneas de detalle con producto o cantidad nulos'
SELECT *
FROM staging.order_details
WHERE quantity IS NULL
   OR product_id IS NULL
```

Las aserciones pueden usar SELECTs apilados para validar valores agregados. Este ejemplo comprueba que ningún cliente tenga un total de ventas sospechosamente alto, lo que podría indicar un error en los datos de origen:

```crono-sql
ASSERT NOT EXISTS OR RAISE 'Ventas demasiado altas. Posible error en los datos'
SELECT WHERE total_sales > 1000000
SELECT
  customers.company_name AS customer,
  sum(order_details.unit_price * order_details.quantity) AS total_sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
```


## ASSERT EXISTS OR RAISE

**ASSERT EXISTS OR RAISE** falla si la consulta no devuelve ningún registro. Es útil para verificar que el resultado de una consulta cumple una condición esperada, como que un recuento esté dentro de un rango razonable.

Este ejemplo comprueba que el número de clientes en staging esté dentro del rango esperado. Si hay demasiados o demasiado pocos, podría indicar un problema en la extracción:

```crono-sql
ASSERT EXISTS OR RAISE 'Número de clientes fuera del rango esperado'
SELECT WHERE customer_count BETWEEN 90 AND 200
SELECT count(*) AS customer_count
FROM staging.customers
```

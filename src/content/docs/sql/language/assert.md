---
title: "ASSERT"
sidebar:
  order: 80
---

En un proceso ETL, cargar datos incorrectos en el destino es peor que no cargar nada: los errores silenciosos se propagan y son difíciles de detectar después. La sentencia **ASSERT** permite blindar el proceso de carga: se define una condición que los datos de origen deben cumplir, y si no se cumple, la ejecución se detiene con un mensaje de error claro antes de que ningún dato incorrecto llegue a la tabla de destino.

Existen dos variantes:

- **ASSERT NOT EXISTS OR RAISE** — falla si la consulta devuelve algún registro. Se usa para describir los registros problemáticos: si aparece alguno, la carga se detiene.
- **ASSERT EXISTS OR RAISE** — falla si la consulta no devuelve ningún registro. Se usa para verificar que una condición esperada se cumple.

Las aserciones pueden utilizar toda la potencia del **SELECT** de **Crono SQL**: SELECTs apilados, **FILTER**, agregaciones, **ANTI JOIN**, **SEMI JOIN**, etc.


## ASSERT NOT EXISTS OR RAISE

Es la variante más habitual. La lógica es directa: se escribe la consulta que devuelve los registros problemáticos, y si esa consulta devuelve algún resultado, la carga falla con el mensaje indicado.

Este ejemplo verifica que no haya ninguna línea de detalle con producto o cantidad nulos:

```crono-sql
ASSERT NOT EXISTS OR RAISE 'Líneas de detalle con producto o cantidad nulos'
SELECT *
FROM staging.order_details
WHERE quantity IS NULL
   OR product_id IS NULL
```

Combinada con SELECTs apilados, la aserción puede validar también valores agregados. Este ejemplo detecta clientes con un volumen de ventas anómalamente alto, lo que podría indicar un error en los datos de origen:

```crono-sql
ASSERT NOT EXISTS OR RAISE 'Ventas demasiado altas. Posible error en los datos de origen'
SELECT WHERE total_sales > 1000000
SELECT
  customers.company_name AS customer,
  sum(order_details.unit_price * order_details.quantity) AS total_sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
```


## ASSERT EXISTS OR RAISE

Falla si la consulta no devuelve ningún registro. Es útil para verificar que el resultado de una consulta está dentro de unos límites razonables — por ejemplo, que la extracción ha traído datos y que el volumen es el esperado.

Este ejemplo comprueba que el número de clientes cargados en staging sea coherente con lo esperado. Un recuento fuera de rango puede indicar un problema en la extracción:

```crono-sql
ASSERT EXISTS OR RAISE 'Número de clientes fuera del rango esperado'
SELECT WHERE customer_count BETWEEN 90 AND 200
SELECT count(*) AS customer_count
FROM staging.customers
```

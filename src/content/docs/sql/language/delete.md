---
title: "Sentencia DELETE"
sidebar:
  order: 5
---

El patrón **DELETE** de **Crono SQL** elimina los registros de la tabla destino cuya clave coincida con los registros devueltos por la consulta. Se escribe el **SELECT** de los registros que se quieren borrar, y **Crono SQL** elimina exactamente esos.

La clave de eliminación se declara con `KEY (col1, col2)` en la cabecera. Es obligatoria.

```crono-sql
DELETE dwh.dim_products KEY (product_id)
SELECT products.product_id
FROM staging.products
WHERE discontinued = 1
```

La consulta del **DELETE** admite toda la potencia del **SELECT** de **Crono SQL**. El siguiente ejemplo elimina los clientes que no tienen ninguna orden, usando **ANTI JOIN**:

```crono-sql
DELETE dwh.dim_customers KEY (customer_id)
SELECT customer_id
FROM dwh.dim_customers
ANTI JOIN staging.orders USING customer_id
```

También se pueden combinar varias tablas para expresar condiciones más complejas. Este ejemplo elimina las líneas de pedido de un cliente concreto:

```crono-sql
DELETE dwh.fact_order_details KEY (order_id, product_id)
SELECT
  order_details.order_id,
  order_details.product_id
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
WHERE customers.company_name = 'Alfreds Futterkiste'
```


## Compatibilidad ANSI

Por compatibilidad, **Crono SQL** también soporta la sintaxis estándar del DELETE:

```crono-sql
DELETE FROM dwh.fact_order_details
WHERE order_id = 10248
```

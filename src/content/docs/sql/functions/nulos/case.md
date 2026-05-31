---
title: "case"
---

La expresión `case` evalúa una serie de condiciones y devuelve el resultado asociado a la primera que se cumpla. Es la forma estándar de escribir lógica condicional en SQL y funciona en todos los motores.

## Ejemplo

La siguiente consulta clasifica los pedidos según su importe total:

```crono-sql
select
  orders.order_id,
  customers.company_name,
  sum(order_details.unit_price * order_details.quantity) importe,
  case
    when importe >= 5000 then 'Alto'
    when importe >= 1000 then 'Medio'
    else 'Bajo'
  end tramo
from staging.order_details
inner join staging.orders using order_id
inner join staging.customers using customer_id
group by all;
```

También existe la forma compacta, equivalente a un `CASE value WHEN`:

```crono-sql
select
  products.product_name,
  case products.category_id
    when 1 then 'Bebidas'
    when 2 then 'Condimentos'
    when 3 then 'Confitería'
    else 'Otras'
  end categoria
from staging.products;
```

## Comentarios

Para casos simples de dos ramas (`if / else`) se puede usar la función `if`, que es más compacta. Para mapear un valor a una lista de opciones, `switch` es equivalente a la forma compacta de `case` con menos código.

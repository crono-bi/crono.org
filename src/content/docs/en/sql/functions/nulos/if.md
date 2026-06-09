---
title: "if"
---

La función `if` evalúa una condición y devuelve un valor si es verdadera u otro si es falsa. Funciona como el `IF` de Excel o como una expresión `CASE` simplificada.

## Ejemplo

```crono-sql
select orders.order_id,
  if(orders.freight > 100, 'Envío caro', 'Envío normal') tipo_envio
from staging.orders;
```

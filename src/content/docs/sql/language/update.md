---
title: "UPDATE"
sidebar:
  order: 30
---

El patrón **UPDATE** de **Crono SQL** actualiza los registros de la tabla destino cuyos valores hayan cambiado respecto a los datos de origen. Es una actualización inteligente: solo modifica los registros que realmente han cambiado, lo que reduce la carga sobre la base de datos y mantiene la precisión del campo de auditoría `update_date`.

La clave de carga se declara con `KEY (col1, col2)` en la cabecera. Es obligatoria.

```crono-sql
UPDATE dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name AS supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
```

Un producto cuyo nombre o categoría haya cambiado quedará actualizado en `dwh.dim_products`. Un producto sin cambios no genera ninguna operación en la base de datos.

La consulta del **UPDATE** admite toda la potencia del **SELECT** de **Crono SQL**. El siguiente ejemplo actualiza el precio de coste de los productos a partir de la última orden recibida de cada proveedor:

```crono-sql
UPDATE dwh.dim_products KEY (product_id)
SELECT
  order_details.product_id,
  max(order_details.unit_price) AS last_unit_price
FROM staging.order_details
INNER JOIN staging.orders USING order_id
GROUP BY order_details.product_id
```


## Compatibilidad ANSI

Por compatibilidad, **Crono SQL** también soporta la sintaxis estándar del UPDATE:

```crono-sql
UPDATE dwh.dim_products
SET product_name = 'Nuevo nombre'
WHERE product_id = 1
```

Esta forma ANSI no mantiene auditoría ni realiza detección de cambios.

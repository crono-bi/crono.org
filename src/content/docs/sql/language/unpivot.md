---
title: "UNPIVOT"
sidebar:
  order: 100
---

El operador **UNPIVOT** transforma columnas en filas. Es la operación inversa a PIVOT: en lugar de agregar filas en columnas, expande columnas en filas multiplicando los registros.

**Crono SQL** soporta la sintaxis estándar de UNPIVOT y la compila correctamente para cada motor de base de datos.

En el siguiente ejemplo, las columnas `address_line1` y `address_line2` se convierten en filas independientes. Por cada dirección original se generan dos filas: una por cada línea de dirección.

```crono-sql
SELECT
  address_id,
  address_item,
  address_value
FROM staging.address
UNPIVOT (address_value FOR address_item IN (address_line1, address_line2)) AS unpvt
```

El resultado tiene tres columnas: `address_id` (la clave que identifica el registro original), `address_item` (el nombre de la columna de origen) y `address_value` (el valor correspondiente).

UNPIVOT es útil cuando los datos llegan en formato "wide" —con múltiples columnas para lo que conceptualmente es una misma dimensión— y se necesita transformarlos a formato "long" para cargarlos correctamente en el modelo dimensional.

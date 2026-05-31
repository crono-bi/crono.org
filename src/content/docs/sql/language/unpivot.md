---
title: "UNPIVOT"
sidebar:
  order: 100
---

Es habitual recibir datos donde lo que conceptualmente es una lista de valores aparece repartido en varias columnas. Un ejemplo típico es una tabla de presupuestos con una columna por mes: `enero`, `febrero`, `marzo`… hasta `diciembre`. Este diseño es cómodo para introducir datos en una hoja de cálculo, pero difícil de trabajar en un modelo dimensional, donde lo natural es tener una fila por mes con las columnas `mes` e `importe`.

El operador **UNPIVOT** resuelve esta transformación: convierte columnas en filas, multiplicando los registros. Es la operación inversa a PIVOT. **Crono SQL** soporta la sintaxis estándar de UNPIVOT y la compila correctamente para cada motor.

## Ejemplo

La tabla `staging.customers` de Northwind tiene dos campos de fax y teléfono por cliente. Con UNPIVOT se pueden convertir en filas independientes, una por cada medio de contacto:

```crono-sql
SELECT
  customer_id,
  contact_type,
  contact_value
FROM staging.customers
UNPIVOT (contact_value FOR contact_type IN (phone, fax)) AS unpvt
```

La sintaxis declara tres cosas: el nombre de la columna que recibirá los valores (`contact_value`), el nombre de la columna que recibirá el nombre de la columna de origen (`contact_type`), y la lista de columnas a transformar (`phone, fax`). Por cada cliente original se generan dos filas: una con el teléfono y otra con el fax. Las columnas no incluidas en la lista — como `customer_id` o `company_name` — se repiten en cada fila generada.

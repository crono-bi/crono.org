---
title: "Patrones de carga"
sidebar:
  order: 15
---

**Crono SQL** define nueve patrones de carga que cubren todos los escenarios habituales en un proyecto ETL/DWH. Todos ellos mantienen la auditoría automáticamente y admiten toda la potencia del **SELECT**: **USING**, **FILTER**, **CHECK SNOWFLAKE** y el resto de operadores.

La mayoría de patrones requieren una **clave de carga** declarada con `KEY (col1, col2)` en la cabecera de la sentencia. La clave identifica el registro y determina qué filas se insertan, actualizan o eliminan según el patrón elegido.

| Sentencia | KEY | Auditoría |
|---|---|---|
| MERGE CLONE | obligatoria | `insert_date`, `update_date` |
| MERGE HISTORY | obligatoria | `start_date`, `end_date` |
| MERGE SOFT DELETE | obligatoria | `insert_date`, `update_date`, `delete_date` |
| MERGE UPSERT | obligatoria | `insert_date`, `update_date` |
| INSERT OVERWRITE | opcional | `insert_date` |
| INSERT IF NEW | obligatoria | `insert_date` |
| INSERT RAW | — | `insert_date` |
| UPDATE | obligatoria | `update_date` |
| DELETE | obligatoria | — |

El nombre de estos campos es configurable a nivel de proyecto ETL. **MERGE CLONE** es el equivalente al patrón **SCD tipo 1** (sobreescribe los cambios sin conservar histórico); **MERGE HISTORY** es el equivalente al **SCD tipo 2** (conserva el histórico completo de cambios mediante filas versionadas).

## Elegir el patrón de carga

La elección del patrón es una decisión de negocio, no técnica. El siguiente ejemplo sincroniza `dwh.dim_products` con los datos de origen usando **MERGE CLONE**: inserta los productos nuevos, actualiza los que han cambiado y elimina los que ya no existen en origen.

```crono-sql
MERGE CLONE dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
```

Si los requisitos cambian —por ejemplo, se decide conservar el histórico en lugar de sobreescribirlo— basta con cambiar la primera línea:

```crono-sql
MERGE HISTORY dwh.dim_products KEY (product_id)
```

O si solo se necesita una recarga completa sin lógica de clave:

```crono-sql
INSERT OVERWRITE dwh.dim_products
```

El resto de la sentencia —los JOINs, los filtros, las transformaciones— no cambia en ninguno de los casos.

Esta separación refleja una distinción fundamental. La lógica de transformación es específica de cada negocio: qué tablas existen, cómo se relacionan, qué cálculos tienen sentido. No hay dos empresas con el mismo modelo de datos ni con las mismas reglas de negocio. Esa lógica vive en el **SELECT** y solo el desarrollador puede escribirla.

Los patrones de carga, en cambio, son universales. Un MERGE CLONE, un INSERT IF NEW o un MERGE HISTORY funcionan igual en una startup que en una multinacional, en un e-commerce que en un banco. Son problemas resueltos —exactamente el tipo de código que nadie debería tener que escribir a mano.

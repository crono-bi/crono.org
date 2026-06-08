---
title: "Patrones de carga"
sidebar:
  order: 15
---

**Crono SQL** define nueve patrones de carga que cubren todos los escenarios habituales en un proyecto ETL/DWH. Cada patrón se declara en una sola línea; el compilador genera todo el código necesario para cada motor de base de datos, gestiona automáticamente la estructura de la tabla destino y mantiene los campos de auditoría.

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

## Creación y mantenimiento de la tabla

Los nueve patrones de carga gestionan automáticamente la estructura de la tabla destino. Antes de ejecutar cualquier carga, **Crono SQL** consulta los metadatos de la base de datos para obtener el esquema actual de la tabla —sin ejecutar la query— y lo compara con el esquema del SELECT. A partir de esa comparación decide qué acciones DDL son necesarias:

- **Crear la tabla** si todavía no existe
- **Añadir columnas** que aparecen en el SELECT pero no en la tabla
- **Modificar el tipo** de una columna si el cambio no es destructivo (por ejemplo, ampliar un `varchar` o pasar de `int` a `bigint`)
- **Aplicar constraints**: `NOT NULL`, `UNIQUE`, `NON UNIQUE`, `REFERENCES`

Todo esto ocurre de forma transparente, antes de cualquier inserción o actualización.

Esto permite definir la estrategia de carga y el modelo de datos en el mismo sitio, manteniéndolos siempre sincronizados. Añadir una columna a una tabla existente es tan sencillo como añadirla al SELECT: **Crono SQL** inferirá el tipo y la añadirá automáticamente a la tabla.

### Especificación de columnas

Las propiedades de cada columna se declaran de forma opcional directamente en el SELECT, junto al alias, con la sintaxis `expresión alias tipo constraints`:

```crono-sql
MERGE CLONE dwh.dim_products KEY (product_id)
SELECT
  products.product_id       product_id int UNIQUE,
  products.product_name     product_name varchar(100) NOT NULL UNIQUE,
  categories.category_name  category_name NOT NULL,
  suppliers.company_name    supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
```

El tipo y las constraints son opcionales. Si se omiten, **Crono SQL** infiere el tipo a partir del origen y no aplica constraints adicionales.

Para declarar una clave foránea se usa `REFERENCES tabla`. Si el nombre de la columna referenciada coincide con el alias, no hace falta especificarla; en caso contrario se indica entre paréntesis:

```crono-sql
MERGE CLONE dwh.fact_order_details KEY (order_id, product_id)
SELECT
  od.order_id               order_id   REFERENCES dwh.fact_orders(order_header_sid),
  od.product_id             product_id REFERENCES dwh.dim_products,
  products.product_name,
  od.unit_price,
  od.quantity,
  od.discount,
  year(orders.order_date)   order_year
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

En `order_id` la PK de `dwh.fact_orders` se llama `order_header_sid`, distinto del alias, por lo que se especifica entre paréntesis. En `product_id` la PK de `dwh.dim_products` coincide con el alias y no es necesario indicarla.

### NO_ALTER

La cláusula **NO_ALTER** desactiva el mantenimiento automático de la tabla. Con `NO_ALTER`, **Crono SQL** asume que la tabla ya existe con el esquema correcto y no realiza ninguna comprobación ni modificación DDL antes de ejecutar la carga.

```crono-sql
MERGE CLONE dwh.dim_products KEY (product_id) NO_ALTER
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name AS supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
```

## Primary keys y claves subrogadas

Además del tipo y las constraints de columna, también se puede declarar la **clave primaria** de la tabla. Si la PK es un único campo, basta con añadir `PRIMARY KEY` al alias correspondiente:

```crono-sql
MERGE CLONE dwh.dim_products KEY (product_id)
SELECT
  products.product_id       product_id int PRIMARY KEY,
  products.product_name     product_name,
  categories.category_name  category_name,
  suppliers.company_name    supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
```

Cuando la clave primaria está formada por varios campos, se declaran todos con `PRIMARY KEY` y **Crono SQL** creará una PK compuesta.

### Clave subrogada

Lo recomendable es definir siempre una **clave subrogada**: una columna numérica autoincremental generada por la base de datos, independiente de los datos de origen. Se declara escribiendo el nombre de la columna entre paréntesis justo después del nombre de la tabla destino:

```crono-sql
MERGE CLONE dwh.dim_products(product_sid) KEY (product_id)
SELECT
  products.product_id       product_id,
  products.product_name     product_name,
  categories.category_name  category_name,
  suppliers.company_name    supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
```

**Crono SQL** creará automáticamente la columna `product_sid` como clave primaria entera autoincremental. La clave de carga (`KEY`) sigue siendo la clave de negocio (`product_id`), que identifica el registro en el origen. La clave subrogada es exclusivamente para uso del modelo DWH.

Se recomienda usar clave subrogada especialmente cuando:

- La clave de negocio está formada por varios campos (`order_id`, `product_id`)
- La clave de negocio no es numérica o puede cambiar en el futuro
- La tabla se carga desde varios orígenes distintos, o el origen podría cambiar

En caso de duda, añade la clave subrogada.

## Auditoría

Todos los patrones de carga añaden automáticamente campos de auditoría a la tabla destino. Estos campos los gestiona **Crono SQL** sin que el desarrollador tenga que incluirlos en el SELECT ni preocuparse por su mantenimiento. Proporcionan un registro fiable de cuándo se insertó o modificó cada registro.

Los campos varían según el patrón:

| Sentencia | Campos de auditoría |
|---|---|
| MERGE CLONE | `insert_date`, `update_date` |
| MERGE HISTORY | `start_date`, `end_date` |
| MERGE SOFT DELETE | `insert_date`, `update_date`, `delete_date` |
| MERGE UPSERT | `insert_date`, `update_date` |
| INSERT OVERWRITE | `insert_date` |
| INSERT IF NEW | `insert_date` |
| INSERT RAW | `insert_date` |
| UPDATE | `update_date` |
| DELETE | — |

El nombre de estos campos es configurable a nivel de proyecto ETL.

### NO_AUDIT

La cláusula **NO_AUDIT** desactiva la auditoría automática para una sentencia concreta. **Crono SQL** no añadirá ni gestionará los campos de auditoría en esa tabla.

```crono-sql
MERGE CLONE dwh.dim_products KEY (product_id) NO_AUDIT
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name AS supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
```

Es útil cuando se carga una tabla preexistente sobre la que no se tiene libertad para añadir columnas —por ejemplo, una tabla de un sistema tercero o un esquema con restricciones estrictas.

`NO_AUDIT` y `NO_ALTER` se pueden combinar en la misma sentencia:

```crono-sql
MERGE CLONE dwh.dim_products KEY (product_id) NO_ALTER NO_AUDIT
SELECT ...
```


## Resumen

**Crono SQL** define nueve patrones de carga que cubren todos los escenarios habituales en un proyecto ETL/DWH. Cada patrón se declara en una sola línea; el compilador genera todo el código necesario para cada motor de base de datos.

Por cada sentencia de carga, **Crono SQL** hace automáticamente todo esto:

- **Ejecuta la carga** según el patrón declarado: inserta los registros nuevos, actualiza los modificados, elimina los que ya no existen en origen o versiona el histórico de cambios
- **Crea la tabla destino** si todavía no existe, y la mantiene sincronizada con el SELECT — añade columnas, ajusta tipos no destructivos
- **Gestiona las constraints** declaradas en el SELECT: `NOT NULL`, `UNIQUE`, `REFERENCES`, `PRIMARY KEY`
- **Crea la clave subrogada** autoincremental si se declara
- **Añade y mantiene los campos de auditoría** (`insert_date`, `update_date`, etc.) en cada carga

Todo este código —farragoso, repetitivo y propenso a errores— es invisible en Crono SQL. Con el tiempo, simplemente te olvidas de que existe.
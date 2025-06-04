---
sidebar_position: 2
---

# Introducción

Crono SQL es un lenguaje de programación para facilitar el desarrollo ágil de proyectos ETL/DWH. En esta página se muestra la sintaxis del lenguaje y todas las funciones admitidas.

## ¿Qué es Crono SQL?

**Crono SQL** es un lenguaje de programación creado por Pablo Urquizu (fundador de Crono BI) para facilitar el desarrollo ágil de proyectos ETL/DWH.

**Crono SQL** es un lenguaje que compila en SQL. Crono SQL y SQL tienen la misma relación, por ejemplo, que [TypeScript](https://es.wikipedia.org/wiki/TypeScript) y JavaScript, o [Markdown](https://daringfireball.net/projects/markdown/syntax) y HTML. 

**Crono SQL** extiende la sintaxis de SQL, por tanto cualquier sentencia **SELECT** existente funciona sin problemas. 

El lenguaje **Crono SQL** pretende simplificar la sintaxis del SQL evitando las repeticiones de código y automatizando la generación del código más farragoso y repetitivo. 

**Crono SQL** es un lenguaje mucho más imperativo, más fácil de escribir, de leer, y de mantener que el SQL ISO. 

## Principios

En la definición de la sintaxis y el desarrollo de las herramientas asociadas se han seguido estos principios:

| Principio              | Objetivo              | Justificación        |
|------------------------|--------------------------|----------------------|
| Principio SQL          | Similitud al **SQL ANSI** | El lenguaje SQL es un lenguaje conocido y ampliamente aceptado por el mercado. Es un lenguaje declarativo muy potente y adecuado para interactuar con los datos. **Crono SQL** trata de parecerse los más posible al SQL estándar. |
| Principio DRY          | Evitar repeticiones       | El código debe ser los más conciso posible y se debe evitar especialmente las repeticiones de código. Las repeticiones de código son fuente de errores y degradan la mantenibilidad del proyecto. |
| Principo KISS          | Buscar la simplicidad. | Mantener la simplicidad es importante en todos los proyectos, y eso incluye al lenguaje y a las herramientas de desarrollo. Siempre será preferible un código breve y sencillo que otro más farragoso o difícil de recordar.|
| Principo TEXT          | Mantener todo el código del proyecto y las configuraciones en ficheros de textos | El formato de texto es el más universal y el que mejor se puede gestionar desde un sistema de control de versiones como **GIT**. |

## Un resumen, por favor

Este manual tiene más de 300 páginas, por lo que probablemente querrás saber lo que puedes llegar a conseguir con Crono y si vale la pena seguir leyendo.

En menos de 100 palabras:

:::tip
Con **Crono SQL** puedes escribir un código sencillo que crea una tabla y crea el procedimiento que se encarga de su aprovisionamiento. 
Con unas pocas líneas de código se consigue al mismo tiempo crear el modelo de datos y construir la ETL. 
Además, el código generado es óptimo y el rendimiento es inigualable. Todo ello redunda en un código más mantenible, más escalable y con menos errores.
:::

El siguiente ejemplo muestra todo lo anterior con más detalle. Incluye prácticamente todo lo que vas a necesitar para construir un DWH y cargar prácticamente todas las dimensiones y el 90% o más de las tablas de hechos.

Este manual asume que se tienen al menos conocimientos básicos de SQL.

```sql
CREATE OR REPLACE PROCEDURE
MERGE CLONE dwh.FactSalesOrderDetails(SalesOrderDetailSid)
SELECT
	SalesOrderDetail.SalesOrderDetailID #SalesOrderDetailID,
	DimProducts.ProductSid						ProductSid	NONUNIQUE REFERENCES dwh.DimProducts,
	FactSalesOrderHeader.SalesOrderSid			SalesOrderSid NONUNIQUE	REFERENCES dwh.FactSalesOrderHeader,
	SalesOrderDetail.CarrierTrackingNumber,
	SalesOrderDetail.OrderQty,
	SalesOrderDetail.UnitPrice,
	SalesOrderDetail.UnitPriceDiscount,
	SalesOrderDetail.LineTotal,
	SpecialOffer.Description SpecialOffer,
	SpecialOffer.Type			SpecialOfferType,
	SpecialOffer.Category		SpecialOfferCategory,
from @@erp.SalesOrderDetail SalesOrderDetail
inner join @@erp.SalesOrderHeader using (SalesOrderID)  
inner join @@erp.SpecialOffer using (SpecialOfferID)
inner join @@erp.Product using (ProductID)
inner join dwh.DimProducts using Product(ProductID)
inner join dwh.FactSalesOrderHeader using SalesOrderHeader(SalesOrderID)
check snowflake
```

Estas 21 líneas de código hacen todo lo siguiente:

- Si no existe, crean la tabla `dwh.FactSalesOrderDetails` con todos sus campos (con el tipo correcto).
- Si la tabla ya existe, añade los campos que le falten.
- También crea una restricción de unicidad `BK_FactSalesOrderDetails` que actuará como *business key* y asegurará que el campo `SalesOrderDetailID` no tiene repetidos.
- Crea las claves foráneas con las tablas `dwh.DimProducts` y `dwh.FactSalesOrderHeader`.
- Crea los índices `NONUNIQUE` sobre los campos que intervienen en las dos relaciones previas para optimizar el rendimiento.
- Crea un procedimiento en base de datos que carga la tabla `dwh.FactSalesOrderDetails` a partir de los datos de la consulta indicada. Esta carga se hará siguiendo una estrategia **MERGE CLONE**, es decir, añadirá o eliminará los nuevos registros que hagan falta para que la tabla del DWH tenga exactamente el mismo contenido que el ERP de origen. Si algún registro ha cambiado sus valores, también actualizará las modificaciones. Después de ejecutar la carga, la tabla del DWH será literalmente un "clon" de los datos de origen.
- Antes de actualizar los datos, sin embargo, se verifica que las relaciones sean correctas y que no se pierden ni duplican registros. La cláusula `CHECK SNOWFLAKE` asegura que se cargan exactamente todas las ventas de origen. Ni una más ni una menos. Esta comprobación es fundamental para asegurar la calidad de los datos. Si los datos de origen tienen algún error, no queremos cargarlos en el data warehouse.
- El procedimiento también guarda **información de auditoria**. Es decir, cada registro tendrá información de la fecha de alta y la fecha de la última modificación.

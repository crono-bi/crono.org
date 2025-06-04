---
sidebar_position: 3
---

# Sentencias MERGE

La sentencia **MERGE** carga los datos en una **tabla destino** a partir del resultado de una **consulta de origen**.

Existen las siguientes variantes **MERGE**. Cada una de ella responde a una estrategia de carga en proyectos ETL/DWH:

| Nombre                | Descripción           |
|-----------------------|----------------------------------------------------------------------------------------------|
| **MERGE CLONE**           | Añade los registros nuevos, actualiza los existentes que hayan cambiado, y elimina los registros ausentes en el origen |
| **MERGE UPSERT** (o **MERGE**)| Añade los registros nuevos y actualiza los existentes (que hayan cambiado) |
| **MERGE ALL**             | Añade los registros nuevos y actualiza los existentes (hayan cambiado o no) |
| **MERGE UPDATE**          | Actualiza los existentes que hayan cambiado, sin añadir ninguno ni eliminar ninguno. Es igual que el **UPDATE** de **Crono SQL** |
| **MERGE SOFT DELETE**     | Añade los registros nuevos, actualiza los existentes que hayan cambiado, e informa la fecha de eliminación de los registros ausentes en el origen |
| **MERGE INCREMENTAL**     | Añade los registros nuevos, sin actualizar ni eliminar ninguno. Es igual que el **INSERT** de **Crono SQL** |
| **MERGE HISTORY**         | Añade los registros nuevos manteniendo la historia de los cambios en los campos "fecha inicio vigencia" y "fecha fin vigencia". Es una carga SCD2 |

Estas 7 estrategias, o un subconjunto de ellas, suelen ser suficientes para implementar cualquier proyecto ETL/DWH. Habitualmente, las estrategias **MERGE CLONE** y **MERGE UPSERT** se utilizan para cargar tablas de dimensión, y **MERGE CLONE** y **MERGE INCREMENTAL** se utilizan para cargar tablas de hechos. De todos modos, eso dependerá de las necesidades de cada tabla y de cada proyecto.

Todas las instrucciones **MERGE** crean la tabla de destino si es necesario, así como la clave de negocio, y los campos de auditoria. 

La sintaxis es muy sencilla. Simplemente hay que indicar la **consulta de origen** (especificando la "clave de actualización") y la **tabla de destino**. A continuación se incluyen ejemplos de uso de estas 7 estrategias.

## MERGE CLONE

La instrucción **MERGE CLONE** realiza una actualización completa de la tabla. Es decir: Añade, elimina o actualiza todos los registros de la tabla destino para que coincidan exactamente con el contenido de la consulta de origen. Convierte literalmente la tabla destino en un clon de la consulta de origen.

Se utiliza en tablas de hechos pequeñas o en aquellas tablas de dimensión en que sabemos que no se eliminan registros, o que es aceptable que se eliminen registros obsoletos. Se trata de la estrategia más común en cualquier proyecto DWH (en muchas ocasiones **MERGE CLONE** es la única instrucción necesaria).

La sintaxis es idéntica a la utilizada en la sintaxis **Crono SQL** de **UPDATE** o **INSERT**, tal y como muestra este ejemplo.

```sql
MERGE CLONE dwh.DimProducts(ProductSid)
select 
  #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name ProductModel,
  Color,
  StandardCost,
  ListPrice,
  Size,
  SizeUnitMeasureCode,
  Weight
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using Product(ProductSubcategoryID)
LEFT JOIN staging.ProductCategory using ProductSubCategory(ProductCategoryId)
LEFT JOIN staging.ProductModel using Product(ProductModelID)
```

Es importante observar que el campo *ProductId* está precedido por el **carácter numeral #**. Esta marca sirve para identificar la **clave de actualización**. Habitualmente coincide con la clave de negocio (código único que identifica a cada registro).

El código generado realiza un **MERGE** e informa convenientemente los campos *FechaAlta*, *FechaBaja* y *FechaModificacion*.  

Si la tabla no existe en el momento de ejecución, la creará añadiéndole el campo *ProductSid* como una clave subrogada (un entero autonumérico **INDENTITY**). También creará un **UNIQUE CONSTRAINT** para el campo *ProductId* (que debe ser único).

Si en el futuro se modifica la consulta, añadiendo más campos a la dimensión, **Crono SQL** generará también el código necesario para crear esos nuevos campos en la tabla.

El código generado es óptimo y presenta un gran rendimiento, por lo que esta estrategia es adecuada también en tablas de hechos no excesivamente grandes:

```sql
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

En este ejemplo, después de los **JOIN**, se ha incluido la clausula **CHECK SNOWFLAKE**. Por lo tanto, antes de realizar la carga, **Crono SQL** verificará que la consulta de origen no pierda ni duplique registros de *staging.Products*.

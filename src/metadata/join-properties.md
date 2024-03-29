﻿---
title: Propiedades de relación
sidebarDepth: 2
position: 19
Autogenerated: true
---

# Propiedades de relación

Desde el menú contextual de una relación del diagrama podemos acceder a sus propiedades:

![image-20200303115203654](/images/propiedades-relacion1.png)



Las relaciones (o `JOINs`) sirven para combinar las filas entre dos tablas. Existen dos tipos principales:

- **INNER JOIN**: Devuelve las filas de la izquierda que tienen correspondencia en la tabla derecha
- **LEFT JOIN**: Devuelve todas las filas de la izquierda, tengan o no tengan correspondencia en la tabla derecha.

Definir correctamente las relaciones del diagrama es fundamental para el correcto funcionamiento del catálogo. Por ello es recomendable seguir estas prácticas siempre que sea posible:

- Las relaciones deben ser entre la clave primaria de una tabla (PK) y la clave foránea de la otra (FK). Es decir, las relaciones (constraints) deben estar definidas en la base de datos.
- Utilizar una relación **LEFT JOIN** si los campos clave de la tabla de detalle admiten nulo. 

Si se siguen estas dos recomendaciones la relación nunca perderá ni duplicará registros. Es decir, por ejemplo, cada venta tendrá asociada una fecha (y solo una), una tienda (y solo una) y un libro (y solo uno).

Por lo tanto:

- Si cada venta debe estar asociada a una tienda, el campo `ID_TIENDA`no debe admitir nulos (debe ser `NOT NULL`) y se debe emplear la relación `**INNER JOIN**.`
- Si, en cambio, el modelo de negocio admitiera ventas sin libros, entonces el campo `ID_LIBRO` debe ser nulable y se debe emplear un `**LEFT JOIN**`.

Si el modelo definido en **Crono Metadata** coincide con el modelo físico de la base de datos evitaremos que el usuario de negocio termine obteniendo información errónea.

De todos modos, conviene destacar que **Crono Metadata** no exige la existencia de las restricciones `NULL` o `NOT NULL`. Tampoco exige que las tablas tengan claves primarias y/o claves foráneas. Se trata, simplemente, de recomendaciones y buenas prácticas que deberían seguirse al diseñar el modelo de datos.

![image-20200303122224651](/images/propiedades-relacion2.png)



## Verificar relaciones

La ventana de propiedades de relación tiene un botón para validar la relación. Esta funcionalidad permite comprobar si se pierden o duplican registros.

## Diagrama

El color y la forma de la relaciona del diagrama muestra algunas características importantes de la relación.

- Las relaciones **LEFT JOIN** se muestran con líneas discontinuas
- Las relaciones que no están verificadas se muestran de color negro 
- Las relaciones que están verificadas se muestran de color verde
- Las relaciones que tienen restricciones PK-FK son gruesas (y son siempre de color verde)
- Las relaciones **INNER JOIN**, con PK-FK, pero que admiten nulos se señalan de color verde oscuro (como advertencia que pueden perderse registros)



![image-20200303123212270](/images/propiedades-relacion3.png)

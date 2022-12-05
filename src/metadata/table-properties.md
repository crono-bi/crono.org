---
title: Propiedades de tabla
position: 18
---

# Propiedades de tabla

Desde el menú contextual de una tabla del diagrama podemos acceder a las **Propiedades de tabla**

![image-20200303102535320](/images/propiedades-tabla1.png)

## Vista "Propiedades"

En la vista propiedades se puede configurar:

- El **alias** de la tabla. Se trata de un nombre alternativo para la tabla. Sirve para poder utilizar varias veces la misma tabla para entidades diferentes. Por ejemplo, una cosa es el *"País del cliente"* y otra es el *"País de la tienda"*.
-  **Tablas adicionales**. Sirve para forzar que el SQL generado incluya alguna tabla adicional cuando se haga referencia a algún campo de la tabla. Se usa por ejemplo para forzar la inclusión de la **tabla de seguridad** que filtre la información en función del usuario conectado.
- **Cláusula WHERE**. Si se define una cláusula WHERE en la tabla, se incluirá siempre en las consultas que hagan referencia a esta tabla.
- **Tabla de detalle** (ver [Uso de tablas agregadas](#tablas-agregadas))
- **Número de registros** (ver [Uso de tablas agregadas](#tablas-agregadas))

![image-20200303103757808](/images/propiedades-tabla2.png)

## Vista "Tabla de tiempo"

Prácticamente todos los catálogos de **Crono Metadata** incluyen una tabla de tiempo. La tabla de tiempo es un maestro de fechas que incluye información como el nombre del mes, el trimestre, etc.

Desde esta vista se configuran los campos *Año*, *Trimestre* y *Mes*. Esta información se usa exclusivamente en las consultas que emplean las funciones de tiempo `TD`, `YTD`, `QTD` y `MTD`. 

![image-20200303104015471](/images/propiedades-tabla3.png)



## Vista "Referencias"

Esta vista es meramente informativa. Muestra los diagramas donde aparece esta tabla y los elementos de negocio que incluyen referencias a la tabla seleccionada.

![image-20200303104757121](/images/propiedades-tabla4.png)



Esta información también se muestra en el diagrama:

![image-20200303105038466](/images/propiedades-tabla5.png)

## Vista "Campos"

 Muestra los campos y las claves externas de la tabla.

![image-20200303105327814](/images/propiedades-tabla8.png)

En esta vista, los campos que se utilizan en el catálogo se resaltan con color verde.

## Vista "Ver valores"

Esta vista permite ver los valores de la tabla.

![image-20200303105646799](/images/propiedades-tabla6.png)



## Vista "Copos de nieve"

Esta vista es informativa. Muestra el listado de diagramas donde aparece esta tabla.

![image-20200303105843909](/images/propiedades-tabla7.png)


---
title: Listas de valores
sidebarDepth: 2
---


# Listas de valores

Las listas de valores son los valores posibles que puede tener una dimensión. Las listas de valores son útiles porque facilitan la creación de filtros a los usuarios y les permite reconocer el significado exacto de cada dimensión.

En **Crono Analysis** las listas de valores se muestran al seleccionar una dimensión del catálogo:


![image-20200302172120282](/images/lov0.png)


Desde **Crono Metadata** puedes ver la configuración de la lista de valores desde las propiedades de cada dimensión (se abre desde el menú contextual o mediante doble clic).

![image-20200302172820981](/images/lov1.png)

## Ordenación de los meses

De manera predeterminada, la lista de valores aparece ordenada alfabéticamente. Este comportamiento es el adecuado en la mayoría de ocasiones, pero hay casos donde es preferible otra ordenación. Por ejemplo, los **meses** no se ordenan alfabéticamente.

Para ordenar correctamente los meses se debe especificar el "campo de ordenación". La siguiente animación muestra como se establece la ordenación según los valores del campo numérico `MES`.



![image-20200302173308536](/images/lov.gif)

## Deshabilitar lista de valores

Es posible deshabilitar las lists de valores de algún elemento. Esto es útil cuando la lista de valores es muy grande (superior a varios millones de registros) o donde la lista no es relevante para el usuario (por ejemplo, una lista de PVP de libros es irrelevante).

![image-20200302174105823](/images/lov3.png) 

## Listas de valores filtradas

Es posible limitar los registros que se mostrarán en la lista de valores. 

Esto es útil para mostrar valores relevantes a los usuarios. Por ejemplo, se puede desear no mostrar clientes o productos antiguos que ya no son relevantes para el negocio.

Para ello, hemos de establecer el filtro desde el panel de propiedades:

![image-20200302174541300](/images/lov4.png)



Es importante señalar que ese filtro afecta únicamente a la lista de valores. Los informes seguirán mostrando todos los valores existentes, salvo que se incluya algún filtro que los excluya. 


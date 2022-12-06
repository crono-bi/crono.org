---
title: Cómo crear tu primer catálogo
position: 2
sidebarDepth: 2
---

# Cómo crear tu primer catálogo

## Crear un catálogo

Es sencillo crear un catálogo siguiendo estos pasos:

1. Crear la conexión
2. Crear los diagramas (uno o varios)
3. Crear la objetos de negocio
4. Validar el funcionamiento del catálogo

## Crear la conexión

Al hacer clic en "Crear nuevo catálogo" aparece el formulario de "Configurar conexión". 

Si la base de datos donde se encuentra tu información es **SQL Server**, simplemente completa la información de conexión (servidor, base de datos y usuario). Una vez completado el formulario pulsa el  botón "Verificar conexión" para confirmar que todos los datos con correctos.

![Conexión](/images/conexion.gif)

Vea el artículo sobre [Propiedades de conexión](#propiedades-de-conexion) para mayor información.

## Crear los diagramas 

Los diagramas -o copos de nieve- son una pieza fundamental del catálogo. **Crono** generará las consultas SQL a la base de datos en función de los diagramas definidos.

Cada diagrama esta formado por una tabla central -o tablas de hechos- y un conjunto de dimensiones. Las tablas están conectadas entre sí a través de las **relaciones**. 

Se debe crear un diagrama para cada _tabla de hechos_ del modelo.  

Para crear un diagrama siga los siguientes pasos:

1. Pulse el botón "Nuevo copo de nieve" y seleccione la tabla de hechos.
2. Arrastre una tabla de dimensión desde la vista "Base de datos" encima de la tabla de hechos.
3. Aparecerá el formulario de "Configurar relación" y deberá seleccionar los campos que definen la relación entre los dos campos. También debe especificar el tipo de relación (**INNER JOIN** o **LEFT JOIN**) 
4. Del mismo modo, repita los pasos 2 y 3 para cada una de las tablas que forman el diagrama.

![Cómo crear un diagrama](/images/diagrama.gif)

En el artículo sobre [cómo crear un diagrama](#como-crear-un-diagrama) se muestra paso a paso con imágenes explicativas.

## Crear los objetos de negocio

Los objetos de negocio son las dimensiones, indicadores y filtros que forman el catálogo y que podrá utilizar el usuario para generar sus consultas e informes.

Se pueden crear fácilmente arrastrando las tablas o los campos a la vista catálogo.

![image-20200302130450547](/images/catalogo6.png)

En el artículo sobre [cómo crear elementos de negocio](#crear-elementos-de-negocio) se muestra paso a paso con imágenes explicativas.


## Validar el funcionamiento del catálogo

Una vez terminada la primera versión del catálogo, y antes de entregárselo al usuario, conviene verificar el correcto funcionamiento del mismo. Existen tres herramientas para validar el catálogo:

1. Probar catálogo desde **Crono Metadata**
2. Herramientas de verificación
3. Probar catálogo desde **Crono Analysis**

![Probar catálogo](/images/probar.gif)

En el artículo ["Validar catálogo"](#validar-catalogo) se muestran estas herramientas con imágenes explicativas.


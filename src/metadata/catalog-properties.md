---
title: Propiedades de catálogo
position: 15
sidebarDepth: 2
---


# Propiedades de catálogo

El botón "Propiedades de catálogo" abre la ventana de propiedades:

![image-20200303131435279](/images/propiedades-catalogo.png)

## Vista "General"

![image-20200303131526683](/images/propiedades-catalogo2.png)



La vista general muestra la siguiente información:



- **Nombre:** Es el nombre del catálogo y coincide siempre con el nombre del archivo. Es el nombre que seleccionará el usuario para crear informes a partir de este catálogo.
- **Dialecto SQL:** Es el dialecto que empleará **Crono** para generar consultas. Es relevante porque no todos los motores de base de datos soportan las mismas funcionalidades ni utilizan los mismos caracteres para "encorcherar" identificadores.
- **Idioma principal**: Es el idioma en que se definen las dimensiones e indicadores del catálogo. **Crono** utiliza está información para acentuar automáticamente las palabras al arrastrar los campos de la base de datos al catálogo. También es relevante en los "Catálogos multidioma" .
- **Idiomas secundarios**: Ver [Catálogos multidioma](#catalogos-multidioma)

- **Filtro de tablas visibles**: Permite filtrar las tablas que se verán en la vista "Base de datos". Resulta útil cuando la base de datos tiene muchas tablas que no son relevantes a la hora de crear este catálogo. Se permite el uso de filtros con comodín (`dbo.dim_*`, `!*tmp*`, etc..)
- **Evitar incluir tablas...**: Esta opción no tiene ninguna funcionalidad actualmente.
- **Tipo de filtro de columna**: Indica el modificador que utilizará **Crono Analysis** para crear los filtros de columna. Esto es relevante para bases de datos que no soportan la sintaxis consultas CTE (sintaxis `WITH`)

## Vista "Parámetros"

Ver el artículo sobre [Parámetros definidos en el catálogo](#parametros-definidos-en-el-catalogo)

![image-20200303133230646](/images/propiedades-catalogo3.png)

## Vista "Autorizaciones"

Vea el artículo sobre configuración de seguridad.


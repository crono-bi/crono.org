---
title: Propiedades de elementos de negocio
position: 17
---


# Propiedades de elemento de negocio

Desde el menú contextual de un elemento de negocio (indicador, dimensión o filtro) se puede acceder a sus propiedades.

![image-20200303173955817](/images/propiedades-elemento1.png)

## Vista "Definición"

Se pueden definir las siguientes propiedades:

- **Nombre:** Es el nombre de la dimensión, indicador, o filtro. Es el nombre que verá el usuario para identificar la información. Es importante que sea un término de negocio reconocible.
- **Expresión SQL:** Es la definición SQL de este elementos de negocio. **Crono** analizará la expresión para determinar si se trata de una dimensión, de un indicador o de un filtro. La expresión puede ser un campo de la base de datos, o cualquier expresión SQL válida. Para más información vea el artículo [Campos calculados](#campos-calculados)
- **Tipo de dato:** Crono analizará la expresión para determinar si el resultado es una cadena de texto, un número, una fecha o un booleano.

El botón **"Verificar"** comprueba que no exista ningún error de sintaxis. También verifica que los campos referenciados existen realmente en el modelo de datos.

## Vista "Formato"

Desde la vista formato se define el formato predeterminado de cualquier indicador o dimensión. 

![image-20200303175303897](/images/propiedades-elemento2.png)

Además de los formatos habituales (números con decimales, fechas, porcentaje, ...) existen algunos casos particulares:

- El formato **"hipervínculo"** muestra el texto de la expresión como un enlace web. La página destino del enlace se define desde la vista "Información adicional"
- El formato **"Duración"** convierte un número en un formato `d.h.min.seg`. El valor numérico corresponde a los _segundos_ del intervalo.

## Vista "Avanzadas"

Permite configurar el color predeterminado de la celda y la fuente.



![image-20200303180056137](/images/propiedades-elemento3.png)

Desde este panel también se puede definir un formato condicional para el indicador (por ejemplo, que se muestre rojo si es negativo, etc.)

![image-20200303180316954](/images/propiedades-elemento4.png)



Esta vista también muestra una opción para "mostrar texto en ventana independiente al hacer doble clic". Esto es útil para que el usuario pueda leer el texto completo de aquellos textos lagos que no caben en una celda.

## Vista "Lista de valores"

Vea [Listas de valores](#listas-de-valores).

![image-20200303180741817](/images/propiedades-elemento5.png)

## Vista "Dimensión geográfica"

Vea [Dimensiones geográficas](#dimensiones-geograficas)

![image-20200303180933031](/images/propiedades-elemento6.png)

## Vista "Información adicional"

Permite configurar la siguiente información:

- **Tipo de elemento:** De manera predeterminada, **Crono** representa las dimensiones como una bola azul y los indicadores como una bola roja. Desde aquí se puede cambiar este icono para un elemento en particular. Se trata solo de una ayuda visual y no afecta a las consultas generadas ni al tipo de dato. Puede servir, por ejemplo, para identificar las fechas con un icono característico.
- **Documentación URL:** Puede asociar cada elemento con una dirección web (por ejemplo, con una aplicación MDM). Los usuarios podrán acceder a esta documentación desde el menú contextual del elemento.
- **Descripción:** Se puede asociar una pequeña descripción a cada elemento. El usuario verá esta información en forma de _tooltip_. Esta opción debe usarse para aclarar el significado de la dimensión, indicador o filtro, o para especificar particularidades relevantes para el negocio. 
- **Hipervínculo:** Es el campo que contiene la dirección web donde se redirigirá el usuario al hacer clic en el enlace (esta propiedad solo es relevante si el formato del elemento es "hipervínculo").
- **Modo hipervínculo**: Si el formato del elemento es "hipervínculo", aquí se especifica la acción web que se realizará al hacer clic en el enlace. 
- **Agregación predeterminada**: Indica la agregación en los subtotales de **Crono Analysis** de este indicador. Se utiliza sobre todo para evitar que se sumen indicadores que no son sumables.

![image-20200303181049398](/images/propiedades-elemento7.png)

## Vista "Idioma"

Vea el artículo sobre [Catálogos multidioma](#catalogos-multidioma)

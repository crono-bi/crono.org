---
title: Parámetros definidos en el catálogo
sidebarDepth: 2
---


# Parámetros definidos en el catálogo


**Crono Metadata** permite definir parámetros variables que el usuario tendrá que establecer antes de utilizarlos.

## Ejemplo


En la definición de los elementos del catálogo podemos utilizar expresiones y fórmulas para filtrar, por ejemplo, el año actual, el año 2012, o cualquier otro.

Para filtrar el _"año actual"_ utilizaríamos la expresión `[Año]=year(getdate())` y para filtrar el año 2022 definiríamos el filtro como `[Año]=2022`, por ejemplo.



![image-20200304210605938](/images/parametros1.png)



**Crono Metadata** permite definir también filtros que dependen de un parámetro variable. Podríamos definir el filtro _"Año X"_ como `[Año]=@AñoX`. De este modo, el filtro es variable y **Crono Analysis** preguntará el año que quiere seleccionar cuando utilice este elemento del catálogo.

![Ejemplo uso parámetros](/images/parametros2.gif)


Para crear en el catálogo un elemento de negocio que utilice parámetros variables solo es necesario incluir una variable (precedida por el símbolo `@`) en la expresión SQL. Si la variable no se ha definido todavía, **Crono Metadata** nos permitirá crearla en ese mismo momento.

![Definir el filtro Año X](/images/parametros3.gif)



La variable así definida se puede reutilizar en otros elementos de negocio. Podríamos, por ejemplo, definir el indicador _"Importe año X €"_ con la expresión `[Importe €] where (Año=@AñoX)`.



Este tipo de parámetros son útiles, por ejemplo, cuando el usuario necesita comparar las ventas del año actual respecto la de los años anteriores, y donde el usuario quiere poder seleccionar el año respecto al que compararlo.

  

## Propiedades de catálogo

En la vista parámetros de las propiedades del catálogo podemos ver todos los parámetros definidos:

![image-20200304213238967](/images/parametros4.png)

También podemos modificar los parámetros definidos abriendo sus propiedades:

![image-20200304213347579](/images/parametros5.png)

Podemos introducir o modificar la siguiente información:

- **Parámetro:** Es el nombre del parámetro. Debe ser un identificador válidos precedido por el símbolo `@`.

- **Texto:** Es el texto que se le mostrará al usuario cuando tenga que establecer el valor de este parámetro.

- **Tipo de dato:** Es importante establecer el tipo de dato correcto (numérico, texto, fecha o booleano)

- **Lista de valores:** Opcionalmente, se puede indicar una lista de valores que se le mostrará al usuario. De este modo, podrá establecer el valor más fácilmente.

- **Valor por defecto:** Es el valor predeterminado que tendrá el parámetro. 

  

## Tipos de parámetros variables

Existen tres tipos de parámetros variables:

- **Parámetros de usuario:** El usuario podrá establecer el valor del parámetro
- **Parámetros calculados:** El valor se establece a partir de una expresión. No se le preguntará al usuario.
- **Elementos de negocio parametrizables:** El usuario podrá escoger entre una lista de indicadores existentes.



### Parámetros de usuario

Son los más habituales.

![image-20200304213347579](/images/parametros5.png)

### Parámetros calculados

En este caso, el usuario no podrá establecer el valor del parámetro, ya que lo calculará la base de datos a partir de una expresión SQL preestablecida.

![image-20200304214619210](/images/parametros6.png)

### Elementos de negocio parametrizables

En lugar de establecer un valor el usuario tendrá que escoger un elementos de negocio de una lista. 

![image-20200304215755945](/images/parametros7.png)



De este modo, el usuario podrá crear un informe para un indicador genérico, y actualizarlo para cualquiera de los indicadores disponibles, sin necesidad de rehacer el informe múltiples veces.



![image-20200304220024511](/images/parametros8.png)



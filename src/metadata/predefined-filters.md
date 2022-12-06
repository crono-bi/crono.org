﻿---
title: Filtros predefinidos
position: 7
Autogenerated: true
---

# Filtros predefinidos

Además de dimensiones e indicadores en el catálogo se pueden definir **filtros predefinidos**. Se trata de filtros habituales que el usuario puede reutilizar fácilmente. Por ejemplo, se pueden crear filtros para el _"Año actual"_, _"Tiendas de España"_, o _"Clientes morosos"_. Cualquier predicado SQL puede ser un **filtro predefinido**.

En el catálogo los filtros se muestran con un icono característico:

![image-20200302205150807](/images/calculos06.png)



Los filtros predefinidos son un elemento de negocio igual que las dimensiones o indicadores. La única diferencia es que su definición SQL corresponde a un predicado SQL.

![image-20200302210802520](/images/calculos07.png)



Crono detectará automáticamente que se trata de un filtro y utilizará el icono correspondiente.

Al ser simples expresiones SQL, se puede utilizar cualquier fórmula que reconozca el motor de base de datos. Podemos, por ejemplo, definir este filtro para seleccionar datos del año actual:

![image-20200302211044646](/images/calculos08.png)

En la definición de los filtros se puede utilizar cualquier expresión **Crono SQL** válida. En el ejemplo anterior se han utilizado las funciones `year`y `getdate`. También se hace referencia a la dimensión `Año`definida en el catálogo.
---
title: "Propiedades del panel"
position: 11
---


# Propiedades de panel

Haciendo clic con el botón derecho en la parte superior de un panel (en la espacio reservado para el título) aparece el menú contextual del panel, y puede abrirse la ventana de propiedades.

![Propiedades de panel 1](/images/analysis/panel1.png)



Desde esta ventana pueden definirse las siguientes propiedades:

- **Nombre:** Es el nombre o título del panel. 
- **Fuente:** Es la fuente (tipo de letra, tamaño, color...) que tendrán las columnas de este panel. La fuente se puede establecer también a nivel de columna y a nivel de documento.
- **Propagar selección:** De manera predeterminada, al seleccionar un registro del panel, la selección se propaga al resto de paneles, actuando como un filtro. Este comportamiento se puede modificar desactivando esta opción. En este caso, la selección de un valor no tendrá ningún efecto en el resto de paneles de la hoja.
- **Mostrar todas las filas:** Si se selecciona esta opción, la consulta devolverá también los registros que no tengan información. Es útil para mostrar, por ejemplo, un listado de todas las "tiendas", tengan o no tengan "ventas" en el periodo seleccionado. También serviría para mostrar las fechas sin información, o los clientes sin pedidos, etc.



![Propiedades de panel 2](/images/analysis/panel2.png)

- **Permitir cambiar la ordenación de la tabla:** De manera predeterminada, al hacer clic en la cabecera de una columna se ordena la información de la tabla. Este comportamiento puede cambiarse desmarcando esta opción. De este modo, evitamos modificar inadvertidamente el orden de la tabla .

- **Permitir reordenar las columnas:** De manera predeterminada, se pueden reordenar las columnas mediante _drag & drop_. Este comportamiento puede cambiarse desmarcando esta opción.

- **Permitir filtrar el resultado de la consulta**: De manera  predeterminada, existe un pequeño menú que permite filtrar el resultado de la columna. Este menú puede desactivarse desmarcando esta opción.

  
![Propiedades de panel 3](/images/analysis/panel3.png)

  

- **Bloquear la consulta:** Si se selecciona esta opción, se impide que se puedan añadir o quitar columnas o filtros al panel. Desde propiedades de documento también se puede bloquear el documento entero.
- **Selección obligatoria**: Impide que se ejecuten las consultas dependientes a menos que haya algún registro seleccionado en este panel. Esta opción es útil para evitar la realización de consultas innecesarias (que presumiblemente serían costosas).

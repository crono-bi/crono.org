---
title: Seguridad y permisos de acceso
position: 14
sidebarDepth: 2
---


# Seguridad y permisos de acceso

La seguridad y los permisos de acceso son aspectos importantes que deben valorarse en cualquier proyecto *Business Intelligence*.

En particular, existen varias consideraciones sobre seguridad y accesos que deben tenerse en cuenta al diseñar un catálogo con **Crono Metadata**:

- Distribución del catálogo
- Cadena de conexión
- Seguridad a nivel de fila
- Seguridad a nivel de campo
- Seguridad a nivel de catálogo

**Crono** tiene todas las funcionalidades necesarias para implementar un entorno BI seguro y controlado.

## Distribución del catálogo

El catálogo es un archivo con extensión **.metadata** que contiene información sobre la conexión y la estructura de la base de datos.

El usuario de negocio necesita acceso al catálogo para realizar los informes. Para ello, existen tres modos de distribuirlo:

- **Local:** El archivo se comparte con el usuario mediante una copia en su equipo o depositándolo en una carpeta compartida. En este caso, no se necesita servidor, y es el ordenador del usuario el que realiza directamente las consultas a la base de datos.
- **Nube:** El archivo se comparte a través de un servicio en la nube. Actualmente **Crono** permite leer y escribir el catálogo en los servicios de **Amazon S3** y **Github**. En este caso, tampoco se necesita servidor **Crono**, y es también el ordenador del usuario el que realiza directamente las consultas a la base de datos.
- **Servidor Crono:** El archivo está únicamente en el servidor Crono. Los usuarios se conectan al servidor para leer la estructura del catálogo, pero es el servidor **Crono** el que finalmente ejecuta las consultas. Los usuarios no tienen acceso a la cadena de conexión ni ésta se transmite por la red.

Las instalaciones en "local" y en la "nube" tienen la ventaja de la facilidad de instalación, pero no permiten el control de usuario, ni la seguridad a nivel de campo.

La instalación en un servidor **Crono** permite un control total sobre la información a la que puede acceder cada usuario.

Vea la documentación de **Crono Server** para mayor información.

## Cadena de conexión

El catálogo contiene la información de conexión (servidor, base de datos, usuario y password), salvo que se utilice una conexión de equipo.

Alguien con acceso a esta información podría conectarse a la base de datos desde un terminal. Por este motivo, se recomienda utilizar siempre que sea posible **autentificación Windows**, y utilizar un usuario que tenga acceso de **solo lectura**, y solo a las tablas estrictamente necesarias, y a ninguna con información confidencial. Es decir, se recomienda controlar desde la base de datos el acceso a los datos en función del usuario conectado. De este modo, los datos están protegidos, independientemente del cliente de acceso que utilicen (**Crono** u otro).

Todo lo anterior es especialmente importante en instalaciones en local (o en la nube), ya que en este caso la información de conexión está en el equipo del usuario. En una instalación de servidor la conexión está solo en el servidor, y no se envía a los usuarios, por lo que es más sencillo mantenerla segura.

En resumen: Las consideraciones de seguridad sobre la conexión son las mismas que se harían con cualquier otra herramienta de consulta, y deben seguirse las directrices que cada organización tenga establecidas. 

Para mayor información, vea la documentación sobre [Propiedades de conexión](#propiedades-de-conexion)

## Seguridad a nivel de fila

**Crono** permite controlar los registros que puede consultar cada usuario. Por ejemplo, puede limitarse para que cada director de zona vea solo los datos de su zona, o que los responsables comerciales vean solo la información de sus respectivos clientes. Al mismo tiempo, puede configurarse para que determinados perfiles tengan acceso completo a toda la información.

Para ello han que seguirse estos 3 pasos:

- Crear la *tabla de seguridad* 
- Incluir la *tabla de seguridad* en el diagrama y aplicarle una restricción WHERE
- Configurar la tabla con información confidencial para que consulte siempre la *tabla de seguridad*.

**1. Crear la tabla de seguridad**

La seguridad a nivel de fila se consigue a través de una "tabla de seguridad". En esta tabla se almacena la información que puede ver cada usuario. Esta es la estructura típica de una "tabla de seguridad":

![image-20200305002131034](/images/seguridad1.png)



Una vez configurado, el usuario "Admin" tendrá acceso a la información de las 4 tiendas, mientras que Juan solo podrá ver los datos de las tiendas 3 y 4, y el resto de usuarios solo podrán consultar los datos de una única tienda (cada uno la suya). 

Esta tabla debe estar en la base de datos. Habitualmente es un proceso ETL el encargado de poblar esta tabla en función de las necesidades.

**2. Incluir la tabla de seguridad en el diagrama**

La tabla de seguridad se añade normalmente al diagrama:

![image-20200305003032822](/images/seguridad2.png)



Después, se ha de configurar la "cláusula WHERE" en función del `@user`. Esta variable está siempre disponible y hacer referencia al usuario conectado.

![image-20200305003220335](/images/seguridad3.png)

De esta manera, siempre que una consulta incluya la tabla de seguridad se añadirá la restricción `LB_SEGURIDAD_TIENDAS.USUARIO_WINDOWS=@user`, donde `@user`es el nombre del usuario conectado.

**3. Configurar la tabla con información confidencial**

Finalmente, hay que indicar que siempre que se haga una consulta de *ventas* -que es la información que se quiere proteger en este ejemplo- se incluya la *tabla de seguridad* en la consulta.

Esto se hace desde las propiedades de la tabla de ventas:

![image-20200305003756485](/images/seguridad4.png)



De este modo, por ejemplo, si el usuario **MyORG\Juan** consulta las ventas por año, **Crono** generará esta consulta, y la base de datos solo devolverá la información de las tiendas de **MyORG\Juan**.

```sql
SELECT
  LB_MESES.ANYO AS [Año],
  sum(LB_VENTAS.UNIDADES) AS [Unidades vendidas]
FROM dbo.LB_VENTAS LB_VENTAS
INNER JOIN dbo.LB_TIEMPO LB_TIEMPO ON (LB_VENTAS.FECHA=LB_TIEMPO.FECHA)
INNER JOIN dbo.LB_MESES LB_MESES ON (LB_TIEMPO.ANYO=LB_MESES.ANYO AND LB_TIEMPO.MES=LB_MESES.MES)
INNER JOIN dbo.LB_TIENDAS LB_TIENDAS ON (LB_VENTAS.ID_TIENDA=LB_TIENDAS.ID_TIENDA)
INNER JOIN dbo.LB_SEGURIDAD_TIENDAS LB_SEGURIDAD_TIENDAS ON (LB_TIENDAS.ID_TIENDA=LB_SEGURIDAD_TIENDAS.ID_TIENDA)
WHERE LB_SEGURIDAD_TIENDAS.USUARIO_WINDOWS='MyORG\Juan'
GROUP BY LB_MESES.ANYO

```

La "seguridad de fila" se puede implementar tanto en las instalaciones de servidor como en las locales (o en la nube).



## Seguridad a nivel de campo

El usuario de **Crono Analysis** accede a las tablas a través de los elementos del catálogo y no directamente a un campo particular. Por ello, lo que debe controlarse son los accesos a los elementos de negocio. Esto se hace desde la ventana de propiedades, en la vista "Autorizaciones":

 

![image-20200305010730736](/images/seguridad5.png)

Desde esta pantalla se pueden conceder o denegar accesos a usuarios o grupos. Los permisos se evalúan secuenciamente. En caso de asignaciones contradictoria prevalece el último de la lista.

En este ejemplo, el departamento "Comercial" no puede acceder a este elemento de negocio, excepto "Pedro". El grupo de "Dirección" también puede acceder, incluso si comparte el rol de "Comercial".

Los permisos también pueden definirse a nivel de carpeta. Si se restringe el acceso a una carpeta a un usuario, dicho usuario no podrá acceder a ninguno de sus indicadores.

**IMPORTANTE:** Estas restricciones no aplican en una instalación en local o en nube. Solo el **servidor Crono** tiene en cuenta la configuración de permisos.



## Seguridad a nivel de catálogo

En propiedades de catálogo pueden configurarse los permisos de acceso al catálogo. Si alguien no tiene acceso al catálogo, no lo verá en su lista de catálogos, y no podrá acceder a ninguno de sus elementos.

 ![image-20200305011715511](/images/seguridad6.png)

**IMPORTANTE:** Estas restricciones no aplican en una instalación en local o en nube. Solo el **servidor Crono** tiene en cuenta la configuración de permisos.

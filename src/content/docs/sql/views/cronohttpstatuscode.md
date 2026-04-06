---
title: "Crono$HttpStatusCode"
---

# Crono$HttpStatusCode

La pseudovista `Crono$HttpStatusCode` permite obtener el *StatusCode* de una (o varias) peticiones HTTP.

La pseudovista tiene estas propiedades:

- **Location**: Es la URL de la ubicación a consultar
- **Data**: Sentencia que permite comprobar múltiples ubicaciones HTTP



##  Ejemplo

La siguiente sentencia permite ver la respuesta que se obtiene al hacer una petición a https://crono.org/sql/functions/

```
select *
from Crono$HttpStatusCode(Location='https://crono.org/sql/functions/')
```

La respuesta tiene un resultado similar a:

|Location                         |StatusCode |Status |Datetime            |
|---------------------------------|-----------|-------|--------------------|
|https://crono.org/sql/functions/ |200        |OK     |06/05/2025 08:42:46 |


La **propiedad Data** permite comprobar muchas URL al mismo tiempo:

```
select Location, StatusCode, Status
from Crono$HttpStatusCode(
	Data=(
		select top 20 $'https://crono.org/sql/functions/{name}.html' Location
		from Crono$Functions	
		order by nAME
	)
)
```

El resultado es similar a:

|Location                                             |StatusCode |Status           |
|-----------------------------------------------------|-----------|-----------------|
|https://crono.org/sql/functions/abc.html             |200        |OK               |
|https://crono.org/sql/functions/abs.html             |200        |OK               |
|https://crono.org/sql/functions/acos.html            |200        |OK               |
|https://crono.org/sql/functions/adddays.html         |301        |MovedPermanently |
|https://crono.org/sql/functions/addition.html        |200        |OK               |
|https://crono.org/sql/functions/ascii.html           |200        |OK               |
|https://crono.org/sql/functions/asin.html            |200        |OK               |
|https://crono.org/sql/functions/atan.html            |200        |OK               |
|https://crono.org/sql/functions/atn2.html            |200        |OK               |
|https://crono.org/sql/functions/average.html         |301        |MovedPermanently |
|https://crono.org/sql/functions/avg.html             |200        |OK               |
|https://crono.org/sql/functions/bighex.html          |200        |OK               |
|https://crono.org/sql/functions/bigint.html          |200        |OK               |
|https://crono.org/sql/functions/binary_checksum.html |200        |OK               |
|https://crono.org/sql/functions/bit.html             |200        |OK               |
|https://crono.org/sql/functions/cast.html            |200        |OK               |
|https://crono.org/sql/functions/ceiling.html         |200        |OK               |
|https://crono.org/sql/functions/char.html            |200        |OK               |
|https://crono.org/sql/functions/charindex.html       |200        |OK               |
|https://crono.org/sql/functions/checksum.html        |200        |OK               |







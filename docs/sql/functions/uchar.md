---
SidebarGroup: index-conversion-functions
Catalog: cronosql.metadata
title: uchar ❇️
---


# uchar ❇️

Devuelve el carácter Unicode correspondiente al código numérico dado, tal como se define en el estándar Unicode.

A diferencia de `nchar`, al menos en las versiones antiguas de SQL Server, `uchar` soporta caracteres subrogados por encima de 0xFFFF.


## Ejemplos

La siguiente consulta devuelve varios caracteres unicode a partir de su representación numérica (decimal o hexadecimal).

<SqlCodeBlock jsonPath="/json_sql/sql-938FB6.json" />

El resultado es:

|letterA |pizza |blueHeart |
|--------|------|----------|
|A       |🍕    |💙        |


## Comentarios


Para obtener el valor numérico a partir de un carácter se pueden usar las funciones `ascii` o `unicode`, aunque estas solo cubren el rango hasta '0xFFFF'.

También se puede consultar la lista completa de caracteres unicode con las vistas `Crono$UnicodeTable` y `Crono$UnicodeChars`.

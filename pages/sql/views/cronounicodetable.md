---
SidebarGroup: "index-metadata-views"
Catalog: "cronosql.metadata"
---

# Crono$UnicodeTable



Devuelve la tabla de caracteres UNICODE.

La siguiente consulta muestra algunos caracteres UNICODE.


``` CronoSqlSample
select 
	CodePoint,
	highSurrogate,
	lowSurrogate,
	[hex],
	[char],
	[Unicode]
from Crono$UnicodeTable
where 
  codepoint between 65 and 69 
  or codepoint between 0x1F600  and 0x1F607
order by 1 
```

El resultado de esta consulta es:

``` table
select 
	CodePoint,
	highSurrogate,
	lowSurrogate,
	[hex],
	[char],
	[Unicode]
from Crono$UnicodeTable
where 
  codepoint between 65 and 90 
  or codepoint between 0x1F600  and 0x1F607
order by 1 
```

## Comentarios

Esta vista es similar a `Crono$UnicodeChars`.

La vista `Crono$Emojis` devuelve únicamente caracteres emojis con información adicional.



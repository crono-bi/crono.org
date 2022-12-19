---
SidebarGroup: "index-metadata-views"
Catalog: "cronosql.metadata"
---

# Crono$UnicodeChars



Devuelve el listado completo de caracteres UNICODE, incluyendo su nombre y tipología. 

Esta información está generada a partir del fichero [UnicodeData.txt](http://www.unicode.org/Public/UNIDATA/UnicodeData.txt) proporcionado por Unicode Consortium.

La siguiente consulta muestra 100 caracteres UNICODE.


``` 
select top 100 *
from Crono$UnicodeChars
where codepoint between 65 and 90 or [Group]='Emoji' 
order by 1
```

El resultado de esta consulta es:

``` table
select top 100 *
from Crono$UnicodeChars
where codepoint between 65 and 90 or [Group]='Emoji' 
order by 1
```


## Comentarios

Esta vista es similar a `Crono$UnicodeTable`.

La vista `Crono$Emojis` devuelve únicamente caracteres emojis con información adicional.


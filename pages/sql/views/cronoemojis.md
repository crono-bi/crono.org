---
SidebarGroup: "index-metadata-views"
Catalog: "cronosql.metadata"
---

# Crono$Emojis



Devuelve el listado completos de Emojis reconocidos por el estándar UNICODE. 

Esta información está generada a partir del fichero [emoji-test.txt](https://unicode.org/Public/emoji/13.0/emoji-test.txt) proporcionado por Unicode Consortium.


``` CronoSqlSample
select 
	GroupName,
	SubgroupName,
	Name,
	Emoji
from Crono$Emojis
where SubgroupName='face-smiling'
order by emoji
```

El resultado de esta consulta es:

``` table
select 
	GroupName,
	SubgroupName,
	Name,
	Emoji
from Crono$Emojis
where SubgroupName='face-smiling'
order by emoji
```


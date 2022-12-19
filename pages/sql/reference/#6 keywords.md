---
title: Palabras reservadas
---

# Palabras reservadas de Crono SQL

En la lista siguiente se incluyen todas las palabras reservadas por el generador de consultas de **Crono SQL**. 

Estas palabras clave se pueden utilizar como identificadores o nombres de objetos de base de datos, pero para ello se deben escribir entre corchetes.

``` table {"Catalog": "cronosql.metadata"}
select
	maxif(col=0,name) Keyword1,
	maxif(col=1,name) Keyword2,
	maxif(col=2,name) Keyword3,
	maxif(col=3,name) Keyword4,
	maxif(col=4,name) Keyword5
from (select
		rank(order by name)-1 [rank],
		floor([rank]/5.0)	[row],
		mod([rank],5) col,
		name
	from Crono$Keywords
  where 
    not name starts with 'CRONO'
    and name<>'SET_PROPERTY_NAME_EQUAL') a
group by [row]
order by [row]
```

El propio lenguaje **Crono SQL** permite consultar las palabras reservadas con la vista **Crono$Keywords**.

El anterior listado se puede obtener con esta consulta:


``` sql
select
	maxif(col=0,name) Keyword1,
	maxif(col=1,name) Keyword2,
	maxif(col=2,name) Keyword3,
	maxif(col=3,name) Keyword4,
	maxif(col=4,name) Keyword5
from (select
		rank(order by name)-1 [rank],
		floor([rank]/5.0)	[row],
		mod([rank],5) col,
		name
	from Crono$Keywords
  where not name starts with 'CRONO'
  ) a
group by [row]
order by [row]
```




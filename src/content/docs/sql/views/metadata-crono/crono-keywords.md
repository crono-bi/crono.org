---
title: "crono.keywords"
---



Devuelve el listado de palabras reservadas del lenguaje Crono SQL. Estas palabras deben encorchetarse si se quieren utilizar como identificadores de tabla, columna, u otros objetos. El listado completo está disponible en el apartado [Palabras reservadas](/sql/language/keywords/).

```crono-sql
select *
from crono.keywords
```

## Columnas

| Columna | Descripción |
|---|---|
| `keyword` | Palabra reservada del lenguaje Crono SQL |

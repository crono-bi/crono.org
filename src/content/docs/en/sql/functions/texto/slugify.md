---
title: "slugify"
---

La función `slugify` convierte una cadena de texto en un slug: elimina acentos, convierte a minúsculas y sustituye los espacios y caracteres especiales por guiones.

## Ejemplo

```crono-sql
select slugify('Ángel García López') resultado;
```

El resultado es:

> angel-garcia-lopez

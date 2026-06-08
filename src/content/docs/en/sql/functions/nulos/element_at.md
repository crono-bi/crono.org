---
title: "element_at"
---

La función `element_at` convierte un entero en una expresión seleccionándola de una lista según su posición. El índice comienza en 1.

Es una forma compacta de traducir valores ordinales en etiquetas o expresiones.

## Ejemplo

```crono-sql
select element_at(2, 'Alto', 'Medio', 'Bajo') resultado;
```

El resultado es:

> Medio

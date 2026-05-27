---
title: "hash"
---

La función `hash` genera una huella digital a partir de uno o más valores de cualquier tipo. Devuelve una cadena hexadecimal. Es útil para detectar si un conjunto de campos ha cambiado entre dos registros, por ejemplo para comparar claves compuestas en un join.

## Ejemplo

```crono-sql
select hash('hola', 5, current_date) resultado;
```

## Comentario

La función acepta cualquier número de parámetros y cualquier tipo de dato. Todos los valores se combinan internamente antes de aplicar el hash, por lo que `hash('a', 'b')` y `hash('ab')` producen resultados distintos.

**Advertencia:** esta función no debe usarse con fines criptográficos. El resultado puede variar entre motores de base de datos o entre versiones de Crono SQL. Su uso es limitado y experimental.

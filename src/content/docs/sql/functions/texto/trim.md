---
title: "trim"
---


La función `trim` suprime los espacios iniciales y finales de una cadena de texto.

## Ejemplo

```crono-sql
select trim('   Hello World! ')  as result;
```

El código generado es:

```crono-sql
SELECT ltrim(rtrim('   Hello World! ')) AS result
```

El resultado es una cadena de texto sin espacios al inicio ni al final del texto: **'Hello World!'**


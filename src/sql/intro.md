---
title: "Introducción"
position: 1
---

# Lenguaje Crono SQL

Crono SQL es un lenguaje de programación para facilitar el desarrollo ágil de proyectos ETL/DWH. En esta página se muestra la sintaxis de la sentencia SELECT mediante ejemplos.

## ¿Qué es Crono SQL?

**Crono SQL** es un lenguaje de programación creado por Pablo Urquizu (fundador de Crono BI) para facilitar el desarrollo ágil de proyectos ETL/DWH.

**Crono SQL** es un lenguaje que compila en SQL. Crono SQL y SQL tienen la misma relación, por ejemplo, que [TypeScript](https://es.wikipedia.org/wiki/TypeScript) y JavaScript, o [Markdown](https://daringfireball.net/projects/markdown/syntax) y HTML. 

**Crono SQL** extiende la sintaxis de SQL, por tanto cualquier sentencia **SELECT** existente debería funcionar sin problemas. 

El lenguaje **Crono SQL** pretende simplificar la sintaxis del SQL evitando las repeticiones de código y automatizando la generación del código más farragoso y repetitivo. 

**Crono SQL** es un lenguaje mucho más imperativo, más fácil de escribir, de leer, y de mantener que el SQL ISO. 

En esta página se documenta el funcionamiento de la sentencia **SELECT** del lenguaje. La sintaxis **SELECT** de **Crono SQL** aporta algunas ventajas (algunas importantes) frente al SQL ISO. Sin embargo, el mayor beneficio del lenguaje se manifiesta en el resto de instrucciones DML (**INSERT**, **UPDATE**, **MERGE**, …), donde Crono SQL automatiza toda la lógica de carga. Por eso la sentencia **SELECT** es tan importante… ¡Es lo prácticamente lo único que tendrá que codificar el desarrollador de un proyecto  ETL/DWH!

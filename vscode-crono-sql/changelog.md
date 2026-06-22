# Changelog

Todas las novedades relevantes de la extensión Crono SQL.

## [0.1.0] - 2026-06-16

### Añadido

- Resaltado de sintaxis para Crono SQL (extiende SQL estándar con keywords y funciones de Crono).
- Autocompletado de keywords y funciones con firma y categoría.
- Documentación al pasar el cursor sobre funciones y keywords, incluyendo frases compuestas (`MERGE CLONE`, `SEMI JOIN`...).
- Descripciones y ejemplos de hover extraídos automáticamente de los docs oficiales (94/99 funciones) vía `npm run sync:docs`.
- Snippets para los patrones de carga y plantillas habituales.
- Configuración de lenguaje: comentarios, brackets, plegado e indentación.
- Ajustes `cronoSql.completion.enabled` y `cronoSql.hover.enabled`.
- Script `sync` para mantener la fuente única de verdad con `crono.org`.

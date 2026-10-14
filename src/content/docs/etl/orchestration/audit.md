---
title: "Auditoría"
description: "Trazabilidad automática de las cargas: registros, procedimientos y jobs."
---

<!-- PENDIENTE: Página por redactar. Planteamiento acordado: trazabilidad en tres niveles, automática y sin código.
- Registro: campos de auditoría de cada tabla (fechas de inserción, modificación, eliminación y vigencia), configurables en las opciones ETL del proyecto. Ya documentado en Crono SQL (/sql/language/load-patterns/#auditoría): resumir y enlazar.
- Procedimiento: los procedimientos registran cada ejecución en audit.logs (nombre configurable), si la tabla existe. Columnas vistas: Id Log, Id Log Padre, Id Log Carga, Fecha Inicio, Fecha Fin, Procedimiento... El UI tiene la ventana "Loads history" (tabla, gráfico, últimas 30 cargas, resumen diario). Hoy solo es configurable en SQL Server (usa propiedades extendidas); hay que repensarlo para el resto de motores antes de documentarlo.
- Job: log, Calendas y correo de fin de carga (enlazar a Ejecución auditada).
-->

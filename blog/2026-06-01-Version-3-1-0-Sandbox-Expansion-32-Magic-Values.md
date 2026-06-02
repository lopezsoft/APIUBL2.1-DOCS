---
slug: sandbox-expansion-pos-no-residentes
title: "v3.1.0: Expansión Masiva del Sandbox — 32 Magic Values, POS y Documentos Soporte No Residentes"
authors: [lewis]
tags: [Sandbox, Magic Values, Postman, POS, Documento Soporte, Nómina, Release]
---

Nos complace anunciar la **versión 3.1.0** de MATIAS API, la cual trae una expansión sin precedentes a nuestro ecosistema de pruebas. Hemos escuchado el feedback de la comunidad de desarrolladores y hemos transformado nuestro Sandbox en una herramienta de simulación de grado empresarial.

A partir de hoy, nuestro Sandbox ya no solo simula facturas electrónicas estándar, sino que soporta el **100% de los documentos electrónicos** autorizados por la DIAN y eleva nuestra capacidad de simulación a **32 escenarios de error (Magic Values)**.

<!--truncate-->

## ¿Qué hay de nuevo en el Sandbox v3.1.0?

### 1. Motor de Simulación Ampliado (32 Magic Values)
Hemos pasado de 8 simulaciones básicas a un motor robusto con **32 cabeceras HTTP de prueba** (`X-Sandbox-Force-Status`). Ahora puedes poner a prueba la resiliencia de tu aplicación forzando errores criptográficos (CUFE, CUDE, CUNE), desajustes en fechas, descuadres matemáticos, resoluciones vencidas e incluso fallos por certificados no válidos.

Todo esto estructurado por tipo de documento:
*   **Factura Electrónica:** 12 simulaciones avanzadas (redondeos, firmas alteradas, NITs inválidos).
*   **Notas Crédito/Débito:** 3 simulaciones (desfase de fechas, referencias huérfanas).
*   **Documento Soporte:** 3 simulaciones (impuestos no permitidos, inconsistencias DANE).
*   **Nómina Electrónica:** 3 simulaciones (períodos inconsistentes, departamentos inexistentes).
*   **Documento POS:** 5 simulaciones (CUDE inválido, RUT inconsistente).
*   **Infraestructura:** Simulaciones de Error 500 y Timeouts directos con la DIAN.

### 2. Paridad Total de Módulos (POS y No Residentes)
El entorno de pruebas ahora soporta nativamente la emisión de **Documentos Equivalentes POS Electrónicos** y sus notas de ajuste, así como la emisión de **Documentos Soporte para entidades No Residentes** (operaciones en el exterior). Todos ellos habilitados también mediante los endpoints de *auto-incremento* para máxima velocidad de desarrollo.

### 3. Colección Postman Robusta
Nuestra colección oficial en Postman ha recibido una reestructuración completa. Hemos pasado de 14 peticiones a **36 peticiones listas para usar**, organizadas meticulosamente en 10 carpetas lógicas. Importar y probar todos estos nuevos módulos te tomará literalmente unos segundos.

### 4. Biblioteca de Payloads de Ejemplo
Para facilitar la adopción de las nuevas funcionalidades, hemos publicado una biblioteca extensa de *Payloads* (JSONs de ejemplo reales) directamente en nuestra documentación (`docs/sandbox/jsons/`). Allí encontrarás las estructuras base necesarias para construir facturas de exportación, pagos POS, liquidaciones de nómina y más, todas garantizadas para pasar las validaciones del esquema UBL 2.1.

---

### Siguientes Pasos
Te invitamos a explorar las guías actualizadas en nuestra documentación:

*   📖 [Revisar los 32 Magic Values](/docs/sandbox/magic-values)
*   ⬇️ [Descargar la nueva Colección Postman (v3.1.0)](/docs/sandbox/postman)
*   🚀 [Ir al Quickstart del Sandbox](/docs/sandbox/quickstart)

¡El código fuente seguro empieza con pruebas rigurosas, y nuestro Sandbox está aquí para respaldarte!

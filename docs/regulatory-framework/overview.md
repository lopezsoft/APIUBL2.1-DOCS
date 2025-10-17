---
sidebar_position: 1
description: "Descripción general del marco regulatorio colombiano para facturación electrónica"
---

# Marco Regulatorio DIAN

## Introducción

Esta sección contiene la documentación de los anexos técnicos emitidos por la **Dirección de Impuestos y Aduanas Nacionales (DIAN)** de Colombia para la implementación de documentos electrónicos en procesos comerciales.

La DIAN ha establecido los requisitos técnicos y normativos para garantizar la integridad, autenticidad y trazabilidad de los documentos electrónicos. Estos anexos son **obligatorios** para cualquier software que desee generar, enviar y procesar documentos electrónicos en territorio colombiano.

## Documentos Regulatorios

### 📋 Factura Electrónica (FE)

La Factura Electrónica de Venta es el documento electrónico que expresa un comprobante de venta y es emitido por el responsable del régimen de facturación.

- **Normativa**: Resolución 000165 de 2024
- **Versión Actual**: 1.9
- **Estándar**: UBL 2.1 (Universal Business Language)
- **Validez Legal**: Reconocida por la DIAN y con valor probatorio ante cualquier autoridad

**Documentos Relacionados:**
- Nota Crédito Electrónica
- Nota Débito Electrónica
- Factura Cambio de Régimen

### 💼 Nómina Electrónica

La Nómina Electrónica es el documento electrónico que registra las relaciones laborales entre empleadores y trabajadores.

- **Normativa**: Resolución 0000040 de 2024
- **Versión Actual**: 3.0
- **Casos de Uso**: Nóminas ordinarias, extraordinarias, ajustes, terminación

### 📄 Documentos Equivalentes

Los Documentos Equivalentes Electrónicos son aquellos emitidos por sujetos no obligados a emitir factura electrónica que actúan como comprobante equivalente de una factura.

- **Normativa**: Resolución 000166 de 2024
- **Versión Actual**: 1.3
- **Destinatarios**: Pequeños comerciantes, profesionales independientes

### 🏥 Documento Soporte - Operaciones Efectivo

El Documento Soporte de Operaciones Efectivo es un documento electrónico que puede servir como soporte de transacciones de operaciones con terceros sin costo para el usuario final.

- **Normativa**: Resolución 000160 de 2024
- **Versión Actual**: 1.1
- **Casos de Uso**: Operaciones de efectivo, servicios en línea

### 🔄 RADIAN (Red de Administración de Documentos Activos de Identificación Normalizada)

RADIAN es un modelo tecnológico integral para el intercambio electrónico seguro de documentos donde el recibidor da trámite a la transacción de transferencia de derechos y obligaciones de los documentos electrónicos.

- **Normativa**: Resolución 000198 de 2024
- **Versión Actual**: 2.0
- **Características**: Basado en la norma UBL 2.1

## Estructura de Esta Documentación

Cada anexo técnico contiene:

1. **Introducción** - Descripción general y conceptos clave
2. **Anexo Técnico** - Especificaciones detalladas de campos obligatorios y opcionales
3. **Validaciones** - Reglas de validación y restricciones
4. **Excepciones** - Casos especiales y tratamientos diferenciados
5. **Ejemplos de Aplicación** - Casos de uso prácticos

## Cómo Usar Esta Documentación

:::tip
Recomendamos comenzar por el documento que se ajuste a tu modelo de negocio:

- **¿Emites facturas?** → Consulta [Factura Electrónica](/docs/regulatory-framework/factura-electronica/intro)
- **¿Tienes empleados?** → Consulta [Nómina Electrónica](/docs/regulatory-framework/nomina-electronica/intro)
- **¿No eres obligado a FE?** → Consulta [Documentos Equivalentes](/docs/regulatory-framework/documentos-equivalentes/intro)
- **¿Trabajas con efectivo?** → Consulta [Documento Soporte](/docs/regulatory-framework/documento-soporte/intro)
- **¿Necesitas transferir derechos?** → Consulta [RADIAN](/docs/regulatory-framework/radian/intro)
:::

## Actualización de Normativa

Esta documentación se actualiza regularmente para reflejar los cambios en la normativa DIAN. La fecha de última actualización se encuentra en cada documento específico.

Para ver el historial de cambios en la normativa, consulta la [página de descargas DIAN](https://www.dian.gov.co/impuestos/factura-electronica).

## Recursos Adicionales

- 🔗 [Sitio Oficial DIAN](https://www.dian.gov.co/)
- 📚 [Portal de Facturación Electrónica](https://www.dian.gov.co/fisc/Paginas/default.aspx)
- 📖 [Tablas Referenciadas DIAN](/docs/regulatory-framework/tablas-referencia)
- 🔍 [Glosario de Términos](/docs/glossary)

## Preguntas Frecuentes

**¿Es obligatorio usar esta documentación?**
No, pero es altamente recomendado. Esta documentación complementa los anexos oficiales de la DIAN y te ayuda a implementar correctamente la API de MATIAS.

**¿Dónde encuentro los anexos técnicos oficiales?**
En las carpetas de esta documentación encuentras referencias a los documentos oficiales. También puedes descargar los anexos del sitio de la DIAN.

**¿Cómo reporto un error en esta documentación?**
Si encuentras errores o inconsistencias, puedes crear un issue en el [repositorio del proyecto](https://github.com/lopezsoft/APIUBL2.1-DOCS).

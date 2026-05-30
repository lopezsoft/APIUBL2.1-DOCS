---
slug: version-3-0-7-lanzamiento-ambiente-sandbox
title: "Versión 3.0.7 - Lanzamiento Oficial del Ambiente Sandbox e Integración Postman"
authors: [lewis]
tags: [release, v3-0-7, sandbox, testing, postman, developer-experience]
date: 2026-05-30
---

# 🚀 API UBL 2.1 v3.0.7 - Lanzamiento del Ambiente Sandbox de Pruebas

Estamos extremadamente orgullosos de anunciar la **versión 3.0.7** de la plataforma, que trae consigo el hito técnico más esperado del roadmap: el **Lanzamiento Oficial de nuestro ambiente Sandbox**. A partir de hoy, los integradores cuentan con una suite completa de pruebas aisladas, simulaciones de estados DIAN en tiempo real y recursos listos para automatizar integraciones con un esfuerzo mínimo.

<!--truncate-->

---

## 🏗️ Una Experiencia de Pruebas Robusta y Profesional

Nuestra filosofía de desarrollo prioriza una **Experiencia del Desarrollador (DX) prémium**. Por ello, diseñamos el sandbox bajo el mismo concepto que plataformas líderes de la industria como Stripe:

1.  **Credenciales Globales Replicadas:** No necesitas crear cuentas especiales para pruebas. Te registras en producción y tus credenciales se replican automáticamente en tiempo real al servidor sandbox (`{{SANDBOX_URL}}`).
2.  **Endpoints 100% Homólogos:** El sandbox expone exactamente la misma firma y comportamiento de endpoints que producción. Cambiar de entorno es tan simple como modificar el dominio base de tus peticiones.
3.  **Encabezado de Diagnóstico de Entorno:** Todas las respuestas HTTP devueltas por el sandbox inyectan la cabecera `X-MATIAS-Environment: sandbox` para un rastreo y diagnóstico inmediatos en tus consolas de red.

---

## 📦 Nuevas Guías de Integración Disponibles

Hemos añadido una **categoría exclusiva en el sidebar** de documentación estructurada en 4 subsecciones detalladas:

### ⚡ 1. [Guía Quickstart](/docs/sandbox/quickstart)
Conecta tu software al sandbox en menos de 5 minutos mediante una secuencia lineal paso a paso (Registro ➔ Login ➔ Generación de PAT ➔ Primera Solicitud).

### 🔮 2. [Magic Values (Cabeceras de Simulación)](/docs/sandbox/magic-values)
Olvídate de bases de datos de prueba o inyección de payloads corruptos. Forzar escenarios en el sandbox es tan sencillo como enviar la cabecera HTTP **`X-Sandbox-Force-Status`**. Soporta:
*   **6 Errores de la DIAN:** Rechazos por negocio (`B7B01`), duplicidad de consecutivo (`89`), fallas estructurales XSD (`FAD06`), caídas del servidor SOAP (`HTTP 500`) y timeouts de conexión.
*   **2 Estados de Certificado:** Certificados de firma expirados (`CERT_EXPIRED`) y advertencias de vencimiento temprano (`CERT_NEAR_EXPIRY`).

### 🔑 3. [Especificaciones de Certificado Digital (Test Cert)](/docs/sandbox/test-cert)
Tu cuenta del sandbox recibe automáticamente un certificado digital PKCS#12 (`.p12`) auto-generado de prueba, estructuralmente idéntico a una firma real ONAC. Además, documentamos el funcionamiento de nuestro **guardián de producción** (`CertificateFingerprintGuard`) que impide transacciones accidentales de desarrollo en el entorno real de la DIAN.

### 📮 4. [Colección Postman de Pruebas](/docs/sandbox/postman)
Publicamos de forma abierta nuestra colección oficial con **14 peticiones ya preconfiguradas**. Incluye scripts en javascript para la captura automática de tokens de sesión y guardado automático en variables de entorno de Postman.

---

## 📈 Historial de Cambios del Release

*   **`package.json`**: Bump formal a la versión estable `"3.0.7"`.
*   **`docusaurus.config.ts`**: Copyright global actualizado a `"v3.0.7"`.
*   **`docs/intro.md`**: Onboarding actualizado; eliminado el disclaimer de sandbox no disponible y enlazado directamente a las guías de integración de pruebas.
*   **`sidebars.ts`**: Registro ordenado del nuevo módulo `Sandbox` en el flujo de lectura.

---
sidebar_position: 4
title: Colección Postman
description: Colección de 43 requests listas para usar y probar la integración en el sandbox.
---

# Colección Postman — MATIAS API Sandbox

Para acelerar la integración técnica y las pruebas de comportamiento en el sandbox, hemos diseñado una **Colección Postman oficial con 43 solicitudes** ya pre-configuradas y organizadas para cubrir tanto el happy path como todos los escenarios de error simulables (Magic Values).

---

## Descarga e Importación

Puedes importar y ejecutar la colección directamente en tu Postman local o web:

### Opción 1: Descarga Directa (Recomendado)

1. Descarga el archivo JSON de la colección haciendo clic en el siguiente botón:
   
   [⬇️ Descargar Colección Postman (sandbox-quickstart.json)](/sandbox-quickstart.postman_collection.json)

2. Abre Postman, haz clic en **Import**, arrastra el archivo JSON descargado y confírmalo.

### Opción 2: Botón de Ejecución Rápida

Haz clic en el siguiente botón oficial para importar directamente un fork de la colección en tu workspace de Postman:

[![Run in Postman](https://run.pstmn.io/button.svg)](/sandbox-quickstart.postman_collection.json)

---

## Estructura de la Colección (43 Requests)

La colección se encuentra estructurada en **11 carpetas lógicas** para guiarte en el flujo secuencial de desarrollo y pruebas de todos los módulos:

### 📁 1. Producción (1 request)
*   `POST /register`: Endpoint oficial de producción para registrar tu cuenta por primera vez. Recuerda que esta cuenta se replica de forma inmediata al sandbox en tiempo real.

### 📁 2. Sandbox — Auth (2 requests)
*   Login y generación de tokens de acceso (PAT) para interactuar con el entorno sandbox.

### 📁 3. Sandbox — Facturación (14 requests)
*   Emisión de Factura Electrónica en flujo estándar (Happy Path).
*   **13 simulaciones de error (Magic Values)** exclusivas para facturas: rechazos de validación, errores matemáticos (`ERROR_MATH_ROUNDING`), totales brutos (`ERROR_GROSS_TOTAL`), firmas alteradas (`ERROR_SIGNATURE`), timeout de DIAN, entre otros.

### 📁 4. Sandbox — PDF & Status (3 requests)
*   Consulta asíncrona de estado, descarga de representación gráfica (PDF) autogenerada y revisión de metadata del certificado.

### 📁 5. Sandbox — Notas Crédito/Débito (2 requests)
*   Pruebas de errores específicos para Notas, como fechas desfasadas (`ERROR_NC_DATE_MISMATCH`).

### 📁 6. Sandbox — Documento Soporte (2 requests)
*   Validaciones específicas de Documento Soporte, como tributos no permitidos (`ERROR_DS_TAX_INVALID`).

### 📁 7. Sandbox — Nómina Electrónica (3 requests)
*   Simulación de rechazos en la nómina, tales como CUNE alterado (`ERROR_PAYROLL_CUNE_INVALID`) o errores de departamentos (`ERROR_PAYROLL_DEPT`).

### 📁 8. Sandbox — Auto-Increment (2 requests)
*   Pruebas de emisión utilizando los módulos de auto-incremento de series para Factura y Nota Crédito.

### 📁 9. Sandbox — POS Electrónico (5 requests)
*   Documento Equivalente POS y sus notas de ajuste (NC/ND) correspondientes.

### 📁 10. Sandbox — DS No Residente (2 requests)
*   Emisión de Documentos Soporte y notas de ajuste a proveedores del exterior (No residentes).

### 📁 11. Sandbox — Eventos RADIAN (7 requests)
*   Pruebas de envío y consulta de acuses (Recibo de factura, Reclamo, Aceptación) simulando respuestas oficiales de la DIAN.

---

## Variables de Entorno Recomendadas

Para ejecutar las peticiones de forma dinámica sin reescribir cabeceras, te sugerimos crear un **Environment** en Postman con las siguientes variables:

| Variable | Tipo | Valor Sugerido | Descripción |
|:---|:---|:---|:---|
| `url` | default | `{{URL}}` (ej. `api-v2.matias-api.com`) | Dominio base de producción (solo para el registro). |
| `sandbox_url` | default | `{{SANDBOX_URL}}` | Dominio exclusivo del ambiente sandbox (ej. `https://sandbox-api.matias-api.com`). |
| `access_token` | secret | `eyJ...` | El token JWT obtenido en el Login. |
| `pat_token` | secret | `eyJ...` | Tu Personal Access Token (PAT) JWT estándar de pruebas. |

:::tip Scripts de Postman
La colección incluye scripts automáticos en la pestaña **Tests** de la petición de Login y Generación de PAT. Estos scripts extraen los tokens del JSON de respuesta y los guardan automáticamente en tus variables de entorno para que no tengas que copiarlos y pegarlos manualmente en cada llamada.
:::

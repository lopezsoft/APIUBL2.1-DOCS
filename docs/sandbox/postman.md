---
sidebar_position: 4
title: Colección Postman
description: Colección de 14 requests listas para usar y probar la integración en el sandbox.
---

# Colección Postman — MATIAS API Sandbox

Para acelerar la integración técnica y las pruebas de comportamiento en el sandbox, hemos diseñado una **Colección Postman oficial con 14 solicitudes** ya pre-configuradas y organizadas para cubrir tanto el happy path como todos los escenarios de error simulables (Magic Values).

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

## Estructura de la Colección (14 Requests)

La colección se encuentra estructurada en **4 carpetas lógicas** para guiarte en el flujo secuencial de desarrollo:

### 📁 1. Producción (1 request)
*   `POST /register`: Endpoint oficial de producción para registrar tu cuenta por primera vez. Recuerda que esta cuenta se replica de forma inmediata al sandbox en tiempo real.

### 📁 2. Sandbox Auth (2 requests)
*   `POST /auth/login`: Realiza el inicio de sesión y devuelve tu token `access_token` JWT.
*   `POST /api/ubl2.1/auth/token`: Genera tu **Personal Access Token (PAT)** (`sk_test_*`) para autenticar el envío de documentos.

### 📁 3. Sandbox Facturación (8 requests)
Peticiones completas para transmitir facturas electrónicas combinando escenarios de validación:
*   `POST /invoice (Happy Path)`: Transmisión estándar del documento sin cabecera de simulación. Devuelve `ACCEPTED`.
*   `POST /invoice (Error Rejected)`: Simula el error `B7B01` (documento rechazado por negocio).
*   `POST /invoice (Error Duplicate)`: Simula el error `89` (número de documento ya registrado).
*   `POST /invoice (Error Auth)`: Simula el error `IFE043` (fallo de autenticación o firma digital).
*   `POST /invoice (Error Schema)`: Simula el error `FAD06` (fallo estructural XSD).
*   `POST /invoice (Error 500)`: Simula una caída del servidor SOAP de la DIAN.
*   `POST /invoice (Error Timeout)`: Simula la pérdida de conexión o timeout con la DIAN.
*   `POST /invoice (Cert Expirado)`: Simula un intento de firma con un certificado ya vencido.

### 📁 4. Sandbox PDF & Status (3 requests)
*   `GET /documents/pdf/{trackId}`: Solicita y descarga la representación gráfica (PDF) autogenerada.
*   `GET /documents/status/{trackId}`: Consulta el estado de procesamiento del documento en la plataforma.
*   `GET /certificate`: Obtiene la metadata técnica y la passphrase del certificado digital de prueba asignado.

---

## Variables de Entorno Recomendadas

Para ejecutar las peticiones de forma dinámica sin reescribir cabeceras, te sugerimos crear un **Environment** en Postman con las siguientes variables:

| Variable | Tipo | Valor Sugerido | Descripción |
|:---|:---|:---|:---|
| `url` | default | `https://api-v2.matias-api.com` | Dominio de producción (solo para el registro). |
| `sandbox_url` | default | `https://sandbox-api.matias-api.com` | Dominio exclusivo del ambiente sandbox. |
| `access_token` | secret | `eyJ...` | El token JWT obtenido en el Login. |
| `pat_token` | secret | `sk_test_...` | Tu Personal Access Token de pruebas (`sk_test_*`). |

:::tip Scripts de Postman
La colección incluye scripts automáticos en la pestaña **Tests** de la petición de Login y Generación de PAT. Estos scripts extraen los tokens del JSON de respuesta y los guardan automáticamente en tus variables de entorno para que no tengas que copiarlos y pegarlos manualmente en cada llamada.
:::

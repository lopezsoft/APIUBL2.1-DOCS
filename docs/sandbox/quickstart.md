---
sidebar_position: 1
title: Quickstart
description: Guía rápida para integrar con el sandbox de MATIAS API en 5 minutos.
---

# Quickstart — MATIAS API Sandbox

Guía rápida para integrar con el sandbox de MATIAS API en 5 minutos. El sandbox es un ambiente aislado donde puedes probar todos nuestros endpoints sin alterar tus datos reales de producción ni realizar reportes reales ante la DIAN.

---

## 1. Crear cuenta

Registra tu cuenta en **producción**. Las credenciales registradas se replicarán automáticamente al ambiente sandbox en tiempo real.

```bash
curl -X POST https://api-v2.matias-api.com/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Tu Nombre",
    "last_name": "Tu Apellido",
    "company_name": "Mi Empresa SAS",
    "email": "tu@email.com",
    "password": "tu-password-seguro",
    "password_confirmation": "tu-password-seguro",
    "dni": "900123456"
  }'
```

:::info Registro Centralizado
El registro se realiza únicamente a través del endpoint de producción (`https://api-v2.matias-api.com`). No necesitas crear una cuenta diferente para el sandbox; tus credenciales son globales.
:::

---

## 2. Login en sandbox

Realiza el inicio de sesión en el sandbox utilizando las **mismas credenciales** que registraste en producción:

```bash
curl -X POST https://sandbox-api.matias-api.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu@email.com",
    "password": "tu-password-seguro"
  }'
```

**Respuesta exitosa:**
```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer"
}
```

---

## 3. Generar un PAT (Personal Access Token)

Genera tu token de acceso de larga duración para realizar pruebas de integración de forma segura:

```bash
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auth/token \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi Token de Prueba"}'
```

:::tip Prefijo de Token
Los tokens del ambiente sandbox se generan automáticamente con el prefijo **`sk_test_*`**, lo que te permite identificarlos fácilmente de tus tokens de producción con prefijo **`sk_live_*`**.
:::

---

## 4. Enviar primera factura

Usa tu PAT para transmitir tu primer documento electrónico de prueba:

```bash
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @tu-factura.json
```

Si realizas la solicitud sin especificar cabeceras de simulación de estado, el sandbox validará y devolverá un estado de aceptación `ACCEPTED` (happy path) simulando la respuesta positiva de la DIAN.

---

## 5. Probar errores

El sandbox te permite forzar escenarios de error para verificar cómo se comporta tu sistema ante fallas de la DIAN. Para esto, utiliza la cabecera HTTP `X-Sandbox-Force-Status`:

```bash
# Simular documento rechazado por validaciones de negocio
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer sk_test_..." \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -d @tu-factura.json

# Simular error por timeout de conexión con la DIAN
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer sk_test_..." \
  -H "X-Sandbox-Force-Status: ERROR_TIMEOUT" \
  -d @tu-factura.json
```

:::warning Aislamiento de Simulación
La cabecera `X-Sandbox-Force-Status` **solo es procesada en el sandbox** (`https://sandbox-api.matias-api.com`). En producción, esta cabecera es ignorada por completo por motivos de seguridad.
:::

Puedes consultar la lista completa de estados simulables en la guía de [Magic Values](./magic-values.md).

---

## 6. Verificar entorno

Para garantizar que tus solicitudes se están ejecutando en el entorno correcto, todas las respuestas del sandbox inyectan la siguiente cabecera HTTP de diagnóstico:

```http
X-MATIAS-Environment: sandbox
```

---

## Diferencias: Producción vs Sandbox

| Aspecto | Producción | Sandbox |
|:---|:---|:---|
| **Dominio API** | `https://api-v2.matias-api.com` | `https://sandbox-api.matias-api.com` |
| **Envío a la DIAN** | Transmisión real SOAP a servidores DIAN | Respuestas simuladas/mockeadas |
| **Firma de Documentos** | Certificado digital emitido por CA real (ONAC) | Certificado digital de prueba (Test Cert) auto-asignado |
| **Persistencia de Datos** | Persistentes en base de datos real | Aislados de producción (persistencia mockeada) |
| **Prefijo de Token (PAT)** | `sk_live_*` | `sk_test_*` |
| **Endpoints del API** | Todos | **Idénticos a producción** |

---

## Próximos Pasos

*   [Magic Values](./magic-values.md) — Lista completa de cabeceras de simulación de errores de la DIAN.
*   [Test Certificate](./test-cert.md) — Especificaciones del certificado digital de prueba autogenerado.
*   [Colección Postman](./postman.md) — Importa la colección de 14 peticiones de prueba listas para usar.

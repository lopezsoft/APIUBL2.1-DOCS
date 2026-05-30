# Briefing para Frontend — Sección Sandbox en Docusaurus Existente

| Campo | Valor |
|---|---|
| **Fecha** | 2026-05-30 |
| **Tarea Roadmap** | S2.3 |
| **Sitio destino** | `docs.matias-api.com` (Docusaurus v3.10.1 existente) |
| **Prioridad** | Alta — bloquea M2 (GA técnico) |
| **Backend Status** | ✅ Completo — todos los endpoints operativos |

---

## 1. Decisión Arquitectónica

**NO crear un sitio nuevo.** La documentación del sandbox debe integrarse como una **nueva categoría en el sidebar** del Docusaurus existente en `docs.matias-api.com`.

### Justificación
- Ya existe infraestructura Docusaurus v3.10.1 con branding, SEO, dark mode, code blocks
- Los integradores ya conocen `docs.matias-api.com` — no fragmentar la experiencia
- El sandbox usa los **mismos endpoints** que producción — la documentación debe estar al lado
- Mantener un solo sitio reduce costos de mantenimiento y DevOps

### Estructura actual del sidebar (observada)

```
📄 Introducción          ← docs/intro.md
📁 Endpoints             ← docs/endpoints/
📄 Campos del Request    ← docs/billing-fields.md
📄 Respuestas API        ← docs/response-json.md
📁 Ejemplos JSON         ← docs/jsons-billing/
📁 Casos de Uso          ← docs/use-cases/
📄 Glosario              ← docs/glossary.md
📄 Herramientas          ← docs/interactive-tools.md
📁 Marco Regulatorio     ← docs/regulatory-framework/
```

### Estructura propuesta (agregar categoría "Sandbox")

```
📄 Introducción
📁 Endpoints
📄 Campos del Request
📄 Respuestas API
📁 Ejemplos JSON
📁 Casos de Uso
📁 Sandbox                  ← NUEVO
  📄 Quickstart             ← docs/sandbox/quickstart.md
  📄 Magic Values           ← docs/sandbox/magic-values.md
  📄 Test Certificate       ← docs/sandbox/test-cert.md
  📄 Colección Postman      ← docs/sandbox/postman.md
📄 Glosario
📄 Herramientas
📁 Marco Regulatorio
```

---

## 2. Archivos a Crear en el Proyecto Docusaurus

El contenido ya existe en Markdown en el backend (`backend/docs/sandbox/`). Solo hay que adaptarlo al formato Docusaurus (agregar frontmatter y ajustar rutas).

### 2.1 `docs/sandbox/quickstart.md`

**Fuente:** [`backend/docs/sandbox/QUICKSTART.md`](file:///d:/wamp64/www/apidian/backend/docs/sandbox/QUICKSTART.md)

Frontmatter necesario:
```yaml
---
sidebar_position: 1
title: Quickstart
description: Guía rápida para integrar con el sandbox de MATIAS API en 5 minutos.
---
```

Contenido: copiar tal cual del fuente, solo ajustar las URLs para usar `{{URL}}` como placeholder consistente con el resto de la documentación. Agregar admonitions de Docusaurus donde corresponda (`:::tip`, `:::warning`, `:::info`).

---

### 2.2 `docs/sandbox/magic-values.md`

**Fuente:** [`backend/docs/sandbox/MAGIC-VALUES.md`](file:///d:/wamp64/www/apidian/backend/docs/sandbox/MAGIC-VALUES.md)

Frontmatter:
```yaml
---
sidebar_position: 2
title: Magic Values
description: 8 valores de simulación para probar diferentes respuestas de la DIAN en el sandbox.
---
```

Contenido: la tabla de 8 magic values + ejemplos de request/response JSON. Usar `<details>` o `:::info` para los JSON expandibles.

---

### 2.3 `docs/sandbox/test-cert.md`

**Fuente:** [`backend/docs/sandbox/TEST-CERT.md`](file:///d:/wamp64/www/apidian/backend/docs/sandbox/TEST-CERT.md)

Frontmatter:
```yaml
---
sidebar_position: 3
title: Test Certificate
description: Certificado de prueba auto-generado para firmar documentos en el sandbox.
---
```

---

### 2.4 `docs/sandbox/postman.md` (NUEVO — no tiene fuente directa)

Frontmatter:
```yaml
---
sidebar_position: 4
title: Colección Postman
description: Colección de 14 requests para probar el sandbox con Postman.
---
```

Contenido sugerido:
- Botón "Run in Postman" (embed iframe de `getpostman.com/run`)
- Tabla con las 14 requests organizadas por carpeta
- Instrucciones para importar el JSON manualmente
- Link de descarga al archivo JSON (`tests/postman/sandbox-quickstart.postman_collection.json`)

---

### 2.5 `docs/sandbox/_category_.json` (metadata del sidebar)

```json
{
  "label": "Sandbox",
  "position": 6,
  "link": {
    "type": "generated-index",
    "description": "Ambiente de pruebas para integradores — mismos endpoints, respuestas simuladas de la DIAN."
  }
}
```

---

## 3. Datos Clave para el Contenido

### 3.1 Tabla Producción vs Sandbox (para Quickstart)

| Aspecto | Producción | Sandbox |
|---|---|---|
| Dominio | `api-v2.matias-api.com` | `sandbox-api.matias-api.com` |
| DIAN | Envío real SOAP | Respuestas simuladas |
| Certificado | Emitido por CA real (ONAC) | Test Cert auto-generado |
| Datos | Persistentes | Persistentes (modelo Stripe) |
| PAT prefijo | `sk_live_*` | `sk_test_*` |
| Endpoints | Todos | **Idénticos a producción** |
| Header respuesta | — | `X-MATIAS-Environment: sandbox` |

### 3.2 Magic Values (para tabla en magic-values.md)

**6 Errores DIAN:**

| Header `X-Sandbox-Force-Status` | HTTP | Código DIAN | Descripción |
|---|---|---|---|
| `ERROR_REJECTED` | 422 | B7B01 | Documento rechazado por validación de negocio |
| `ERROR_DUPLICATE` | 422 | 89 | Documento ya reportado previamente |
| `ERROR_AUTH` | 422 | IFE043 | Error de autenticación del certificado |
| `ERROR_SCHEMA` | 422 | FAD06 | Error de validación XSD |
| `ERROR_500` | 500 | — | Error interno del servicio DIAN |
| `ERROR_TIMEOUT` | 500 | — | Timeout de conexión con DIAN |

**2 Certificados:**

| Header | Descripción |
|---|---|
| `CERT_EXPIRED` | Fuerza un certificado expirado al firmar |
| `CERT_NEAR_EXPIRY` | Certificado con validez de +5 días |

> **Sin header** → devuelve `ACCEPTED` (happy path).

### 3.3 Test Certificate (specs)

| Atributo | Valor |
|---|---|
| Formato | PKCS#12 (`.p12`) |
| X.509 | v3 |
| Algoritmo | `sha256WithRSAEncryption` |
| Key Size | RSA 2048 bits |
| Issuer | `CN=MATIAS SANDBOX TEST CA, O=MATIAS API, OU=Sandbox, C=CO` |
| Subject | `CN={NIT}{DV}, O={razón_social}, OU=Persona Juridica, C=CO` |
| Validez | 1 año |

### 3.4 Postman Collection

- **Archivo JSON:** `tests/postman/sandbox-quickstart.postman_collection.json`
- **14 requests** en 4 carpetas:
  1. **Producción** (1): Register
  2. **Sandbox Auth** (2): Login, Generate PAT
  3. **Sandbox Facturación** (8): Invoice happy + 7 magic values
  4. **Sandbox PDF & Status** (3): Get PDF, Document Status, Certificate Info

---

## 4. Nota sobre la Intro existente

La página de Introducción actual (`docs/intro.md`) dice:

> ❌ Sandbox público o de prueba gratuito
> ❌ Acceso de demostración sin contrato

Cuando el sandbox se lance, **esta sección debe actualizarse** para reflejar la nueva realidad. Sugerencia:

```diff
- ❌ Sandbox público o de prueba gratuito
+ ✅ Sandbox de pruebas incluido — ver [documentación del sandbox](/docs/sandbox/quickstart)
```

---

## 5. Esfuerzo Estimado

| Tarea | Horas |
|---|---|
| Crear 4 archivos `.md` + `_category_.json` | 2 h |
| Adaptar formato Docusaurus (frontmatter, admonitions) | 2 h |
| Configurar botón "Run in Postman" | 1 h |
| Actualizar intro.md (quitar disclaimer sandbox) | 0.5 h |
| Review + QA visual | 1.5 h |
| **Total** | **7 h** |

---

## 6. Commit Sugerido

```
docs(sandbox): add sandbox section to Docusaurus (S2.3)

New pages: quickstart, magic-values, test-cert, postman
Update intro.md to reflect sandbox availability
```

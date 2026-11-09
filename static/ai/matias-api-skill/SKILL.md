---
name: matias-api-ubl21
description: Experto en integración con MATIAS API UBL 2.1 para Facturación Electrónica DIAN en Colombia (Factura Electrónica, POS, Notas Crédito/Débito, Sector Salud RIPS Res. 000948 de 2026, Nómina Electrónica, Documento Soporte, Eventos RADIAN, API Bulk y Webhooks). Úsalo siempre que el usuario escriba código, valide payloads JSON, configure autenticación PAT/OAuth2 o depure errores de facturación electrónica con MATIAS API.
---

# MATIAS API UBL 2.1 — Official Developer Skill

Este Skill dota a tu agente de IA del conocimiento técnico, reglas de negocio DIAN (UBL 2.1) y contratos oficiales de **MATIAS API**.

## Arquitectura y Entornos de MATIAS API (v3.10.0)

- **Sandbox (Pruebas gratuitas, sin envío real a la DIAN):**
  - Base URL API: `https://sandbox-api.matias-api.com/api/ubl2.1`
  - Portal Web Sandbox: `https://sandbox-auth.matias-api.com/`
- **Producción (Requiere contrato activo, certificado digital y resoluciones DIAN):**
  - Base URL API: entregada al contratar el servicio (representada como `{{url}}` o `{{URL}}`).
- **Regla Crítica de Cuentas Separadas:** Las credenciales de Producción **NO** funcionan en Sandbox y viceversa. Cada entorno requiere su propio registro y verificación de correo electrónico.

## Autenticación y Cabeceras Obligatorias

Todas las peticiones HTTP hacia endpoints protegidos deben enviar:

```http
Authorization: Bearer {access_token_o_pat}
Content-Type: application/json
Accept: application/json
```

- **Importante sobre `Accept: application/json`:** Si se omite esta cabecera, los errores de validación (HTTP 422) o no autenticado (HTTP 401) pueden responder con redirección HTML (HTTP 302) en lugar de JSON.
- **Importante sobre `POST /auth/login` y HTTP 404:** Después de `POST /register`, el usuario **debe abrir el enlace de verificación enviado a su correo**. Mientras el correo no esté verificado (o si las credenciales son incorrectas), `POST /auth/login` responde **HTTP 404** (`"El correo electrónico no ha sido verificado..."` o `"Credenciales inválidas."`), **no** HTTP 401.
- **Personal Access Tokens (PAT):** Recomendados para integraciones servidor a servidor. Se crean con `POST /tokens` (`name`, `expires_in_days` de 1 a 365 días, por defecto 90).

## Operación para Casas de Software (Multi-Tenant)

- **No usar `POST /register` para crear sub-clientes:** `POST /register` solo crea cuentas principales de desarrollador (enviar `company_id` allí devuelve HTTP 422).
- **Crear empresa cliente:** Usar `POST {{url}}/company/{uuid_desarrollador}/customer` autenticándose con el token de la Casa de Software.
- **Emitir o consultar en nombre de un cliente:** Agregar el query param `?client_uuid={uuid_cliente}` a los endpoints de emisión, consulta, resoluciones, certificados o consumo (ej. `POST {{url}}/invoice?client_uuid={uuid_cliente}`).

## Reglas Matemáticas y Validación UBL 2.1 (DIAN Colombia)

1. **NIT y Dígito de Verificación (Algoritmo Módulo 11):**
   - El campo `dni` de empresa y cliente lleva **solo dígitos**, sin puntos, guiones ni dígito de verificación.
   - Pesos de derecha a izquierda: `[3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71]`.
   - Residuo `r = suma % 11`. Si `r === 0` o `r === 1`, `dv = r`; de lo contrario `dv = 11 - r`.
2. **Cuadre de Totales (`legal_monetary_totals`):**
   - `line_extension_amount` (por línea) = `(invoiced_quantity * price_amount) - descuentos_linea + cargos_linea`.
   - `legal_monetary_totals.line_extension_amount` = suma de `line_extension_amount` de todas las líneas.
   - `legal_monetary_totals.tax_exclusive_amount` = base imponible total (suma de `taxable_amount` o `line_extension_amount` menos descuentos globales).
   - `legal_monetary_totals.tax_inclusive_amount` = `tax_exclusive_amount + suma(tax_totals[*].tax_amount)` (no incluye retenciones `with_holding_tax_total`).
   - `legal_monetary_totals.payable_amount` = `tax_inclusive_amount - AllowanceTotalAmount + ChargeTotalAmount - PrepaidAmount`.
3. **Exportaciones (`type_document_id: 8` o moneda extranjera):**
   - No deben incluir IVA (`tax_totals: []`) y requieren moneda distinta de COP (ej. `currency_id: 272` para USD) con su tasa de cambio si aplica.
4. **Sector Salud (Resolución 000948 de 2026 — RIPS):**
   - Usa el objeto `health` (`operation_type`, `provider_code`, `payment_modality`, `coverage`, `users`, etc.) dentro del payload de factura (`POST /invoice`) o nota crédito (`POST /notes/credit`).

## Concurrencia, Idempotencia y Errores DIAN (Regla de Oro)

> **REGLA DE ORO:** Ante un timeout, error 409, 500 o 503 durante la emisión, **NUNCA reemitas el documento cambiando el `document_number`** sin antes consultar su estado con `GET /documents/{uuid}` o `GET /status?prefix=...&number=...`.

- Envía siempre un `uuid` (UUID v4) único por documento en el body para activar la protección anti-duplicados.
- **`409 DOCUMENT_IN_TRANSMISSION`**: Otra petición está transmitiendo ese mismo consecutivo en paralelo. Espera unos segundos y consulta el estado.
- **`409 DOCUMENT_IN_VALIDATION`**: El envío anterior quedó en `StatusCode 98` en la DIAN. Consulta con `POST /status/document/{trackId}`.
- **`503 DIAN_STATUS_UNAVAILABLE`**: No se pudo confirmar el envío previo en la DIAN; la API no retransmitió para evitar duplicados. Reintenta luego con el mismo número.
- **`500 DOCUMENT_POSSIBLY_SENT`**: El fallo ocurrió después de transmitir a la DIAN. **No reemitas**; consulta `GET /documents/{uuid}`.
- **Avisos Regla 90 (`warnings[].code`):**
  - `ALREADY_AUTHORIZED_RECOVERED`: La DIAN ya había autorizado ese documento con el mismo contenido; se recupera y es 100% válido.
  - `ALREADY_AUTHORIZED_OTHER_CONTENT`: Ese consecutivo ya fue autorizado en la DIAN con otro contenido distinto.
- **Avisos Post-Aceptación (`PDF_NOT_GENERATED`, `EMAIL_NOT_SENT`, `ATTACHED_DOCUMENT_NOT_GENERATED`):**
  - El documento **YA FUE VALIDADO POR LA DIAN**. No lo reenvíes. Usa `POST /documents/pdf/{trackId}?regenerate=1` o `POST /documents/sendmail/{trackId}`.

## Endpoints Principales

| Operación | Método y Ruta |
|---|---|
| Registro cuenta desarrollador | `POST /register` |
| Login (obtener token) | `POST /auth/login` |
| Crear Personal Access Token (PAT) | `POST /tokens` |
| Emitir Factura Electrónica (FEV / Exportación / Contingencia / Salud) | `POST /invoice` |
| Emitir Documento Equivalente POS | `POST /pos` |
| Emitir Nota Crédito / Nota Débito | `POST /notes/credit` · `POST /notes/debit` |
| Emitir Documento Soporte / Nota de Ajuste DS | `POST /ds/document` · `POST /ds/adjustment-note` |
| Emitir Nómina Individual / Reemplazo / Eliminación | `POST /payroll` · `POST /payroll/replace` · `POST /payroll/destroy` |
| Envío Masivo Asíncrono (API Bulk) | `POST /documents/bulk` · `GET /documents/bulk/{batch_id}` |
| Eventos RADIAN (Acuse, Recibo, Aceptación, Rechazo) | `POST /events/{event_code}` · `POST /events/ resend` |
| Consultar estado de documento | `GET /documents/{uuid}` · `GET /status?prefix={p}&number={n}` · `POST /status/document/{trackId}` |
| Descargar/Regenerar PDF o XML | `POST /documents/pdf/{trackId}` · `POST /documents/xml/{trackId}` |
| Consultar saldo y consumo de membresía | `GET /memberships/summary` |

## Recursos de Contexto para Agentes de IA

- **Índice general (`llms.txt`):** https://docs.matias-api.com/llms.txt
- **Documentación completa (`llms-full.txt`):** https://docs.matias-api.com/llms-full.txt
- **Contrato OpenAPI 3.0 (`openapi.json`):** https://docs.matias-api.com/openapi.json
- **Paquetes modulares por dominio:**
  - **Inicio Rápido, Autenticación y Sandbox:** https://docs.matias-api.com/ai/packs/quickstart-auth-sandbox.md
  - **Facturación Electrónica, POS y Notas Crédito/Débito:** https://docs.matias-api.com/ai/packs/invoicing-pos-notes.md
  - **Sector Salud y RIPS (Resolución 000948 de 2026):** https://docs.matias-api.com/ai/packs/health-sector-rips.md
  - **Nómina Electrónica y Documento Soporte:** https://docs.matias-api.com/ai/packs/payroll-support-doc.md
  - **Eventos RADIAN, API Bulk y Webhooks:** https://docs.matias-api.com/ai/packs/radian-bulk-webhooks.md
  - **Solución de Errores, Concurrencia DIAN y Catálogos:** https://docs.matias-api.com/ai/packs/troubleshooting-errors.md


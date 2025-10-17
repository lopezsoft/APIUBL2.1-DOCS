---
sidebar_position: 3
---

# ��� Respuestas de la API

La API de facturación emite respuestas en formato JSON. Estas respuestas contienen información sobre el estado de la solicitud y los documentos generados por la DIAN.

## ��� Tabla de Contenidos

1. [Quick Reference](#quick-reference) - Vista rápida 1 página
2. [Flow de Respuestas](#flow-de-respuestas) - Cómo navegas las respuestas
3. [StatusCode Explicado](#statuscode-explicado) - Todos los valores HTTP
4. [Respuestas Exitosas](#respuestas-exitosas-) - 200, 201
5. [Errores del Cliente](#errores-del-cliente-) - 400, 401, 402, 403, 404, 422
6. [Errores del Servidor](#errores-del-servidor-) - 500, 503, 504, 507, 508
7. [Contingencias DIAN](#contingencias-dian) - Tipo 03 y 04
8. [Cross-Links](#cross-links) - Documentos relacionados

---

## ��� Quick Reference

**¿No tienes tiempo? Aquí está todo en una página:**

| HTTP | Significado | Causa Común | Acción Recomendada |
|------|-------------|------------|-------------------|
| ��� **200** | OK - Documento procesado | Solicitud válida, DIAN aceptó | ✅ Descarga resultados (PDF, XML, QR) |
| ��� **201** | Created - Recurso creado | Documento nuevo creado | ✅ Usa el `XmlDocumentKey` (CUFE) |
| ��� **400** | Bad Request | JSON malformado, campos faltantes | ❌ Verifica estructura, reintenta |
| ��� **401** | Unauthorized | Credenciales inválidas | ❌ Verifica token/API key |
| ��� **402** | Payment Required | Suscripción vencida | ❌ Realiza pago, contacta soporte |
| ��� **403** | Forbidden | Sin permisos para este recurso | ❌ Verifica permisos, contacta soporte |
| ��� **404** | Not Found | Recurso no existe | ❌ Verifica URL, ID de documento |
| ��� **422** | Unprocessable Entity | Validación DIAN fallida (reglas) | ❌ Lee `ErrorMessage`, corrige datos |
| �� **500** | Internal Server Error | Error DIAN no especificado | ⏳ Espera 5 min, reintenta (máx 5 veces) |
| ��� **503** | Service Unavailable | DIAN en mantenimiento | ⏳ Consulta estado, reintenta después |
| ��� **504** | Gateway Timeout | DIAN tardó >20 segundos | ⏳ Espera 2 min, reintenta |
| ��� **507** | Insufficient Storage | Servidor DIAN lleno | ⏳ Contacta soporte DIAN |
| ��� **508** | Loop Detected | Bucle en servidor DIAN | ❌ Verifica solicitud, contacta soporte |
| ��� **98** | En Proceso | DIAN procesando (cola) | ⏳ Espera, revisa estado luego |

---

## ��� Flow de Respuestas

```
┌─────────────────┐
│  TÚ (Cliente)   │
└────────┬────────┘
         │ Envías JSON con datos
         ▼
┌─────────────────────────────────────┐
│  API (LZT) Recibe & Valida         │
└────────┬────────────────────────────┘
         │
    ┌────┴─────────────┐
    │                  │
    ▼ (Validación OK)  ▼ (Error)
┌──────────────────┐  ┌────────────────┐
│ Envía a DIAN     │  │ Retorna Error  │
│ (HTTP 202)       │  │ (400,401,422)  │
└────────┬─────────┘  └────────────────┘
         │
    ┌────┴──────────────┐
    │                   │
    ▼ (DIAN OK)         ▼ (DIAN Error)
┌─────────────┐     ┌────────────────┐
│ ✅ 200: OK  │     │ ❌ 5xx, 422    │
│ Documento   │     │ Ver detalles   │
│ Autorizado  │     │ en ErrorMsg    │
└─────────────┘     └────────────────┘
```

---

## ��� StatusCode Explicado

**¿Qué es `StatusCode`?** Es el código que la **DIAN** retorna (no es HTTP). Los valores más comunes:

| StatusCode | Significado | Estado |
|-----------|------------|--------|
| `00` | Procesado Correctamente | ✅ Éxito |
| `98` | En Proceso | ��� Esperando (cola DIAN) |
| `500` | Error en servidor DIAN | ❌ Reintenta |
| Otros | Errores específicos DIAN | ❌ Contacta soporte |

**Nota:** Este es DIFERENTE del código HTTP (200, 400, 500, etc.)

---

## ✅ Respuestas Exitosas (200, 201)

Estas respuestas indican que tu solicitud fue procesada correctamente por la DIAN.

### 200 - OK: Documento Procesado Correctamente

**¿Cuándo la recibes?** Cuando el documento fue validado y autorizado por la DIAN.

**¿Qué contiene?** Todos los resultados: PDF, XML, QR, CUFE (documento key).

#### Ejemplo de Respuesta 200 - OK

```json title="response.json"
{
    "message": "El documento ha sido procesado por la DIAN.",
    "send_to_queue": 0,
    "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
    "response": {
        "IsValid": "true",
        "StatusCode": "00",
        "StatusDescription": "Procesado Correctamente.",
        "StatusMessage": "La Factura electrónica LZT2002, ha sido autorizada."
    },
    "AttachedDocument": {
        "path": "1/ad/ad09010914030002500000041.xml",
        "url": "https://api-v2.matias-api.com/attachments/1/ad/ad09010914030002500000041.xml"
    },
    "qr": {
        "path": "1/fv09010914030002500000095.png",
        "url": ""
    },
    "pdf": {
        "path": "1/fv09010914030002500000095.pdf",
        "url": "https://api-v2.matias-api.com/pdf/1/fv09010914030002500000095.pdf"
    },
    "success": true
}
```

#### Campos de Respuesta 200 - OK

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `message` | string | Mensaje genérico del API |
| `send_to_queue` | int | 0 = procesado inmediatamente, 1 = en cola (en desarrollo) |
| `XmlDocumentKey` | string | **CUFE/CUDE/CUNE** - Identificador único del documento |
| `success` | boolean | `true` = éxito |
| `response.IsValid` | string | `"true"` = documento válido |
| `response.StatusCode` | string | `"00"` = procesado correctamente |
| `response.StatusMessage` | string | Mensaje de la DIAN (ej: "Factura autorizada") |
| `AttachedDocument.url` | string | URL para descargar XML |
| `pdf.url` | string | URL del PDF (descárgalo de aquí) |
| `qr.path` | string | Ruta del código QR |

---

### 201 - Created: Documento Creado

**¿Cuándo la recibes?** Cuando creas un nuevo documento que será procesado.

---

### ⚠️ Documento Duplicado

**¿Cuándo?** Cuando intentas enviar un documento que ya fue procesado.

**Ejemplo:**
```json title="response.json"
{
    "success": false,
    "message": "El documento con numero LZT224, ya se encuentra validado"
}
```

---

## ��� Errores del Cliente (4xx)

Estas respuestas significan que **TÚ** cometiste un error.

### 400 - Bad Request: Solicitud Inválida

**Causas:** JSON malformado, campos faltantes, tipos incorrectos

**Qué Hacer:** Valida JSON, confirma campos requeridos

---

### 401 - Unauthorized: No Autorizado

**Causas:** API key inválida, token expirado

**Qué Hacer:** Verifica credenciales, regenera token

---

### 402 - Payment Required: Pago Requerido

**Causas:** Suscripción vencida

**Qué Hacer:** Realiza pago, contacta soporte

---

### 403 - Forbidden: Sin Permisos

**Causas:** No tienes permisos para este recurso

**Qué Hacer:** Verifica permisos, contacta soporte

---

### 404 - Not Found: No Encontrado

**Causas:** Recurso no existe

**Qué Hacer:** Verifica ID, URL

---

### 422 - Unprocessable Entity: Validación DIAN Falló

**Causas:** Documento no cumple reglas DIAN (NIT, fechas, estructura)

**Qué Hacer:** Lee `ErrorMessage`, corrige según reglas DIAN

**Ejemplo:**
```json title="response.json"
{
    "success": false,
    "response": {
        "ErrorMessage": {
            "string": [
                "Regla: RUT01, Notificación: NIT no válido",
                "Regla: FAJ73, Notificación: Estructura código no válida"
            ]
        },
        "IsValid": "false"
    }
}
```

---

## ��� Errores del Servidor (5xx)

Hay un problema en los servidores (DIAN).

### 500 - Internal Server Error

**Causas:** Error temporal en DIAN

**Qué Hacer:** Espera 5 min, reintenta (máx 5 veces)

---

### 503 - Service Unavailable

**Causas:** DIAN en mantenimiento

**Qué Hacer:** Consulta estado en https://www.dian.gov.co, intenta después

---

### 504 - Gateway Timeout

**Causas:** DIAN tardó >20 segundos

**Qué Hacer:** Espera 2 min, reintenta (máx 5 veces con 2 min entre intentos). Si fallan 5 intentos → **Contingencia Tipo 04**

---

### 507 - Insufficient Storage

**Causas:** Servidor DIAN sin espacio

**Qué Hacer:** Intenta después

---

### 508 - Loop Detected

**Causas:** Bucle en servidor

**Qué Hacer:** Verifica estructura, contacta soporte

---

## ��� Contingencias DIAN

### Estrategia de Reintentos (DIAN Resolución 165)

```
Intento 1 → ❌ Error 504 → Espera 2 min
Intento 2 → ❌ Error 504 → Espera 2 min
Intento 3 → ❌ Error 504 → Espera 2 min
Intento 4 → ❌ Error 504 → Espera 2 min
Intento 5 → ❌ Error 504 → ⚠️ CONTINGENCIA TIPO 04
```

### Contingencia Tipo 04: ¿Cuándo Usarla?

**Usa Tipo 04 cuando:**
1. ✅ Realizaste 5 intentos
2. ✅ Esperaste 2 minutos entre cada intento
3. ✅ Todos fallaron con error 504
4. ✅ DIAN sigue sin responder

**¿Cómo implementarla?**

1. **Cambia `InvoiceTypeCode`:**
   ```
   ❌ Antes: "01" (factura estándar)
   ✅ Ahora: "04" (contingencia)
   ```

2. **Mantén:** Mismo número, prefijo, datos

3. **Firma nuevamente** el documento

4. **Adjunta:** XML original sin respuesta DIAN

5. **Entrega** con comprobante de intentos

---

## ��� Estado 98: En Proceso

**Significado:** La DIAN está procesando tu documento (en cola)

**Qué Hacer:**
- Revisa estado cada 1-2 minutos
- Típicamente resuelve en <5 minutos

---

## ��� Cross-Links

- ��� [intro.md](./intro.md) - Comenzar con la API
- ��� [endpoints.md](./endpoints.md) - Ver todos los endpoints
- ��� [billing-fields.md](./billing-fields.md) - Estructura de datos
- ��� [glossary.md](./glossary.md) - Términos técnicos
- ��� [Caja de Herramientas DIAN](https://docs.dian.gov.co) - Validaciones DIAN

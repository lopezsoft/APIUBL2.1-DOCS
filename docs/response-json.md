---
sidebar_position: 3
sidebar_label: 📬 Respuestas API
---

# 📬 Respuestas de la API {#respuestas-api}

:::info 📖 Guía Completa de Respuestas JSON
Todas las respuestas que emite la API están estructuradas en formato JSON estandarizado, proporcionando información detallada sobre el estado de la solicitud, documentos generados y las validaciones emitidas por la DIAN.
:::

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: 'var(--ifm-color-success-contrast-background)', borderRadius: '8px', border: '1px solid var(--ifm-color-success)', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>✅</div>
    <strong>HTTP 200/201</strong><br/>
    <small>Procesamiento exitoso</small>
  </div>

  <div style={{padding: '1rem', backgroundColor: 'var(--ifm-color-warning-contrast-background)', borderRadius: '8px', border: '1px solid var(--ifm-color-warning)', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>⏳</div>
    <strong>StatusCode 98</strong><br/>
    <small>En proceso / Reintente</small>
  </div>

  <div style={{padding: '1rem', backgroundColor: 'var(--ifm-color-danger-contrast-background)', borderRadius: '8px', border: '1px solid var(--ifm-color-danger)', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>❌</div>
    <strong>HTTP 4xx/5xx</strong><br/>
    <small>Errores y Rechazos</small>
  </div>

  <div style={{padding: '1rem', backgroundColor: 'var(--ifm-color-info-contrast-background)', borderRadius: '8px', border: '1px solid var(--ifm-color-info)', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🔄</div>
    <strong>Contingencia</strong><br/>
    <small>Manejo de Timeouts</small>
  </div>
</div>

---

## 🚀 Quick Reference {#quick-reference}

| Código | Tipo | Descripción | Acción Recomendada |
|---|---|---|---|
| **200** | <span className="badge badge--success">200 OK</span> | Documento procesado y validado correctamente por la DIAN | Descargar y almacenar archivos generados |
| **201** | <span className="badge badge--success">201 Created</span> | Documento encolado para procesamiento | Esperar procesamiento asíncrono |
| **400** | <span className="badge badge--danger">400 Bad Request</span> | Petición incorrecta o JSON malformado | Validar sintaxis y estructura del JSON |
| **401** | <span className="badge badge--danger">401 Unauthorized</span> | Sin autorización (Falta token o expirado) | Renovar token de acceso en cabecera |
| **402** | <span className="badge badge--danger">402 Payment Required</span> | Saldo insuficiente de folios o cuenta inactiva | Ampliar paquete o renovar suscripción |
| **403** | <span className="badge badge--danger">403 Forbidden</span> | Acción prohibida (Permisos insuficientes) | Contactar soporte para verificar perfil |
| **404** | <span className="badge badge--danger">404 Not Found</span> | Recurso o endpoint no encontrado | Verificar identificador y endpoint |
| **422** | <span className="badge badge--danger">422 Unprocessable</span> | Validación DIAN fallida (Documento rechazado) | Analizar detalles en `response.ErrorMessage` |
| **500** | <span className="badge badge--danger">500 Server Error</span> | Error interno en los servidores de la DIAN | Seguir protocolo de reintentos |
| **503** | <span className="badge badge--danger">503 Unavailable</span> | Servicio temporalmente fuera de servicio (DIAN) | Esperar a restablecimiento de servicios |
| **504** | <span className="badge badge--warning">504 Timeout</span> | Tiempo de espera de respuesta agotado (>60s) | Aplicar protocolo de contingencia |
| **507** | <span className="badge badge--danger">507 Storage Error</span> | Almacenamiento temporal lleno | Contactar al equipo de soporte |
| **508** | <span className="badge badge--danger">508 Loop Detected</span> | Bucle detectado en el procesamiento de datos | Validar referencias en estructura XML |

---

## 🎯 Guía Rápida de Interpretación {#guia-interpretacion}

:::tip Flujo de Diagnóstico en 3 Pasos
1. **Paso 1: Código HTTP**
   - `HTTP 200/201` ➔ ✅ Éxito de transporte
   - `HTTP 400–422` ➔ ⚠️ Error en Cliente o Validación
   - `HTTP 500–508` ➔ ❌ Error en Servidor (DIAN)
2. **Paso 2: Propiedad `success`**
   - `success: true` ➔ ✅ Operación completada
   - `success: false` ➔ ❌ Fallo en validación o datos
3. **Paso 3: `StatusCode` DIAN**
   - `StatusCode: "00"` ➔ ✅ Autorizado por DIAN
   - `StatusCode: "98"` ➔ ⏳ En Procesamiento DIAN
   - `StatusCode: "02"` ➔ 🔄 Documento Duplicado
:::

---

## ✅ Estructura de la Respuesta Exitosa {#respuesta-exitosa}

:::tip HTTP 200/201 — Documento Procesado Exitosamente
Cuando la DIAN acepta y autoriza legalmente el documento, la API responde con un objeto que incluye la clave única (CUFE/CUDE/CUNE), el XML firmado, el PDF y el código QR de validación.
:::

### 📋 Campos Principales

| Campo | Tipo | Descripción |
|---|---|---|
| `message` | `string` | Resumen del resultado del procesamiento. |
| `success` | `boolean` | `true` si la operación se completó exitosamente. |
| `XmlDocumentKey` | `string` | CUFE (Factura) / CUDE (Notas) / CUNE (Nómina). |
| `response` | `object` | Objeto contenedor de la respuesta directa de la DIAN. |
| `AttachedDocument` | `object` | Enlaces y metadatos del XML firmado y el contenedor Zip. |
| `qr` | `object` | Rutas y base64 para el código QR de validación. |
| `pdf` | `object` | Enlaces de descarga y metadatos del archivo PDF generado. |

<details open>
<summary>📦 Ver JSON Completo de Respuesta Exitosa</summary>

```json title="response.json"
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
  "response": {
    "ErrorMessage": {
      "string": [
        "Regla: RUT01, Notificación: La validación del estado del RUT próximamente estará disponible."
      ]
    },
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura electrónica LZT2002, ha sido autorizada.",
    "XmlBase64Bytes": "",
    "XmlBytes": {
      "_attributes": {
        "nil": "true"
      }
    },
    "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
    "XmlFileName": "fv09010914030002500000095"
  },
  "XmlBase64Bytes": "",
  "AttachedDocument": {
    "pathZip": "1/ad/z09010914030002500000042.zip",
    "path": "1/ad/ad09010914030002500000041.xml",
    "url": "https://api-v2.matias-api.com/attachments/1/ad/ad09010914030002500000041.xml",
    "data": ""
  },
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=d45f...",
    "url": "https://api-v2.matias-api.com/qr/1/fv09010914030002500000095.png",
    "path": "1/fv09010914030002500000095.png",
    "data": ""
  },
  "pdf": {
    "path": "1/fv09010914030002500000095.pdf",
    "url": "https://api-v2.matias-api.com/pdf/1/fv09010914030002500000095.pdf",
    "data": ""
  },
  "success": true
}
```

</details>

<details>
<summary>🔍 Diccionario Detallado de Campos</summary>

#### Objeto `response` (Validación Directa DIAN)
| Campo | Tipo | Descripción |
|---|---|---|
| `ErrorMessage` | `object` | Advertencias DIAN que no impiden la aprobación. |
| `IsValid` | `string` | Indica si cumple los estándares oficiales (`"true"` o `"false"`). |
| `StatusCode` | `string` | Estado interno DIAN (`"00"`: Autorizado). |
| `StatusDescription` | `string` | Glosa oficial (ej. `"Procesado Correctamente."`). |
| `StatusMessage` | `string` | Detalle específico de la autorización. |
| `XmlDocumentKey` | `string` | CUFE / CUDE del documento. |
| `XmlFileName` | `string` | Nombre bajo el cual el XML firmado se registra en la DIAN. |

#### Objeto `AttachedDocument` (Archivos XML)
| Campo | Tipo | Descripción |
|---|---|---|
| `pathZip` | `string` | Ruta relativa del archivo .ZIP en el servidor. |
| `path` | `string` | Ruta relativa del XML firmado. |
| `url` | `string` | Enlace público para descarga directa del XML firmado. |

#### Objeto `pdf` (Representación Gráfica)
| Campo | Tipo | Descripción |
|---|---|---|
| `path` | `string` | Ruta de almacenamiento de la representación gráfica. |
| `url` | `string` | Enlace público de descarga del PDF generado. |

</details>

---

## 🔄 Documento Duplicado {#documento-duplicado}

:::warning StatusCode 02 — Documento Ya Procesado
Si intenta retransmitir un documento usando un prefijo y consecutivo que ya fue validado ante la DIAN, la API responderá con `HTTP 400`:
:::

```json title="response.json"
{
  "success": false,
  "message": "El documento (Factura electrónica) con numero LZT224, ya se encuentra validado"
}
```

---

## ⚠️ Errores de Validación DIAN (HTTP 422) {#errores-validacion-dian}

:::danger Rechazo de Validación DIAN
Cuando el documento contiene errores aritméticos, de catálogos o de reglas de validación DIAN:
:::

```json title="response.json"
{
  "message": "El documento ha sido rechazado por la DIAN.",
  "send_to_queue": 0,
  "response": {
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "Documento con errores en campos obligatorios.",
    "ErrorMessage": {
      "string": [
        "Regla: FAS01A, Notificación: Error en el cálculo de la base imponible del IVA."
      ]
    }
  }
}
```

---

## ⏳ Timeouts y Contingencia {#timeouts-contingencia}

:::info Protocolo de Contingencia por Timeout (>60s)
Si el portal DIAN no responde en 60 segundos (`HTTP 504 Gateway Timeout`):
1. **Validar estado:** Consulte con `GET /status?prefix=...&number=...` antes de retransmitir.
2. **Reintentos:** Aplique backoff de 2 minutos (máximo 5 intentos).
3. **Contingencia Tipo 04:** Si la caída persiste e informada oficialmente por la DIAN, emita con `operation_type_id: 3` (Factura de Contingencia) y transmita dentro de las 48 horas siguientes.
:::

---

## ⏳ StatusCode 98 — En Procesamiento {#statuscode-98}

:::tip Estado Transitorio de Validación
`StatusCode 98` indica que la DIAN recibió el documento y lo tiene en cola. **No es un error**.
1. Espere 3 a 5 minutos.
2. Consulte el estado con `POST /status/document/{trackId}`.
3. No retransmita con un nuevo número para evitar cobros dobles o duplicados.
:::

```json title="response.json"
{
  "message": "Solicitud procesada por la DIAN.",
  "response": {
    "IsValid": "false",
    "StatusCode": "98",
    "StatusDescription": "En Proceso",
    "XmlDocumentKey": null
  }
}
```

---

## ❓ Preguntas Frecuentes (FAQ) {#faq}

**¿Qué diferencia hay entre `success` e `IsValid`?**  
`success: true` indica que la API procesó la solicitud HTTP correctamente. `IsValid: "true"` es la confirmación oficial de que la DIAN autorizó fiscalmente el documento.

**Recibí un error 504 Gateway Timeout, ¿el documento se emitió?**  
Es probable que sí. Cuando ocurre un Timeout, el XML pudo llegar a la DIAN y procesarse. **Nunca retransmita** sin antes consultar el estado de dicho consecutivo con `GET /status`.

**¿Qué significa `nil="true"` en algunos nodos XML?**  
Es un estándar de serialización SOAP/XML que indica que el campo está vacío (equivalente a `null`).

---

<div style={{backgroundColor: 'var(--ifm-card-background-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-300)', textAlign: 'center', marginTop: '2rem'}}>
  <small>
    📅 <strong>Versión:</strong> 3.7.0 (Agosto 2026) • 
    📨 <strong>Respuestas Documentadas:</strong> 13 escenarios estándar • 
    🎯 <strong>Nivel:</strong> ⭐⭐⭐ Referencia Técnica de Integración
  </small>
</div>
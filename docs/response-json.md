---
sidebar_position: 3
sidebar_label: 📬 Respuestas API
description: "Formato de las respuestas y errores de la API: emisión exitosa, rechazo de la DIAN, advertencias (warnings), códigos HTTP y formato de los errores."
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
    <small>Timeouts y posible envío</small>
  </div>
</div>

---

## 🚀 Quick Reference {#quick-reference}

| Código | Tipo | Descripción | Acción Recomendada |
|---|---|---|---|
| **200** | <span className="badge badge--success">200 OK</span> | Solicitud procesada. En la emisión, la DIAN pudo **aceptar o rechazar** el documento: revisa `response.IsValid` | `IsValid: "true"` → almacenar archivos. `IsValid: "false"` → corregir según `response.ErrorMessage` |
| **201** | <span className="badge badge--success">201 Created</span> | Recurso creado o lote aceptado (p. ej. `POST /bulk/documents`, creación de tokens o webhooks). La emisión unitaria **no** responde 201 | Guardar el identificador devuelto (p. ej. `batch_id`) |
| **202** | <span className="badge badge--success">202 Accepted</span> | Solicitud aceptada para procesarse en segundo plano (p. ej. `POST /events/mailbox/{id}/retry`) | Consultar el estado más tarde |
| **400** | <span className="badge badge--danger">400 Bad Request</span> | Regla de negocio incumplida (documento ya validado, en cola, `send_to_queue=1`, etc.) | Leer `message` y corregir la petición |
| **401** | <span className="badge badge--danger">401 Unauthorized</span> | Sin autorización (falta el token o expiró) | Renovar el token de acceso en la cabecera |
| **402** | <span className="badge badge--danger">402 Payment Required</span> | Saldo insuficiente de folios o cuenta inactiva | Ampliar paquete o renovar suscripción |
| **403** | <span className="badge badge--danger">403 Forbidden</span> | Sin `error_code`: acción no autorizada (p. ej. un `client_uuid` que no es de tu cuenta). Con `error_code: "RECEPTION_NOT_IN_PLAN"`: el plan no incluye la recepción de facturas ni los eventos RADIAN | Sin `error_code`: verificar permisos y `client_uuid`. Con `RECEPTION_NOT_IN_PLAN`: actualizar o renovar el plan (solo planes de pago vigentes) |
| **404** | <span className="badge badge--danger">404 Not Found</span> | Recurso o endpoint no encontrado | Verificar identificador y endpoint |
| **409** | <span className="badge badge--warning">409 Conflict</span> | La operación choca con otra en curso o con el estado del recurso (ver [409](#errores-409)) | Leer `code` / `error_code`; consultar el estado antes de reintentar |
| **422** | <span className="badge badge--danger">422 Unprocessable</span> | Validación del JSON enviado (campos faltantes o con formato inválido). **No** es un rechazo de la DIAN | Revisar el objeto `errors` |
| **429** | <span className="badge badge--warning">429 Too Many Requests</span> | Límite de peticiones superado. Todas las rutas del API (incluido el registro público `POST /register`) tienen un límite general, por defecto de **90 solicitudes por minuto**, contadas por usuario autenticado o, sin token, por IP. Algunas rutas tienen además límites propios más estrictos (creación de tokens, envíos masivos), que pueden responder con su propio mensaje. El límite general responde solo `{"message": "Too Many Attempts."}`, sin `success` | Esperar los segundos del header `Retry-After` y reintentar con backoff |
| **500** | <span className="badge badge--danger">500 Server Error</span> | Error interno. Normalmente trae `reference`. En emisión puede traer `code: "DOCUMENT_POSSIBLY_SENT"` | Con `DOCUMENT_POSSIBLY_SENT`: **no retransmitir**, consultar el estado. Si no, reportar a soporte con `reference` |
| **503** | <span className="badge badge--danger">503 Unavailable</span> | `code: "DIAN_STATUS_UNAVAILABLE"`: no se pudo confirmar en la DIAN el envío anterior de ese número y **no se transmitió** | Reintentar en unos minutos |
| **504** | <span className="badge badge--warning">504 Timeout</span> | Tu cliente o una puerta de enlace cortó la conexión antes de recibir la respuesta | **No retransmitir**: consultar el estado con `GET /status` |

:::note La emisión unitaria no responde 201
La emisión es síncrona: responde **HTTP 200** con el resultado de la DIAN. El envío a cola (`send_to_queue: 1`) aún no está habilitado y responde **HTTP 400** `El envío a cola de procesamiento aún no está habilitado.`
:::

---

## 🎯 Guía Rápida de Interpretación {#guia-interpretacion}

:::tip Flujo de Diagnóstico en 4 Pasos
1. **Paso 1: Código HTTP**
   - `HTTP 200/201` ➔ ✅ La API procesó la solicitud (en la emisión, la DIAN pudo aceptar **o rechazar** el documento)
   - `HTTP 400–429` ➔ ⚠️ Error en la petición, en los datos o conflicto con otra operación
   - `HTTP 5xx` ➔ ❌ Error del servidor o de la comunicación con la DIAN (revisa `code` y `reference`)
2. **Paso 2: Propiedad `success`**
   - `success: true` ➔ ✅ Operación completada
   - `success: false` ➔ ❌ Fallo en validación, datos o procesamiento
3. **Paso 3: `response.IsValid` y `StatusCode` DIAN**
   - `IsValid: "true"` y `StatusCode: "00"` ➔ ✅ Autorizado por la DIAN
   - `IsValid: "false"` ➔ ❌ Rechazado por la DIAN (detalle en `response.ErrorMessage`)
   - `StatusCode: "98"` ➔ ⏳ En procesamiento en la DIAN
4. **Paso 4: `warnings`**
   - Arreglo vacío ➔ sin avisos
   - Con elementos ➔ el documento quedó procesado, pero algo posterior falló o se concilió (ver [Avisos](#warnings))
:::

---

## 🧱 Formato de los Errores {#formato-errores}

:::tip Envía siempre `Accept: application/json`
Sin esa cabecera, un error de validación (422) responde con una redirección (302) y un token inválido o ausente redirige (302) a la página de inicio de sesión en lugar de responder 401.
:::

Según el origen del error, el cuerpo tiene una de estas formas:

| Origen | HTTP | Cuerpo |
|---|---|---|
| Validación del JSON enviado | 422 | `message` y `errors` (un objeto con un arreglo de mensajes por cada campo). No incluye `success`. Algunas consultas (p. ej. `GET /documents/consume`) responden además `success: false`, con `message` `Error de validación de datos.` |
| Reglas de negocio | 400, 403, 404, 409... | `success: false` y `message`. Los 403 de autorización empiezan con `Acceso no autorizado.` |
| Dato que viola una restricción de la base de datos | 400 | `success: false` y `message` con el detalle devuelto por la base de datos. |
| Error del servidor | 500 o superior | `success: false`, `message` y `reference`. Los errores internos empiezan con `Error interno del servidor.` |
| Autenticación, límite general de peticiones y errores no controlados | 401, 429, 500 | Solo `message` (`Unauthenticated.`, `Too Many Attempts.`, `Server Error`). |

<details>
<summary>📦 Ejemplos</summary>

**Validación (HTTP 422):**

```json
{
  "message": "El campo customer.dni es obligatorio.",
  "errors": {
    "customer.dni": ["El campo customer.dni es obligatorio."]
  }
}
```

**Regla de negocio (HTTP 404):**

```json
{
  "success": false,
  "message": "No se encontró el documento."
}
```

**Error del servidor (HTTP 500):**

```json
{
  "success": false,
  "message": "Error interno del servidor. ...",
  "reference": "3b0c6f5e-8d2a-4c7e-9f1b-2a6d5e4c3b21"
}
```

</details>

:::info Campo `reference` en errores 5xx
Las respuestas 5xx causadas por un error interno de la emisión y de las consultas traen `reference`: el identificador con el que soporte ubica el error. El 503 `DIAN_STATUS_UNAVAILABLE` no lo trae, porque no es un error interno. **Inclúyelo siempre al reportar un incidente.** Estas respuestas ya no incluyen `file` ni `line`.

Un 500 no implica que el error sea de la DIAN. En la emisión, si el error ocurrió **después** de transmitir el documento, la respuesta trae `code: "DOCUMENT_POSSIBLY_SENT"` y no debe reintentarse a ciegas (ver [Timeouts y posible envío](#timeouts-contingencia)).
:::

---

## ✅ Estructura de la Respuesta Exitosa {#respuesta-exitosa}

:::tip HTTP 200 — Documento Procesado Exitosamente
Cuando la DIAN acepta y autoriza legalmente el documento, la API responde con un objeto que incluye la clave única (CUFE/CUDE/CUNE), el XML firmado, el PDF, el código QR de validación y los avisos (`warnings`) del procesamiento.
:::

### 📋 Campos Principales

| Campo | Tipo | Descripción |
|---|---|---|
| `uuid` | `string` | Identificador del envío en el API. Úsalo con `GET /documents/{uuid}`. |
| `message` | `string` | Resumen del resultado del procesamiento. |
| `send_to_queue` | `integer` | Siempre `0` (el envío a cola aún no está habilitado). |
| `XmlDocumentKey` | `string` | CUFE (Factura) / CUDE (Notas) / CUNE (Nómina). |
| `response` | `object` | Respuesta directa de la DIAN. |
| `XmlBase64Bytes` | `string` | XML del documento en base64. |
| `AttachedDocument` | `object` | Enlaces y metadatos del XML firmado y el contenedor Zip. |
| `qr` | `object` | Rutas y base64 para el código QR de validación. |
| `pdf` | `object` | Enlaces de descarga y metadatos del archivo PDF generado. |
| `warnings` | `array` | 🆕 Avisos del procesamiento. **Siempre está presente**: arreglo vacío si no hay avisos. Ver [Avisos](#warnings). |
| `success` | `boolean` | `true` si la operación se completó. |

:::note Ambiente de habilitación DIAN
Si el software está en el ambiente de **pruebas (habilitación)** de la DIAN, la emisión responde un objeto reducido: `XmlDocumentKey`, `ZipKey`, `response`, `XmlDocumentName`, `ShippingMethod`, `XmlBase64Bytes` y `success` (sin `uuid`, `pdf` ni `warnings`).
:::

<details open>
<summary>📦 Ver JSON Completo de Respuesta Exitosa</summary>

```json title="response.json"
{
  "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
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
    "pathZip": null,
    "path": "1/ad/ad09010914030002500000041.xml",
    "url": "https://sandbox-api.matias-api.com/attachments/1/ad/ad09010914030002500000041.xml",
    "data": ""
  },
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=d45f...",
    "url": "https://sandbox-api.matias-api.com/qr/1/fv09010914030002500000095.png",
    "path": "1/fv09010914030002500000095.png",
    "data": ""
  },
  "pdf": {
    "path": "1/fv09010914030002500000095.pdf",
    "url": "https://sandbox-api.matias-api.com/pdf/1/fv09010914030002500000095.pdf",
    "data": ""
  },
  "warnings": [],
  "success": true
}
```

</details>

<details>
<summary>🔍 Diccionario Detallado de Campos</summary>

#### Objeto `response` (Validación Directa DIAN)
| Campo | Tipo | Descripción |
|---|---|---|
| `ErrorMessage` | `object` | Notificaciones DIAN (si el documento es válido) o motivos del rechazo. |
| `IsValid` | `string` | Indica si cumple los estándares oficiales (`"true"` o `"false"`). |
| `StatusCode` | `string` | Estado interno DIAN (`"00"`: Autorizado). |
| `StatusDescription` | `string` | Glosa oficial (ej. `"Procesado Correctamente."`). |
| `StatusMessage` | `string` | Detalle específico de la autorización. |
| `XmlDocumentKey` | `string` | CUFE / CUDE del documento. |
| `XmlFileName` | `string` | Nombre bajo el cual el XML firmado se registra en la DIAN. |

#### Objeto `AttachedDocument` (Archivos XML)
| Campo | Tipo | Descripción |
|---|---|---|
| `pathZip` | `null` | **Obsoleto:** siempre `null`. El ZIP ya no se guarda en el servidor; se arma al enviar el correo. |
| `path` | `string` | Ruta relativa del XML firmado. |
| `url` | `string` | Enlace público para descarga directa del XML firmado. |

#### Objeto `pdf` (Representación Gráfica)
| Campo | Tipo | Descripción |
|---|---|---|
| `path` | `string` | Ruta de almacenamiento de la representación gráfica. |
| `url` | `string` | Enlace público de descarga del PDF generado. |

</details>

---

## 🔔 Avisos de la Respuesta (`warnings`) {#warnings}

`warnings` es un arreglo de objetos `code` + `message`. Un aviso **no convierte en error** un documento que la DIAN ya validó: si algo falla después de la aceptación, la emisión sigue siendo exitosa y se informa aquí.

| `code` | Cuándo aparece | ¿Reenviar? |
|---|---|---|
| `PDF_NOT_GENERATED` | El documento fue validado, pero no se pudo generar la representación gráfica. | ❌ No. Genera el PDF con `POST /documents/pdf/{trackId}?regenerate=1`. |
| `EMAIL_NOT_SENT` | El documento fue validado, pero no se pudo enviar el correo (`send_email: 1`). | ❌ No. Reenvía el correo con `POST /documents/sendmail/{trackId}`. |
| `ATTACHED_DOCUMENT_NOT_GENERATED` | El documento fue validado, pero no se pudo generar el AttachedDocument (ni enviar el correo, si se pidió). | ❌ No. |
| `ATTACHMENTS_NOT_LINKED` | El documento fue procesado, pero no se pudieron vincular sus adjuntos. | ❌ No, si el documento es válido. |
| `ALREADY_AUTHORIZED_RECOVERED` | La DIAN ya había autorizado ese número con el mismo contenido: se devuelve el documento autorizado y no se generó uno nuevo. | ❌ No: el documento es válido. |
| `ALREADY_AUTHORIZED_OTHER_CONTENT` | La DIAN ya autorizó ese número con **otro contenido**. El documento enviado no se marcó como válido. | ❌ No con ese número: consulta el documento autorizado. |
| `ALREADY_PROCESSED_NOT_CONFIRMED` | La DIAN indicó que el documento fue procesado anteriormente, pero no confirmó su autorización. | ⏳ Consulta su estado antes de reenviarlo. |

Los tres avisos `ALREADY_*` solo aparecen en producción (ver [Documento duplicado y regla 90](#documento-duplicado)).

<details>
<summary>📦 Ejemplo: correo no enviado (<code>EMAIL_NOT_SENT</code>)</summary>

```json
{
  "warnings": [
    {
      "code": "EMAIL_NOT_SENT",
      "message": "El documento fue validado por la DIAN, pero no se pudo enviar el correo. Motivo: No se pudo enviar el email a ningún destinatario. Errores: El envío fue bloqueado automáticamente porque la(s) siguiente(s) dirección(es) no puede(n) recibir correo. Verifique que estén bien escritas: compras@dominio-inexistente.com (el dominio dominio-inexistente.com no existe o no recibe correo) No reenvíe el documento: ya es válido ante la DIAN."
    }
  ]
}
```

</details>

**Sobre `EMAIL_NOT_SENT`:**

- El texto `Motivo:` solo se incluye cuando la causa es de negocio, por ejemplo: ningún destinatario pudo recibir el correo (formato o dominio inválido, envío reciente o límite de envíos), ya hay un envío de correo en curso para ese documento o se excedió el límite de destinatarios. Los errores técnicos no se detallan.
- Si **solo algunos** destinatarios fallan, el correo se envía a los demás y **no** se agrega el aviso.

---

## 🔄 Documento Duplicado y Regla 90 {#documento-duplicado}

:::warning Documento ya validado — HTTP 400
Si intentas emitir de nuevo un prefijo y consecutivo que ya fue validado ante la DIAN, la API responde **HTTP 400** con el registro del envío existente en `data`:
:::

```json title="response.json"
{
  "message": "El documento (Factura electrónica) con numero LZT224 ya se encuentra validado.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT224",
    "XmlDocumentKey": "cf9864294501e8a9578235dd2ab3c4fd...",
    "is_valid": 1
  },
  "success": false
}
```

Si ese número está en cola de procesamiento, la respuesta es también **HTTP 400**: `El documento (Factura electrónica) con numero LZT224 se encuentra en cola de procesamiento.`, con `data`.

**Regla 90 ("Documento procesado anteriormente")** — en producción, si la DIAN responde que el documento ya fue procesado, la API lo concilia con la DIAN:

- Si la DIAN autorizó ese número con el mismo contenido, devuelve el documento autorizado con el aviso `ALREADY_AUTHORIZED_RECOVERED`.
- Si no, devuelve el rechazo con el aviso `ALREADY_AUTHORIZED_OTHER_CONTENT` o `ALREADY_PROCESSED_NOT_CONFIRMED`.
- Si en ese momento no se pudo consultar la DIAN, el rechazo llega tal cual, sin aviso: consulta el estado antes de reenviar.
- Nunca guarda el intento rechazado encima de un documento ya validado.

---

## ⚠️ Rechazo de la DIAN (HTTP 200) {#errores-validacion-dian}

:::danger Rechazo de Validación DIAN
Cuando el documento contiene errores aritméticos, de catálogos o de reglas de validación DIAN, la API responde **HTTP 200** con `success: true` y `response.IsValid: "false"`. El código HTTP 422 se reserva para la validación del JSON enviado, antes de llegar a la DIAN.
:::

```json title="response.json"
{
  "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
  "response": {
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "Documento con errores en campos obligatorios.",
    "ErrorMessage": {
      "string": [
        "Regla: FAS01A, Notificación: Error en el cálculo de la base imponible del IVA."
      ]
    }
  },
  "XmlBase64Bytes": "",
  "AttachedDocument": null,
  "qr": null,
  "pdf": null,
  "warnings": [],
  "success": true
}
```

---

## 🚦 Conflictos (HTTP 409) {#errores-409}

| `code` / `error_code` | Endpoint | Significado y acción |
|---|---|---|
| `DOCUMENT_IN_TRANSMISSION` | Emisión, `POST /status/document/{trackId}`, `DELETE /documents/{id}` | Ese número se está transmitiendo a la DIAN en otra solicitud. No envíes en paralelo: espera y consulta el estado. |
| `DOCUMENT_IN_VALIDATION` | Emisión (producción) | La DIAN aún valida (`StatusCode 98`) el envío anterior de ese número. `data.document_key` trae su CUFE/CUDE. No se transmitió: consulta el estado en unos minutos. |
| — | Emisión | `El uuid proporcionado ya se usó en otro documento de la empresa. No se emitió de nuevo: consulte ese documento o envíe un uuid nuevo.` |
| — | Envío de eventos RADIAN | `El evento ya se está enviando.` |
| — | Importación de recepción por CUFE/CUDE | `El cufe/cude ya está en proceso de importación.`, el CUFE/CUDE ya fue importado y omitido, o el documento fue eliminado de la recepción (impórtalo de nuevo por su CUFE). |
| `MAILBOX_RETRY_UNAVAILABLE`, `MAILBOX_RETRY_NO_LOCATION`, `MAILBOX_RETRY_EXPIRED`, `MAILBOX_RETRY_IN_PROGRESS`, `MAILBOX_ALREADY_PROCESSED` | `POST /events/mailbox/{id}/retry` | El correo del buzón no se puede reintentar (ver `message`). |
| — | Personas de recepción | No se puede eliminar la persona por defecto mientras haya otras, ni cambiar el modo de envío sin personas registradas. |

<details>
<summary>📦 Ejemplos de 409 en la emisión</summary>

```json
{
  "code": "DOCUMENT_IN_TRANSMISSION",
  "message": "El documento LZT836 ya se está transmitiendo a la DIAN en otra solicitud; consulte su estado antes de enviarlo de nuevo.",
  "data": {
    "document_number": "LZT836"
  },
  "success": false
}
```

```json
{
  "code": "DOCUMENT_IN_VALIDATION",
  "message": "La DIAN aún está validando el documento LZT836 (CUFE/CUDE cf9864294501e8a9...). No se transmitió de nuevo: consulte su estado en unos minutos antes de reenviarlo.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836",
    "document_key": "cf9864294501e8a9..."
  },
  "success": false
}
```

</details>

---

## ⏳ Timeouts y Posible Envío {#timeouts-contingencia}

:::info `DOCUMENT_POSSIBLY_SENT` — No retransmitir a ciegas
Si la comunicación con la DIAN falla **después** de transmitir el documento (timeout, respuesta inesperada o fallo al guardar), la API no puede saber si la DIAN lo recibió. Responde normalmente con **HTTP 500**, `code: "DOCUMENT_POSSIBLY_SENT"`, `data.uuid`, `data.document_number` y `reference`. El consecutivo se conserva.

1. **No emitas de nuevo** el documento con otro número.
2. **Consulta el estado** con `GET /documents/{uuid}` (usando `data.uuid`) o con `GET /status?prefix=...&number=...`.
3. **Contingencia Tipo 04:** si la caída persiste y es informada oficialmente por la DIAN, emite con `operation_type_id: 3` (Factura de Contingencia) y transmite dentro de las 48 horas siguientes.
:::

```json title="response.json"
{
  "success": false,
  "message": "No se obtuvo una respuesta definitiva para el documento LZT836 y es posible que la DIAN lo haya recibido. No lo emita de nuevo: consulte su estado con el uuid del envío antes de cualquier reintento. Detalle: Error interno del servidor. ...",
  "reference": "3b0c6f5e-8d2a-4c7e-9f1b-2a6d5e4c3b21",
  "code": "DOCUMENT_POSSIBLY_SENT",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836"
  }
}
```

:::warning 503 `DIAN_STATUS_UNAVAILABLE` no es una caída general de la DIAN
En producción, antes de retransmitir un número cuyo envío anterior no quedó confirmado, la API consulta ese envío en la DIAN. Si no logra confirmarlo, responde **HTTP 503** con `code: "DIAN_STATUS_UNAVAILABLE"` y **no transmite** el documento para no duplicarlo. Reintenta en unos minutos.
:::

```json title="response.json"
{
  "success": false,
  "code": "DIAN_STATUS_UNAVAILABLE",
  "message": "No se pudo confirmar en la DIAN el estado del envío anterior del documento LZT836 (CUFE/CUDE cf9864294501e8a9...). No se transmitió de nuevo para no duplicarlo: intente en unos minutos.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836",
    "document_key": "cf9864294501e8a9..."
  }
}
```

---

## ⏳ StatusCode 98 — En Procesamiento {#statuscode-98}

:::tip Estado Transitorio de Validación
`StatusCode 98` indica que la DIAN recibió el documento y lo tiene en cola. **No es un error**.
1. Espera 3 a 5 minutos.
2. Consulta el estado con `POST /status/document/{trackId}`.
3. No retransmitas con un nuevo número para evitar cobros dobles o duplicados.

En producción, si envías de nuevo el mismo número, la API primero consulta la DIAN: si sigue en 98, responde **HTTP 409** `DOCUMENT_IN_VALIDATION` sin transmitir.
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
`success: true` indica que la API procesó la solicitud HTTP correctamente. `IsValid: "true"` es la confirmación oficial de que la DIAN autorizó fiscalmente el documento. Un rechazo de la DIAN llega con `success: true` e `IsValid: "false"`.

**Recibí un timeout o un `DOCUMENT_POSSIBLY_SENT`, ¿el documento se emitió?**  
Es posible. El XML pudo llegar a la DIAN y procesarse. **Nunca retransmitas** sin antes consultar el estado con `GET /documents/{uuid}` o `GET /status`.

**La respuesta trae `warnings`, ¿debo reenviar el documento?**  
No. Si `response.IsValid` es `"true"`, el documento ya es válido ante la DIAN; los avisos indican pasos posteriores (PDF, correo, adjuntos) que puedes repetir por separado.

**¿Qué significa `nil="true"` en algunos nodos XML?**  
Es un estándar de serialización SOAP/XML que indica que el campo está vacío (equivalente a `null`).

---

<div style={{backgroundColor: 'var(--ifm-card-background-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-300)', textAlign: 'center', marginTop: '2rem'}}>
  <small>
    📅 <strong>Versión:</strong> 3.7.0 (Agosto 2026) • 
    📨 <strong>Respuestas Documentadas:</strong> HTTP, avisos y conflictos • 
    🎯 <strong>Nivel:</strong> ⭐⭐⭐ Referencia Técnica de Integración
  </small>
</div>
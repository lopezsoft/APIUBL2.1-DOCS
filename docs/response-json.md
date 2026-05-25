---
sidebar_position: 3
sidebar_label: Respuestas API
---

# 📬 Respuestas de la API

<div style={{backgroundColor: '#e7f3ff', padding: '1.5rem', borderRadius: '8px', border: '2px solid #0066cc', margin: '1.5rem 0'}}>
  <strong>📖 Guía Completa de Respuestas JSON</strong><br/>
  Todas las respuestas que emite la API están en formato JSON y contienen información detallada sobre el estado de la solicitud, documentos generados y validaciones de la DIAN.
</div>

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '1px solid #28a745', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>✅</div>
    <strong>HTTP 200/201</strong><br/>
    <small>Procesamiento exitoso</small>
  </div>

  <div style={{padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>⏳</div>
    <strong>StatusCode 98</strong><br/>
    <small>En proceso</small>
  </div>

  <div style={{padding: '1rem', backgroundColor: '#f8d7da', borderRadius: '8px', border: '1px solid #dc3545', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>❌</div>
    <strong>HTTP 4xx/5xx</strong><br/>
    <small>Errores</small>
  </div>

  <div style={{padding: '1rem', backgroundColor: '#d1ecf1', borderRadius: '8px', border: '1px solid #17a2b8', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🔄</div>
    <strong>Contingencia</strong><br/>
    <small>Timeouts y reintentos</small>
  </div>
</div>

## 📑 Tabla de Contenidos

- [Respuestas Exitosas](#estructura-de-la-respuesta-cuando-se-genera-un-documento-de-forma-exitosa) - HTTP 200, 201
- [Documentos Duplicados](#estructura-de-la-respuesta-cuando-se-intenta-generar-un-documento-que-ya-fue-procesado) - StatusCode 02
- [Códigos HTTP](#códigos-de-estado-y-descripción-de-posibles-respuestas) - Tabla de referencia rápida
- [Errores DIAN](#errores-generados-por-la-dian) - Detalles y soluciones
- [Contingencias](#124-demoras-en-los-tiempos-de-respuesta-en-los-servicios-de-facturación-electrónica-de-la-dian) - Manejo de timeouts
- [Errores 500+](#500---internal-server-error) - Problemas del servidor DIAN

---

## 🚀 Quick Reference

<div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '2px solid #6c757d', margin: '1.5rem 0'}}>
  <strong>⚡ Referencia Rápida de Códigos HTTP</strong><br/>
  Consulta instantánea de todos los códigos de estado y acciones recomendadas.
</div>

| Código | Tipo | Descripción | Acción |
|--------|------|-------------|--------|
| 200 | ✅ Éxito | Documento procesado correctamente | Descargar archivos |
| 201 | ✅ Éxito | Documento creado en queue | Esperar procesamiento |
| 400 | ❌ Error | JSON malformado | Validar formato |
| 401 | ❌ Error | Sin autenticación | Verificar credenciales |
| 402 | ❌ Error | Suscripción vencida | Renovar pago |
| 403 | ❌ Error | Sin permisos | Contactar soporte |
| 404 | ❌ Error | Recurso no existe | Verificar ID |
| 422 | ❌ Error | Validación DIAN fallida | Leer ErrorMessage |
| 500 | ❌ Error | Error servidor DIAN | Esperar e intentar |
| 503 | ❌ Error | Servicio no disponible | Consultar estado DIAN |
| 504 | ⏳ Timeout | Respuesta tardía | Ver sección contingencias |
| 507 | ❌ Error | Almacenamiento lleno | Contactar soporte |
| 508 | ❌ Error | Bucle detectado | Revisar estructura |

---

## 🎯 Guía Rápida de Inicio

<div style={{backgroundColor: '#d1ecf1', padding: '1.5rem', borderRadius: '8px', border: '2px solid #17a2b8', margin: '1.5rem 0'}}>
  <strong>🚦 Cómo Interpretar una Respuesta en 3 Pasos</strong><br/>
  Sigue este proceso simple para entender rápidamente cualquier respuesta de la API.
</div>

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>
  <div style={{padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '2px solid #0066cc'}}>
    <strong>📊 Paso 1: Código HTTP</strong><br/><br/>
    <code>HTTP 200/201</code> → ✅ Éxito<br/>
    <code>HTTP 400-409</code> → ⚠️ Error cliente<br/>
    <code>HTTP 500-508</code> → ❌ Error servidor
  </div>

  <div style={{padding: '1.5rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '2px solid #28a745'}}>
    <strong>🔍 Paso 2: Campo success</strong><br/><br/>
    <code>success: true</code> → ✅ OK<br/>
    <code>success: false</code> → ❌ Error<br/>
    <small>Leer errorMessage detalladamente</small>
  </div>

  <div style={{padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107'}}>
    <strong>🏷️ Paso 3: StatusCode DIAN</strong><br/><br/>
    <code>StatusCode: 00</code> → ✅ Procesado<br/>
    <code>StatusCode: 98</code> → ⏳ En proceso<br/>
    <code>StatusCode: 02</code> → 🔄 Duplicado
  </div>
</div>

### 🛠️ Manejo de Errores Comunes

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1.5rem 0'}}>
  <strong>⚠️ Errores Más Frecuentes y Soluciones</strong><br/>
  Los 5 errores que encontrarás con mayor frecuencia y cómo resolverlos.
</div>

| Error | Emoji | Causa | Solución |
|-------|-------|-------|----------|
| `400 - Bad Request` | ❌ | JSON malformado | Valide estructura con JSONLint |
| `401 - Unauthorized` | 🔒 | API key inválida | Verifique credenciales |
| `422 - Unprocessable Entity` | ⚠️ | Datos inválidos DIAN | Lea detalles en `response.ErrorMessage` |
| `504 - Gateway Timeout` | ⏳ | Demora en DIAN | Siga procedimiento contingencia |
| `StatusCode: 98` | 🔄 | Procesando | Consulte estado en 5 minutos |

---

## ✅ Estructura de la Respuesta Exitosa

<div style={{backgroundColor: '#d4edda', padding: '1.5rem', borderRadius: '8px', border: '2px solid #28a745', margin: '1.5rem 0'}}>
  <strong>🎉 HTTP 200/201 - Documento Procesado Exitosamente</strong><br/>
  Cuando la DIAN acepta y valida el documento, recibirás una respuesta completa con archivos PDF, XML, QR y más.
</div>

### 📋 Resumen de Estructura

Todas las respuestas exitosas (HTTP 200/201) contienen estos elementos clave:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `message` | string | Descripción legible del resultado |
| `success` | boolean | `true` si fue exitoso, `false` si hubo error |
| `XmlDocumentKey` | string | CUFE/CUDE/CUNE del documento (identificador único) |
| `response` | object | Detalles de la validación DIAN |
| `AttachedDocument` | object | Contenedor ZIP con documentos |
| `qr` | object | Códigos QR en diferentes formatos |
| `pdf` | object | Representación PDF del documento |

### Ejemplo completo de respuesta exitosa


```json title="response.json"
{
    "message": "El documento ha sido procesado por la DIAN.",
    "send_to_queue": 0,
    "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
    "response": {
        "ErrorMessage": {
            "string": [
                "Regla: FAJ73, Notificación: Estructura código no valida",
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
        "qrDian": "",
        "url": "",
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

### Descripción de los campos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `message` | string | Mensaje genérico generado por el API |
| `send_to_queue` | boolean | Indicador de si el documento fue enviado a procesar en segundo plano (**En desarrollo**) |
| `XmlDocumentKey` | string | CUFE, CUDE O CUNE DEL DOCUMENTO |
| `success` | boolean | Indica si la respuesta fue exitosa |
| `StatusCode` | number | 200 (OK) |

#### response - Respuesta emitida por la DIAN

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ErrorMessage` | string | Mensajes de error |
| `IsValid` | boolean | Indica si el documento es válido |
| `StatusCode` | number | Código de estado |
| `StatusDescription` | string | Descripción del estado |
| `StatusMessage` | string | Mensaje del estado |
| `XmlBase64Bytes` | string | Application response generado por la DIAN, en base64 |
| `XmlBytes` | string | Documento en base64 generado por la DIAN |
| `XmlDocumentKey` | string | CUFE, CUDE O CUNE DEL DOCUMENTO |
| `XmlFileName` | string | Nombre del documento en el portal de la DIAN |

#### AttachedDocument - Contenedor de documentos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `pathZip` | string | Ruta del contenedor de documentos |
| `path` | string | Ruta del contenedor de documentos |
| `url` | string | URL del contenedor de documentos |
| `data` | string | El contenedor de documentos en base64 |

#### qr - Representación gráfica QR del documento

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `qrDian` | string | URL del QR en el portal de la DIAN |
| `url` | string | URL del QR |
| `path` | string | Ruta del QR |
| `data` | string | El QR en base64 |

#### pdf - Representación gráfica PDF del documento

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `path` | string | Ruta del PDF |
| `url` | string | URL del PDF |
| `data` | string | El PDF en base64 |

## 🔄 Respuesta - Documento Duplicado

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1.5rem 0'}}>
  <strong>⚠️ StatusCode 02 - Documento Ya Procesado</strong><br/>
  Cuando intentas generar un documento que ya fue validado por la DIAN, recibirás esta respuesta indicando que el documento ya existe.
</div>

```json title="response.json"
{
    "success": false,
    "message": "El documento (Factura electrónica) con numero LZT224, ya se encuentra validado"
}
```

### 📝 Descripción de los Campos

| Campo | Descripción |
|-------|-------------|
| `success` | `false` - Indica que la operación no se pudo completar |
| `message` | Mensaje explicativo del rechazo |
| `StatusCode` | `400 - Bad Request` |

## 📊 Códigos de Estado HTTP Completos

<div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '2px solid #6c757d', margin: '1.5rem 0'}}>
  <strong>📋 Tabla Completa de Códigos HTTP</strong><br/>
  Referencia exhaustiva con todos los códigos de estado, causas posibles y acciones recomendadas para cada caso.
</div>

A continuación se muestra una tabla completa con todos los códigos de estado:

| Código | Estado | Descripción | Posibles causas | Acciones recomendadas |
|--------|--------|-------------|-----------------|----------------------|
| **200** | ✓ OK | La solicitud se ha procesado correctamente | Documento validado exitosamente | Descargar archivos generados |
| **201** | ✓ Created | El recurso se ha creado correctamente | Documento enviado a cola | Esperar procesamiento |
| **400** | ✗ Bad Request | La solicitud es incorrecta o malformada | JSON inválido, falta información | Validar estructura del JSON |
| **401** | ✗ Unauthorized | No está autorizado para acceder | Credenciales inválidas o ausentes | Verificar API key y autenticación |
| **402** | ✗ Payment Required | Se requiere un pago actualizado | Suscripción vencida o inactiva | Renovar suscripción |
| **403** | ✗ Forbidden | No tiene permiso para esta operación | Falta de permisos en cuenta | Contactar soporte para habilitar |
| **404** | ✗ Not Found | El recurso solicitado no existe | URL inválida o ID incorrecto | Verificar URL y parámetros |
| **422** | ✗ Unprocessable Entity | Validación DIAN rechazó el documento | Errores en datos del documento | Leer ErrorMessage detalladamente |
| **500** | ✗ Internal Server Error | Error en el servidor DIAN | Problema servidor DIAN | Esperar e intentar después |
| **503** | ✗ Service Unavailable | Servicio temporalmente no disponible | DIAN en mantenimiento | Consultar estado DIAN |
| **504** | ⏳ Gateway Timeout | Timeout en respuesta del servidor | Demora en procesamiento DIAN | Ver sección contingencias |
| **507** | ✗ Insufficient Storage | Almacenamiento insuficiente en servidor | Servidor lleno | Contactar soporte |
| **508** | ✗ Loop Detected | Se detectó bucle en procesamiento | Estructura circular en datos | Revisar estructura XML |

### Respuesta genérica en caso de error

```json title="response.json"
{
    "success": false,
    "message": "Mensaje de respuesta descriptivo del error"
}
```
### Descripción de los campos

- `success`: Indica si la respuesta fue exitosa
- `message`: Mensaje de respuesta
- `StatusCode`: código de estado de la respuesta

## ⚠️ Errores Generados por la DIAN

<div style={{backgroundColor: '#f8d7da', padding: '1.5rem', borderRadius: '8px', border: '2px solid #dc3545', margin: '1.5rem 0'}}>
  <strong>🚨 Errores del Servidor DIAN</strong><br/>
  Listado de posibles errores emitidos directamente por los servicios de la DIAN y cómo manejarlos.
</div>

### 💡 Recomendaciones Generales

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', margin: '1rem 0'}}>
  <strong>🔄 Protocolo de Reintentos:</strong><br/>
  • Primer reintento: Inmediato<br/>
  • Si persiste: Esperar 5 minutos<br/>
  • Después de 3 fallos: Contactar soporte DIAN
</div>

### ⏳ 12.4 Demoras en Tiempos de Respuesta

<div style={{backgroundColor: '#d1ecf1', padding: '1.5rem', borderRadius: '8px', border: '2px solid #17a2b8', margin: '1.5rem 0'}}>
  <strong>⏱️ Protocolo de Contingencia por Timeout</strong><br/>
  Se considera demora cuando la respuesta de la DIAN toma más de <strong>1 minuto</strong>. Los servicios permanecen activos pero debes seguir este protocolo.
</div>

#### 📋 Procedimiento en Caso de Demora (Resolución No. 000165 - DIAN):

| Paso | Acción | Tiempo |
|------|--------|--------|
| 1 | Notificar demora a DIAN | Inmediato |
| 2 | Detectar "Time out" | Demora declarada |
| 3 | Reintentar | 2 min, máx 5 intentos |
| 4 | Si persiste | Contingencia tipo 04 |
| 5 | Generar documento | InvoiceTypeCode = 04 |
| 6 | Monitorear | 30 min después |

**Nota**: Documentos CreditNote, DebitNote, ApplicationResponse no tienen esquemas de contingencia.

---

### 500 - Internal Server Error

| Atributo | Valor |
|----------|-------|
| **Descripción** | Error en el servidor de la DIAN |
| **Causa** | El servidor experimentó un error inesperado |
| **Acción** | Intente nuevamente más tarde o contacte soporte |

```json title="response.json"
{
    "success": false,
    "message": "Error 500: Internal Server Error"
}
```

---

### 503 - Service Unavailable

| Atributo | Valor |
|----------|-------|
| **Descripción** | Servicio de la DIAN no disponible |
| **Causa** | Mantenimiento programado o alta demanda |
| **Acción** | Intente después de unos minutos |

```json title="response.json"
{
    "success": false,
    "message": "Error 503: Service Unavailable"
}
```

---

### 504 - Gateway Timeout

| Atributo | Valor |
|----------|-------|
| **Descripción** | Timeout en conexión con DIAN |
| **Causa** | Respuesta tardía del servidor (>1 minuto) |
| **Acción** | Ver sección contingencias 12.4 |

```json title="response.json"
{
    "success": false,
    "message": "Error 504: Gateway Timeout"
}
```

---

### 507 - Insufficient Storage

| Atributo | Valor |
|----------|-------|
| **Descripción** | Almacenamiento insuficiente en servidor |
| **Causa** | Servidor ha alcanzado capacidad máxima |
| **Acción** | Intente más tarde o contacte soporte |

```json title="response.json"
{
    "success": false,
    "message": "Error 507: Insufficient Storage"
}
```

---

### 508 - Loop Detected

| Atributo | Valor |
|----------|-------|
| **Descripción** | Se detectó bucle en servidor |
| **Causa** | Estructura circular en solicitud |
| **Acción** | Revise estructura XML y contacte soporte |

```json title="response.json"
{
    "success": false,
    "message": "Error 508: Loop Detected"
}
```

```json title="response.json"
{
    "success": false,
    "message": "Error 508: Loop Detected"
}
```

---

## 🔄 Secciones Especiales

### ⏳ StatusCode 98 - En Proceso

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1.5rem 0'}}>
  <strong>🔄 Documento en Procesamiento por la DIAN</strong><br/>
  Cuando recibes este código, tu documento fue aceptado pero aún está siendo validado. No es un error, solo requiere paciencia y reintentos.
</div>

| Atributo | Valor |
|----------|-------|
| **Código** | 98 |
| **Descripción** | Solicitud en procesamiento |
| **Significado** | El documento está siendo procesado por la DIAN |
| **Acción recomendada** | ⏱️ Consultar estado después de 5 minutos |
| **Tiempo estimado** | 1-10 minutos |

**¿Qué hacer cuando recibes StatusCode 98?**

1. ✅ **Esperar 5 minutos** antes del primer reintento
2. 🔍 **Consultar estado del documento** usando el endpoint de consulta
3. 🔄 **Reintentar** hasta 5 veces con intervalos de 5 minutos
4. ⚠️ Si después de 30 minutos aún está en proceso, contactar soporte

#### 📝 Ejemplo de Respuesta - StatusCode 98

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

## 🔀 Diagrama de Flujo - Cómo Interpretar la Respuesta

<div style={{backgroundColor: '#e7f3ff', padding: '1.5rem', borderRadius: '8px', border: '2px solid #0066cc', margin: '1.5rem 0'}}>
  <strong>📊 Flujo de Decisión Visual</strong><br/>
  Sigue este diagrama para procesar cualquier respuesta de la API de forma sistemática.
</div>

```
┌─────────────────────────────┐
│ Recibir respuesta de API    │
└──────────────┬──────────────┘
               │
        ┌──────▼──────┐
        │ ¿HTTP 200?  │
        └──┬───────┬──┘
           │ SÍ    │ NO
           │       └─────────────────────┐
           │                             │
    ┌──────▼──────┐          ┌───────────▼─────┐
    │success=true?│          │ ¿HTTP 4xx-5xx? │
    └──┬───────┬──┘          └────┬──────┬─────┘
       │ SÍ    │ NO               │ SÍ   │ NO
       │       │                  │      │
       │   ┌───▼─────────────┐   │  ┌───▼──────────────┐
       │   │ Leer error en   │   │  │ Otro código HTTP │
       │   │ ErrorMessage    │   │  │ (contactar soport│
       │   │ del response    │   │  └────────────────┘
       │   └─────────────────┘   │
       │                          │
  ┌────▼──────────────────┐      │
  │ ¿StatusCode = 00?     │      │
  │  (Procesado OK)       │      │
  └──┬────────────┬───────┘      │
     │ SÍ         │ NO            │
     │            │               │
     │     ┌──────▼──────┐       │
     │     │StatusCode=98│       │
     │     │(En proceso)?│       │
     │     └──┬───────┬──┘       │
     │        │ SÍ    │ NO       │
     │        │   ┌───▼────────┐ │
     │        │   │Reintentar  │ │
     │        │   │en 5 min    │ │
     │        │   └────────────┘ │
     │        │                   │
     │        │  ┌────────────────▼──┐
     │        └──│Ver tabla códigos  │
     │           │StatusCode en 12.2 │
     │           └───────────────────┘
     │
  ┌──▼────────────────────────────┐
  │ ✓ Procesado Exitosamente      │
  │ • Descargar PDF, XML, QR      │
  │ • Guardar XmlDocumentKey      │
  │ • Confirmar con cliente       │
  └───────────────────────────────┘
```

---

## ❓ Preguntas Frecuentes (FAQ)

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1.5rem 0'}}>
  <strong>💡 Dudas Más Comunes</strong><br/>
  Respuestas rápidas a las preguntas que recibimos con mayor frecuencia sobre las respuestas de la API.
</div>

### 🚨 ¿Qué debo hacer si recibo un error 504?
En caso de timeout (error 504), siga el procedimiento de contingencia descrito en la sección **12.4**. Debe reintentar después de 2 minutos, hasta 5 veces máximo.

### ✅ ¿Puedo omitir campos requeridos en la solicitud?
No. Todos los campos marcados como requeridos en la documentación deben estar presentes. Revisar el errorMessage de la respuesta para identificar campos faltantes.

### ⏱️ ¿Cuánto tiempo tarda el procesamiento de un documento?
Normalmente, entre 1-5 minutos. Si recibe StatusCode 98, el documento está en proceso. Use el endpoint de consulta de estado para verificar progreso.

### 🔍 ¿Qué significan los caracteres nil="true" en la respuesta?
Indica que ese campo es null/vacío en esa particular respuesta. Es normal en ciertos estados de procesamiento.

### 🔄 ¿Debo reintentar automáticamente ante errores?
Sí, pero con cuidado. Use backoff exponencial: espere 2-5 segundos entre reintentos. Para error 504, ver sección de contingencias.

### 📋 ¿Cómo consulto el estado de un documento después de 98?
Use el endpoint de consulta con el `XmlDocumentKey` (CUFE/CUDE/CUNE) retornado. Continúe consultando hasta recibir status 200 o 201.

---

## 🎯 Próximos Pasos

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '2rem 0'}}>
  <a href="/docs/endpoints" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '2px solid #0066cc', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🔌</div>
      <strong>Endpoints API</strong><br/>
      <small>50+ rutas documentadas</small>
    </div>
  </a>

  <a href="/docs/use-cases/simple-invoice" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '2px solid #28a745', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📄</div>
      <strong>Factura Simple</strong><br/>
      <small>Ejemplo práctico</small>
    </div>
  </a>

  <a href="/docs/use-cases/common-errors" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⚠️</div>
      <strong>Errores Comunes</strong><br/>
      <small>Troubleshooting</small>
    </div>
  </a>

  <a href="/docs/billing-fields" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#d1ecf1', borderRadius: '8px', border: '2px solid #17a2b8', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📋</div>
      <strong>Campos de Documentos</strong><br/>
      <small>Referencia completa</small>
    </div>
  </a>
</div>

---

<div style={{backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginTop: '2rem'}}>
  <small>
    📅 <strong>Última actualización:</strong> Febrero 2026 (v3.0.0) • 
    📨 <strong>Códigos HTTP:</strong> 13 códigos documentados • 
    🎯 <strong>Nivel:</strong> ⭐⭐⭐ Referencia Técnica
  </small>
</div>
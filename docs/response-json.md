---
sidebar_position: 3
---

# Respuestas de la API

La API de facturación emite respuestas en formato JSON. Estas respuestas contienen información sobre el estado de la solicitud y los documentos generados por la DIAN.

## 📑 Tabla de Contenidos

- [Respuestas Exitosas](#estructura-de-la-respuesta-cuando-se-genera-un-documento-de-forma-exitosa) - HTTP 200, 201
- [Documentos Duplicados](#estructura-de-la-respuesta-cuando-se-intenta-generar-un-documento-que-ya-fue-procesado) - StatusCode 02
- [Códigos HTTP](#códigos-de-estado-y-descripción-de-posibles-respuestas) - Tabla de referencia rápida
- [Errores DIAN](#errores-generados-por-la-dian) - Detalles y soluciones
- [Contingencias](#124-demoras-en-los-tiempos-de-respuesta-en-los-servicios-de-facturación-electrónica-de-la-dian) - Manejo de timeouts
- [Errores 500+](#500---internal-server-error) - Problemas del servidor DIAN

---

## 🚀 Quick Reference

| Código | Tipo | Descripción | Acción |
|--------|------|-------------|--------|
| 200 | ✓ Éxito | Documento procesado correctamente | Descargar archivos |
| 201 | ✓ Éxito | Documento creado en queue | Esperar procesamiento |
| 400 | ✗ Error | JSON malformado | Validar formato |
| 401 | ✗ Error | Sin autenticación | Verificar credenciales |
| 402 | ✗ Error | Suscripción vencida | Renovar pago |
| 403 | ✗ Error | Sin permisos | Contactar soporte |
| 404 | ✗ Error | Recurso no existe | Verificar ID |
| 422 | ✗ Error | Validación DIAN fallida | Leer ErrorMessage |
| 500 | ✗ Error | Error servidor DIAN | Esperar e intentar |
| 503 | ✗ Error | Servicio no disponible | Consultar estado DIAN |
| 504 | ⏳ Timeout | Respuesta tardía | Ver sección contingencias |
| 507 | ✗ Error | Almacenamiento lleno | Contactar soporte |
| 508 | ✗ Error | Bucle detectado | Revisar estructura |

---

## Estructura de la respuesta, cuando se genera un documento de forma exitosa.

A continuación se muestra un ejemplo de un JSON que representa una respuesta de la API de facturación.


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

## Estructura de la respuesta, cuando se intenta generar un documento que ya fue procesado o validado por la DIAN.

    ```json title="response.json"

    {
        "success": false,
        "message": "El documento (Factura electrónica) con numero LZT224, ya se encuentra validado"
    }
    ```
### Descripción de los campos

- `success`: Indica si la respuesta fue exitosa
- `message`: Mensaje de error
- `StatusCode`: 400 (Bad Request)

## Códigos de estado y descripción de posibles respuestas

A continuación se muestra una tabla completa con todos los códigos de estado, su descripción, causas y acciones recomendadas:

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

## Errores generados por la DIAN
A continuación se muestra una lista de posibles errores generados por la DIAN y sus descripciones.

### Recomendaciones generales
- Reenviar las solicitudes que generen errores de la DIAN, en caso de que el error persista, se recomienda esperar 5 minutos y volver a intentar.
- Si el error persiste, se recomienda contactar al soporte técnico de la DIAN.

### 12.4 Demoras en tiempos de respuesta

Se define demora cuando la respuesta toma más de **1 minuto**. Los servicios permanecen activos.

#### Procedimiento en caso de demora (Resolución No. 000165 - DIAN):

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
- Intente nuevamente más tarde.
- Si el problema persiste, contacte al soporte técnico.

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 500: Internal Server Error. Ocurrió un problema en el servidor de la DIAN."
}
```

---

### 503 - Service Unavailable

**Description**: Error 503: Service Unavailable. El servicio de la DIAN no está disponible en este momento.

**Possibles Causas**:
- El servicio puede estar temporalmente fuera de línea debido a mantenimiento o alta demanda.

**Recommended Actions**:
- Intente nuevamente después de unos minutos.
- Consulte el estado del servicio en el sitio web de la DIAN.

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 503: Service Unavailable. El servicio de la DIAN no está disponible en este momento."
}
```

---

### 507 - Insufficient Storage

**Description**: Error 507: Insufficient Storage. El servidor de la DIAN no tiene suficiente espacio.

**Possibles Causas**:
- El servidor de la DIAN ha alcanzado su capacidad máxima de almacenamiento.

**Recommended Actions**:
- Intente nuevamente más tarde.
- Contacte al soporte técnico si el problema persiste.

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 507: Insufficient Storage. El servidor de la DIAN no tiene suficiente espacio."
}
```

---

### 508 - Loop Detected

**Description**: Error 508: Loop Detected. Se ha detectado un bucle en el servidor de la DIAN.

**Possibles Causas**:
- La solicitud ha generado un bucle infinito en el servidor.

**Recommended Actions**:
- Verifique la estructura de la solicitud.
- Contacte al soporte técnico para obtener más ayuda.


#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 508: Loop Detected. Se ha detectado un bucle en el servidor de la DIAN."
}
```
---

### 403 - Site Disabled

**Description**: Error 403: Site Disabled. El sitio de la DIAN está deshabilitado.

**Possibles Causas**:
- El servicio de la DIAN está deshabilitado temporalmente, posiblemente por mantenimiento o problemas técnicos.

**Recommended Actions**:
- Verifique que el servicio esté habilitado.
- Intente nuevamente más tarde o consulte el estado del servicio en el sitio web de la DIAN.
- Si el problema persiste, contacte al soporte técnico.

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 403: Site Disabled. El sitio de la DIAN está deshabilitado."
}
```

---

### 504 - Gateway Timeout

**Description**: Error 504: Gateway Timeout. La conexión con la DIAN está tardando más de lo esperado.
Por favor, intente nuevamente. Si el problema persiste, contacte a soporte técnico.

**Possibles Causas**:
- El servidor de la DIAN está tardando mucho en responder **(más de 20 segundos)**, posiblemente debido a alta demanda o problemas de conectividad.

**Recommended Actions**:
- Intente nuevamente más tarde.
- Verifique su conexión a internet.

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 504: Gateway Timeout. La conexión con la DIAN está tardando más de lo esperado."
}
```


-----

### Error genérico
*** Description**: Error HTTP ``statusCode`` : Ha ocurrido un error en la solicitud a la DIAN.
**Possibles Causas**:
- Ocurrió un error inesperado en el servidor de la DIAN.
- La solicitud puede estar malformada o puede haber un problema temporal en el servidor.


### Posibles respuestas del API por los errores de la DIAN

```json title="response.json"
{
    "success": false,
    "message": "Error HTTP statusCode : Ha ocurrido un error en la solicitud a la DIAN."
}
```

```json title="response.json"
{
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": {
    "_attributes": {
      "nil": "true"
    }
  },
  "XmlDocumentKey": {
    "_attributes": {
      "nil": "true"
    }
  },
  "response": {
    "ErrorMessage": {
      "_attributes": {
        "nil": "true"
      }
    },
    "IsValid": "false",
    "StatusCode": "500",
    "StatusDescription": "Ha ocurrido un error. Por favor inténtelo de nuevo.",
    "StatusMessage": {
      "_attributes": {
        "nil": "true"
      }
    },
    "xmlBase64Bytes": {
      "_attributes": {
        "nil": "true"
      }
    },
    "xmlBytes": {
      "_attributes": {
        "nil": "true"
      }
    },
    "xmlDocumentKey": {
      "_attributes": {
        "nil": "true"
      }
    },
    "xmlFileName": ""
  },
  "xmlBase64Bytes": ""
}
```

```json title="response.json"
{
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": {
    "_attributes": {
      "nil": "true"
    }
  },
  "XmlDocumentKey": {
    "_attributes": {
      "nil": "true"
    }
  },
  "response":  {
    "ErrorMessage": {},
    "StatusMessage": {
      "_attributes": {
        "nil": "true"
      }
    },
    "IsValid": "false",
    "StatusCode": "98",
    "StatusDescription": "En Proceso",
    "XmlDocumentKey": {
      "_attributes": {
        "nil": "true"
      }
    },
    "XmlFileName": {
      "_attributes": {
        "nil": "true"
      }
    }
  }
}
```
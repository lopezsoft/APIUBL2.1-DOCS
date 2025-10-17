---
sidebar_position: 3
---

# Respuestas de la API

La API de facturación emite respuestas en formato JSON. Estas respuestas contienen información sobre el estado de la solicitud y los documentos generados por la DIAN.

## Tabla de Contenidos

- [Quick Reference](#quick-reference) - Resumen rápido de códigos HTTP
- [Respuestas Exitosas](#respuestas-exitosas-200-201) - Documentos procesados correctamente
- [Errores del Cliente](#errores-del-cliente-4xx) - Errores en tu solicitud (400-422)
- [Demoras en tiempos de respuesta](#demoras-en-los-tiempos-de-respuesta) - Estrategia para timeouts
- [Flujo de procesamiento](#flujo-de-procesamiento-de-documentos) - Diagrama ASCII del ciclo de vida
- [Referencias Rápidas](#referencias-rápidas) - StatusCode 98 y tabla de códigos
- [Errores del Servidor](#500---internal-server-error) - Problemas en DIAN (500-508)
- [Mejores Prácticas](#mejores-prácticas-y-recomendaciones) - Tips de timeouts, reintentos, webhooks
- [FAQ](#preguntas-frecuentes-faq) - Respuestas a preguntas comunes

---

## Quick Reference

| Código | Significado | Acción Recomendada |
|--------|------------|-------------------|
| 200 | OK | Descarga resultados (PDF, XML, QR) |
| 201 | Created | Documento creado exitosamente |
| 400 | Bad Request | Verifica estructura JSON |
| 401 | Unauthorized | Verifica credenciales |
| 402 | Payment Required | Realiza pago |
| 403 | Forbidden | Verifica permisos |
| 404 | Not Found | Verifica ID |
| 422 | Validación fallida | Lee ErrorMessage y corrige |
| 500 | Server Error | Espera 5 min, reintenta |
| 503 | Service Unavailable | DIAN en mantenimiento |
| 504 | Gateway Timeout | Usa Contingencia Tipo 04 |
| 507 | Storage Full | Contacta soporte |
| 508 | Loop Detected | Verifica estructura |
| 98 | En Proceso | Espera, revisa estado |

---

## Respuestas Exitosas (200, 201)


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

### Descripción de campos (Respuesta 200 - OK)

| Campo | Descripción |
|-------|-------------|
| `message` | Mensaje genérico del API |
| `send_to_queue` | 0 = procesado inmediatamente, 1 = en cola |
| `XmlDocumentKey` | CUFE, CUDE o CUNE del documento (identificador único) |
| `success` | true = operación exitosa |
| `response` | Respuesta emitida por la DIAN |
| `response.ErrorMessage` | Array de errores de validación |
| `response.IsValid` | "true" = documento válido |
| `response.StatusCode` | "00" = procesado correctamente |
| `response.StatusDescription` | Descripción legible del estado |
| `response.StatusMessage` | Mensaje detallado de la DIAN |
| `response.XmlFileName` | Nombre del documento en portal DIAN |
| `AttachedDocument` | Contenedor con XML del documento |
| `qr` | Código QR del documento |
| `pdf` | PDF representativo del documento |

## Estructura de la respuesta, cuando se intenta generar un documento que ya fue procesado o validado por la DIAN.

    ```json title="response.json"

    {
        "success": false,
        "message": "El documento (Factura electrónica) con numero LZT224, ya se encuentra validado"
    }
    ```

---

## Errores del Cliente (4xx)

Estas respuestas indican que hay un error en tu solicitud.

### 400 - Bad Request

**Causa:** JSON malformado o campos faltantes

**Solución:** Valida JSON y confirma todos los campos requeridos

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 400: Bad Request. El JSON es inválido o faltan campos requeridos.",
    "errors": {
        "document": "Document object is required",
        "document.billTo": "Customer information is required"
    }
}
```

### 401 - Unauthorized

**Causa:** API key o credenciales inválidas

**Solución:** Verifica tu API key, regenera token si es necesario

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 401: Unauthorized. Las credenciales no son válidas.",
    "error": "Invalid API key or authentication token expired"
}
```

### 402 - Payment Required

**Causa:** Suscripción vencida o sin crédito

**Solución:** Realiza el pago en tu panel de control

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 402: Payment Required. Tu suscripción ha vencido.",
    "details": {
        "subscription_status": "expired",
        "renewal_date": "2025-02-15",
        "action": "Renew subscription in dashboard"
    }
}
```

### 403 - Forbidden

**Causa:** No tienes permisos para este recurso

**Solución:** Verifica permisos, contacta a soporte

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 403: Forbidden. No tienes permisos para este recurso.",
    "error": "Your account does not have access to this feature"
}
```

### 404 - Not Found

**Causa:** El documento o recurso no existe

**Solución:** Verifica el ID del documento

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 404: Not Found. El documento no existe.",
    "document_id": "123456789"
}
```

### 422 - Unprocessable Entity

**Causa:** Validación DIAN fallida (datos no cumplen reglas)

**Solución:** Lee `ErrorMessage`, corrige los datos según las reglas DIAN

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 422: Unprocessable Entity. Validación DIAN fallida.",
    "validation_errors": {
        "invoice_number": "Invoice number must be sequential",
        "document.lineItems": "At least one line item is required",
        "document.allowanceCharge": "Discount percentage cannot exceed 50%"
    },
    "dian_error": "DIAN validation rules not met"
}
```

---

## Errores del Servidor (5xx)
| Código de estado | Descripción           | Posibles causas                                                   | Acciones recomendadas                                                                            |
|------------------|-----------------------|-------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| 200              | OK                    | La solicitud se ha procesado correctamente.                       | -                                                                                                |
| 201              | Created               | El recurso se ha creado correctamente.                            | -                                                                                                |
| 400              | Bad Request           | La solicitud es incorrecta o no se puede procesar.                | - Verifique la estructura de la solicitud. - Contacte al soporte técnico.                        |
| 401              | Unauthorized          | No está autorizado para acceder al recurso.                       | - Verifique sus credenciales. - Contacte al soporte técnico.                                     |
| 402              | Payment Required      | Se requiere un pago para acceder al recurso.                      | - Realice el pago correspondiente. - Contacte al soporte técnico.                                |
| 403              | Forbidden             | No tiene permiso para acceder al recurso.                         | - Verifique sus permisos. - Contacte al soporte técnico.                                         |
| 404              | Not Found             | El recurso solicitado no se ha encontrado.                        | - Verifique la URL. - Contacte al soporte técnico.                                               |
| 422              | Unprocessable Entity  | La solicitud no se puede procesar debido a errores de validación. | - Verifique los datos enviados. - Corrija los errores y vuelva a intentarlo.                     |
| 500              | Internal Server Error | Ocurrió un problema en el servidor.                               | - Intente nuevamente más tarde. - Contacte al soporte técnico.                                   |
| 503              | Service Unavailable   | El servicio no está disponible en este momento.                   | - Intente nuevamente después de unos minutos. - Consulte el estado del servicio en el sitio web. |
| 504              | Gateway Timeout       | La conexión con el servidor está tardando más de lo esperado.     | - Intente nuevamente más tarde. - Verifique su conexión a internet.                              |
| 507              | Insufficient Storage  | El servidor no tiene suficiente espacio.                          | - Intente nuevamente más tarde. - Contacte al soporte técnico.                                   |
| 508              | Loop Detected         | Se ha detectado un bucle en el servidor.                          | - Verifique la estructura de la solicitud. - Contacte al soporte técnico.                        |

## Ejemplo genérico de respuesta.

    ```json title="response.json"

    {
        "success": false,
        "message": "Mensaje de respuesta"
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

### Demoras en los tiempos de respuesta (Resolución DIAN 165/2023)

#### Qué es una demora

Una demora ocurre cuando la respuesta ante una solicitud tarda **más de 1 minuto**. Durante la demora, los servicios DIAN permanecen activos, pero la respuesta se retrasa. No se recibe ninguno de los códigos de error normales (solo timeout/504).

#### Estrategia de reintentos

Cuando recibas error **504 (timeout)**, implementa esta estrategia:

| Intento | Acción | Espera después |
|---------|--------|-----------------|
| 1 | Transmite documento | - |
| 2 | Reintenta | 2 minutos |
| 3 | Reintenta | 2 minutos |
| 4 | Reintenta | 2 minutos |
| 5 | Reintenta | 2 minutos |
| Fallido | Declara Contingencia Tipo 04 | - |

#### Contingencia Tipo 04

Si después de 5 intentos DIAN sigue sin responder:

**Paso 1: Modifica el documento**
- Cambia `InvoiceTypeCode` de `"01"` a `"04"`
- Mantén el mismo prefijo y número de factura
- Mantén todos los demás datos del documento

**Paso 2: Firma nuevamente**
- Firma el documento con tu certificado digital

**Paso 3: Adjunta evidencia**
- Incluye el XML original (sin respuesta DIAN) en `AttachedDocument`
- Adjunta registro de los 5 intentos con horarios exactos

**Paso 4: Entrega al cliente**
- Número del intento que falló
- Horarios de cada intento realizado
- Documento con InvoiceTypeCode "04" firmado

#### Documentos sin contingencia

Los siguientes documentos **NO tienen esquema de contingencia** y deben generarse/transmitirse normalmente:

- **CreditNote** (Nota Crédito)
- **DebitNote** (Nota Débito)
- **ApplicationResponse** (Eventos/Respuestas)
- Otros documentos electrónicos

#### Monitoreo post-contingencia

Monitorea la conexión con DIAN cada **30 minutos** después del último intento para reintentarla.

> **Fuente:** Resolución No. 000165 (01/NOV/2023) - Dirección de Gestión de Impuestos DIAN

---

### 500 - Internal Server Error

**Descripción:** Error interno en los servidores de DIAN

**Posibles Causas:**
- Problema temporal en la infraestructura DIAN
- Procesamiento de una solicitud muy compleja
- Error de configuración temporal en DIAN

**Acciones Recomendadas:**
1. Espera 5 minutos antes de reintentar
2. Reintenta hasta 5 veces con espacios de 2 minutos
3. Si persiste, contacta soporte DIAN
4. Guarda el ID de solicitud para referencia

**Nota:** No es un error en tu solicitud, es un problema del servidor DIAN.

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 500: Internal Server Error. Ocurrió un problema en el servidor de la DIAN."
}
```

---

### 503 - Service Unavailable

**Descripción:** Servicio DIAN no disponible

**Posibles Causas:**
- Mantenimiento programado o emergente
- Sobrecarga temporal de servidores
- Corte de conectividad temporal
- Actualización de sistemas DIAN

**Acciones Recomendadas:**
1. Verifica el estado en https://www.dian.gov.co
2. Espera 10-15 minutos
3. Reintenta la transmisión
4. Si sigue unavailable > 30 min, usa Contingencia Tipo 04

**Nota:** Es un problema en DIAN, no en tu solicitud. Tu documento no se perdió.

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 503: Service Unavailable. El servicio de la DIAN no está disponible en este momento."
}
```

---

### 507 - Insufficient Storage

**Descripción:** Almacenamiento del servidor DIAN agotado

**Posibles Causas:**
- Base de datos DIAN llegó a capacidad máxima (raro)
- Problema de configuración de disco (raro)

**Acciones Recomendadas:**
1. Este es un error **muy poco frecuente**
2. Espera 30 minutos
3. Reintenta
4. Si persiste, contacta DIAN directamente

**Nota:** Generalmente indica un problema crítico en infraestructura DIAN.

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": false,
    "message": "Error 507: Insufficient Storage. El servidor de la DIAN no tiene suficiente espacio."
}
```

---

### 508 - Loop Detected

**Descripción:** Bucle detectado en procesamiento DIAN

**Posibles Causas:**
- Referencia circular en documento (muy raro)
- Error temporal en procesamiento DIAN
- Malformación extrema en XML (después de firma)

**Acciones Recomendadas:**
1. Verifica la estructura del XML generado
2. Compara con factura anterior exitosa
3. Reintenta tras 5 minutos
4. Si persiste, contacta soporte DIAN

**Nota:** Indica un problema muy poco común. Conserva evidencia para análisis.

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

## Referencias Rápidas

### StatusCode 98: En Proceso

Cuando DIAN recibe tu documento, lo coloca en una cola de procesamiento. Durante este tiempo, devuelve StatusCode **98** que significa "En Proceso".

**Qué significa:**
- El documento está en la cola de DIAN
- Se está validando según reglas DIAN
- Debes reintentarPOLLING cada cierto tiempo

**Acciones:**
- NO reintentar inmediatamente
- Realizar polling cada 30-60 segundos
- Guardar el XmlDocumentKey para seguimiento

#### Ejemplo de respuesta

```json title="response.json"
{
    "success": true,
    "message": "Solicitud procesada por la DIAN.",
    "response": {
        "IsValid": "false",
        "StatusCode": "98",
        "StatusDescription": "En Proceso"
    }
}
```

---

### Tabla de Códigos de Estado

| Código | Tipo | Descripción | Acción |
|--------|------|-------------|--------|
| 00 | Éxito | Aceptado | Guardar resultado |
| 01 | Éxito | Documento válido | Guardar resultado |
| 02 | Éxito | Duplicado | Verificar intención |
| 03 | Rechazo | Documento rechazado | Revisar errores |
| 04 | Especial | Contingencia tipo 04 | Ver sección 12.4 |
| 98 | En proceso | En validación | Hacer polling |
| 200 | HTTP | OK | Documento procesado |
| 400 | HTTP | Bad Request | Revisar formato JSON |
| 401 | HTTP | Unauthorized | Verificar credenciales |
| 402 | HTTP | Payment Required | Renovar suscripción |
| 403 | HTTP | Forbidden | Verificar permisos |
| 404 | HTTP | Not Found | Verificar URL |
| 422 | HTTP | Unprocessable | Revisar validaciones DIAN |
| 500 | HTTP | Server Error | Esperar e intentar |
| 503 | HTTP | Unavailable | Mantenimiento DIAN |
| 504 | HTTP | Gateway Timeout | Ver sección de demoras |

---

### Flujo de procesamiento de documentos

El siguiente diagrama muestra el ciclo de vida de un documento desde su envío hasta su respuesta:

```
PROVEEDOR TECNOLOGICO
     |
     v
[1. Crear documento XML firmado]
     |
     v
[2. Enviar a DIAN con credenciales]
     |
     +----> (Espera respuesta)
     |
     +---> Caso A: Respuesta RÁPIDA (< 1 min)
     |         |
     |         v
     |     [HTTP 200/201]
     |         |
     |     ¿Es StatusCode 00, 01?
     |     YES: Documento aceptado
     |     NO:  Ver StatusCode específico (02, 03, 04)
     |
     +---> Caso B: DEMORA (timeout > 1 min)
              |
              v
          [HTTP 504 Gateway Timeout]
              |
          [Implementar reintentos]
              |
        +---------+---------+
        |         |         |
    Intento   Intento   Intento
      1-4       1-4       5
        |         |         |
    Espera    Espera      |
    2 min     2 min      Logró?
        |         |     /      \
        v         v    YES      NO
   Reintenta   [100% OK] v      v
        |              EXITO  CONTINGENCIA
        |                      TIPO 04
    ¿Logró?
     /   \
   YES   NO
    |     |
    v     v
 EXITO  CONTINUAR
 LOG   REINTENTOS
```

**Flujo de decisión resumido:**

1. **Envía documento** a DIAN
2. **¿Respuesta rápida?** (< 1 minuto)
   - SI -> Procesa resultado según StatusCode
   - NO -> Ve a paso 3

3. **¿Recibiste timeout (504)?**
   - SI -> Implementa reintentos (5 intentos, 2 min entre intentos)
   - NO -> Contacta soporte

4. **¿Los 5 reintentos fallaron?**
   - SI -> Declara Contingencia Tipo 04
   - NO -> Retorna a paso 1 para reintentar

---

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

---

## Mejores Prácticas y Recomendaciones

### Gestión de Timeouts

- **Establece timeouts apropiados:**
  - Lectura: 30 segundos
  - Conexión: 10 segundos
  - Total: 60 segundos máximo

- **No reintentar inmediatamente:**
  - Espera mínimo 2 minutos entre intentos
  - Máximo 5 intentos para el mismo documento

- **Logging detallado:**
  - Guarda cada intento con timestamp exacto
  - Registra duración de respuesta
  - Almacena el error HTTP y StatusCode DIAN

### Gestión de Reintentos

- **Estrategia exponencial:**
  ```
  Intento 1: sin espera
  Intento 2: espera 2 minutos
  Intento 3: espera 4 minutos
  Intento 4: espera 6 minutos
  Intento 5: espera 8 minutos
  ```

- **Persiste los reintentos:**
  - Guarda en base de datos cada intento
  - No pierdas intentos si falla tu servidor
  - Permite recuperación post-fallo

### Manejo de Respuestas

- **Valida StatusCode primero:**
  - Códigos 00-04 y 98: respuestas válidas
  - Otros códigos: error del servidor

- **Almacena XmlDocumentKey:**
  - Necesario para tracking y troubleshooting
  - Incluye en logs y reportes

- **Notifica cambios de estado:**
  - Cuando pasas de "En Proceso" (98) a otro
  - Incluye timestamp y StatusDescription

### Manejo de Duplicados

**Si recibes StatusCode 02 (Duplicado):**

1. Verifica que sea duplicado genuino
2. Compara fechas y cantidades
3. Consulta al cliente antes de descartar
4. Guarda evidencia de duplicidad

**Nunca rechaces sin verificación manual.**

### Contingencias

**Si debes usar Contingencia Tipo 04:**

1. Conserva evidencia de todos los intentos
2. Guarda en archivo separado por mes
3. Notifica al cliente la situación
4. Mantén por 5 años según normativa DIAN

**Archivos a conservar:**
- XML original
- Respuesta DIAN (si la hay)
- Logs de intentos
- Contingencia generada

### Seguridad

- **Nunca expongas credenciales** en logs
- **Encripta en tránsito:** HTTPS obligatorio
- **Valida certificados digitales** de cliente
- **Audit trail:** quién y cuándo transmitió cada documento

### Monitoreo

**Métricas clave:**
- % de documentos exitosos (00, 01)
- % de timeouts (504)
- % de rechazos DIAN (03)
- Tiempo promedio de respuesta
- Frecuencia de contingencias

**Alertas recomendadas:**
- Cuando % timeouts > 5%
- Cuando % rechazos DIAN > 2%
- Cuando respuesta > 30 segundos
- Cuando se usa contingencia Tipo 04

### Integración con Webhooks (Opcional)

Si implementas webhooks para notificaciones:

```json
{
  "event": "document_processed",
  "timestamp": "2025-01-15T10:30:45Z",
  "document": {
    "type": "Invoice",
    "number": "FV-2025-000001",
    "customer": "900.000.000-0"
  },
  "status": {
    "http_code": 200,
    "dian_code": "00",
    "description": "Documento válido"
  },
  "xml_key": "1234567890abcdef"
}
```

**Reintentá los webhooks:**
- 3 intentos con 5 minutos de intervalo
- Guarda registro de fallidos para revisión

---

## Preguntas Frecuentes (FAQ)

### ¿Por qué falla mi documento si el JSON parece correcto?

Posibles causas:
- **Dominio incorrecto** en el cliente
- **Certificado digital expirado** o incorrecto
- **Fecha del servidor desincronizada** (crítico para firmas digitales)
- **Estructura XML malformada** (después de firma)
- **Campo requerido incompleto** o con formato inválido

**Solución:** Revisa los errores detallados en la respuesta DIAN (ErrorDescription)

### ¿Cómo sé si mi documento está realmente siendo procesado?

En StatusCode 98 ("En Proceso"):
- Realiza polling cada 30-60 segundos
- Guarda el XmlDocumentKey
- Después de 5 minutos sin respuesta, implementa contingencia

### ¿Qué diferencia hay entre CreditNote y DocumentNote?

- **CreditNote:** Para reducir valor total (devoluciones)
- **DebitNote:** Para aumentar valor (cargos adicionales)
- **Ambas:** Referencian una factura previa por su CUFE

### ¿Puedo reutilizar el mismo número de factura?

**NO.** La DIAN rechaza duplicados por:
- Mismo Prefijo + Número + Cliente en 24 horas

Si necesitas anular, usa CreditNote (anulación comercial) o Contingencia Tipo 04.

### ¿Cómo genero una Contingencia Tipo 04?

1. Mantén el mismo número y prefijo
2. Cambia `InvoiceTypeCode` a `"04"`
3. Adjunta XML original en `AttachedDocument`
4. Firma nuevamente
5. Transmite normalmente
6. Guarda evidencia de intentos fallidos

### ¿Qué pasa si mi servidor cae durante un reintento?

- La factura NO se pierde (DIAN la tiene)
- Consulta el estado usando XmlDocumentKey
- Continúa con reintentos desde donde quedó
- Usa StatusCode 98 para verificar estado

---
```
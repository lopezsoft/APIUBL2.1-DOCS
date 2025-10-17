---
sidebar_position: 3
---

# Respuestas de la API.

La API de facturación emite respuestas en formato JSON. Estas respuestas contienen información sobre el estado de la solicitud y los documentos generados por la DIAN.

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

- `message`:  Mesaje generico generado por el API
- `send_to_queue`: Indicador de si el documento fue enviado a procesar en segundo plano(**En desarrollo**)
- `XmlDocumentKey`: CUFE, CUDE O CUNE DEL DOCUMENTO
- `response`: Respuesta emitida por la DIAN
  - `ErrorMessage`: Mensajes de error
  - `IsValid`: Indica si el documento es válido
  - `StatusCode`: Código de estado
  - `StatusDescription`: Descripción del estado
  - `StatusMessage`: Mensaje del estado
  - `XmlBase64Bytes`: Application response generado por la DIAN, en base64
  - `XmlBytes`: Documento en base64 generado por la DIAN
  - `XmlDocumentKey`: CUFE, CUDE O CUNE DEL DOCUMENTO
  - `XmlFileName`: Nombre del documento en el portal de la DIAN
- `AttachedDocument`: Contenedor de documentos
  - `pathZip`: Ruta del contenedor de documentos
  - `path`: Ruta del contenedor de documentos
  - `url`: URL del contenedor de documentos
  - `data`: El contenedor de documentos en base64
- `qr`: Contiene el la representación gráfica del documento
  - `qrDian`: URL del QR en el portal de la DIAN
  - `url`: URL del QR
  - `path`: Ruta del QR
  - `data`: El QR en base64
- `pdf`: Contiene el la representación gráfica del documento
  - `path`: Ruta del PDF
  - `url`: URL del PDF
  - `data`: El PDF en base64
- `success`: Indica si la respuesta fue exitosa
- ``StatusCode``: 200 (OK)

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

## Códigos de estado y descripción de posibles respuestas.

A continuación se muestra una tabla con los códigos de estado y su descripción.

### `200` - OK
### `201` - Created
### `400` - Bad Request
### `401` - Unauthorized
### `402` - Payment Required
### `403` - Forbidden
### `404` - Not Found
### `422` - Unprocessable Entity
### `500` - Internal Server Error
### `503` - Service Unavailable
### `504` - Gateway Timeout
### `507` - Insufficient Storage
### `508` - Loop Detected

### Tabla de códigos de estado y descripción
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

### 12.4 Demoras en los tiempos de respuesta en los servicios de facturación electrónica de la DIAN
Eventualmente en el uso de los servicios del sistema de factura electrónica con validación previa se pueden presentar algunas demoras en los tiempos respuesta debido a situaciones normales informáticas.
Se define por demora cuando la respuesta ante una solicitud a uno de los servicios del sistema de factura electrónica con validación previa toma más de 1 minuto. En la demora se mantienen activos los servicios del sistema de factura electrónica con validación previa. La demora no genera la respuesta de los código del numeral 12.2.1. Mensajes de error, ante esta situación los proveedores tecnológicos y/o facturador electrónico deberán:
- 1. A manera informativa notificar a la DIAN la demora en la respuesta de los servicios.
- 2. Si durante la transmisión de los documentos electrónicos a los servicios del sistema de factura electrónica con validación previa recibe el mensaje de “Time out” como se entenderá que es una demora declarada por el sistema.
- 3. Una vez a sucedido la demora declarada, transcurrido 2 minutos deberá transmitir nuevamente los documentos electrónicos. Si persiste el error, se deben realizar cuatro (4) intentos más, cada uno en intervalo de 2 minutos.
   Resolución No. 000165 (01/NOV/2023)
   Dirección de Gestión de Impuestos
   Carrera 8 Nº 6C-38 piso 6º PBX 607 9999 – 382 4500 Ext. 905101
   Código postal 111711
   www.dian.gov.co
   Formule su petición, queja, sugerencia o reclamo en el Sistema PQSR de la DIAN
   Página 682 de 753
- 4. Si el problema persiste a pesar de los 5 intentos, se declara la contingencia tipo 04. Donde deberá mantener y archivar las evidencias de las demoras en los servicios
- 5. En la contingencia tipo 04 deberá generar la factura electrónica de venta cambiando el contenido referenciado en la etiqueta InvoiceTypeCode con el valor 04 según el numeral 6.1.3. manteniendo el mismo prefijo y número de factura, volver a firmar la factura electrónica, incluir la factura electrónica sin ApplicationResponse (validación de la DIAN) en un AttachedDocument y entregar al adquiriente.
- 6. Monitorear la conexión y los servicios web de sistema de factura electrónica con validación previa a los 30 minutos después de haber realizado la última transmisión informado en el punto 3 del numeral 12.3.

Se informa que los documentos CreditNote, DebitNote, ApplicationResponse (Eventos) y otros documentos electrónicos no tienen esquemas de contingencia, por tanto, se deberán generar, transmitir

### 500 - Internal Server Error

**Description**: Error 500: Internal Server Error. Ocurrió un problema en el servidor de la DIAN.

**Possibles Causas**:
- El servidor de la DIAN experimentó un error inesperado.
- La solicitud puede estar malformada o puede haber un problema temporal en el servidor.

**Recommended Actions**:
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
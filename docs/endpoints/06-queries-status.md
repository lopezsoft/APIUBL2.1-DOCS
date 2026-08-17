---
sidebar_position: 6
sidebar_label: 🔍 Consultas y Estados
---

# 🔍 Búsqueda y Estados de Documentos

> ✅ **Autenticación REQUERIDA**
> Incluir en todos: `Authorization: Bearer {token}`

:::info ¿Dónde obtener el `client_uuid`? — Parámetro Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes consultar documentos, estados, XMLs, PDFs y rangos de numeración de tus empresas cliente agregando el parámetro `client_uuid` en la URL:
- **URL con Query Param:** `?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La consulta o descarga se ejecutará en el contexto de la empresa cliente especificada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

Esta sección documenta los endpoints para la búsqueda masiva e individual de los documentos electrónicos emitidos.

> 🟢 GET para búsquedas y consultas
> 🟘 POST para descargar archivos adjuntos / correos / estados

## Búsqueda y Listado

### Buscar Documentos - 🟢 GET
```http
GET {{url}}/documents?order_number=251956&query=&limit=1&resolution=&number=&prefix=&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |
| `order_number` | query | No | Número de orden interno. |
| `number` | query | No | Número consecutivo del documento. |
| `prefix` | query | No | Prefijo de la resolución. |
| `resolution` | query | No | Número de resolución DIAN. |
| `query` | query | No | Búsqueda por texto libre. |
| `limit` | query | No | Límite de registros retornados. |
| `start_date` | query | No | Fecha inicial de emisión (YYYY-MM-DD). |
| `end_date` | query | No | Fecha final de emisión (YYYY-MM-DD). |
| `document_key` | query | No | CUFE o CUDE del documento. |
| `document_type` | query | No | Tipo de documento (01=Factura, etc.). |
| `document_status` | query | No | Estado del documento (-1=Rechazado, 0=Pendiente, 1=Aceptado). |

---

### Último Documento Generado - 🟢 GET
```http
GET {{url}}/documents/last?resolution=18764074347312&prefix=LZT&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `resolution` | query | Sí | Número de resolución DIAN. |
| `prefix` | query | No | Prefijo de la resolución. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Trae el último documento válido emitido para una resolución específica.

---

### Consumo de Documentos - 🟢 GET
```http
GET {{url}}/documents/consume?p_year=2024&p_type=4&p_dni=901091403&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `p_year` | query | No | Año del reporte. |
| `p_type` | query | No | Tipo de agrupación (por mes, año, cliente, desarrollador, etc.). |
| `p_dni` | query | No | NIT a consultar. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Devuelve el reporte de documentos consumidos (usados).

---

## Descargas de Archivos

Para descargar los adjuntos y representaciones gráficas del documento usando el **CUFE/CUDE** (`trackId`).

### Descargar PDF - 🟘 POST
```http
POST {{url}}/documents/pdf/{trackId}?regenerate=0&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento. |
| `regenerate` | query | No | `1` fuerza a reescribir/regenerar el PDF, `0` descarga el existente. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "message": "PDF generado correctamente.",
  "pdf": {
    "path": "1/b46e15b0-69db-11f1-984a-345a60fd780b.pdf",
    "url": "https://api.ejemplo.com/pdf/1/b46e15b0-69db-11f1-984a-345a60fd780b.pdf",
    "data": "JVBERi0xLjQKJeLjz9MKMyAwIG9iago..."
  }
}
```

---

### Descargar XML - 🟢 GET
```http
GET {{url}}/documents/xml/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

---

### Descargar Adjunto (Attached Document) - 🟘 POST
```http
POST {{url}}/documents/attached/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Descarga el `.zip` con el ApplicationResponse completo.

---

## Consulta de Estados (Status)

### Estado en modo de pruebas (ZIP) - 🟘 POST
```http
POST {{url}}/status/zip/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | Track ID del envío en pruebas. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "Envelope": {
      "Body": {
        "GetStatusResponse": {
          "GetStatusResult": {
            "IsValid": "true",
            "StatusCode": "00",
            "StatusDescription": "Procesado Correctamente.",
            "StatusMessage": "Documento verificado y validado por la DIAN."
          }
        }
      }
    }
  },
  "success": true
}
```

---

### Estado en Producción - 🟘 POST
```http
POST {{url}}/status/document/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento emitido. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Verifica el estado del documento directamente con la DIAN en producción.

**Respuesta Exitosa (HTTP 200):**
```json
{
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "Envelope": {
      "Body": {
        "GetStatusResponse": {
          "GetStatusResult": {
            "IsValid": "true",
            "StatusCode": "00",
            "StatusDescription": "Procesado Correctamente.",
            "StatusMessage": "Documento verificado y validado por la DIAN."
          }
        }
      }
    }
  },
  "success": true
}
```

---

### Estado Interno de la API - 🟢 GET
```http
GET {{url}}/status?order_number=251956&resolution=&number=LZT836&prefix=&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `order_number` | query | No | Número de orden interno. |
| `number` | query | No | Número de documento. |
| `prefix` | query | No | Prefijo de la resolución. |
| `resolution` | query | No | Número de resolución. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Obtiene información del documento registrado en el API, validación y detalles del Código QR.

**Respuesta Exitosa (HTTP 200):**
```json
{
  "document": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836",
    "order_number": null,
    "document_key": "cf9864294501e8a9578235dd2ab3c4fd1d9085fe5d3b345d191fbb8c9afa6ff8acec7a97a177393b2d32735d225a9f1d",
    "document_name": "fv09010914030002500000033.xml",
    "is_valid": true,
    "invoice_date": "2025-02-14T05:00:00.000000Z",
    "qr": {
      "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=cf9864294501e8a9578235dd2ab3c4fd1d9085fe5d3b345d191fbb8c9afa6ff8acec7a97a177393b2d32735d225a9f1d",
      "data": "TnVtRmFjOiBMWlQ4MzYKRmVjRmFjOiAyMDI1LTAyLTE0CkhvckZhYzogMjE6MTY6MjgtMDU6MDAKTml0RmFjOiA5MDEwOTE0MDMKRG9jQWRxOiAxMDYzMjc5MzA3ClZhbEZhYzogMjAwLjAwClZhbEl2YTogMjQuMDAKVmFsT3Ryb0ltOiAwClZhbFRvbEZhYzogMjI0LjAwCkNVRkU6IGNmOTg2NDI5NDUwMWU4YTk1NzgyMzVkZDJhYjNjNGZkMWQ5MDg1ZmU1ZDNiMzQ1ZDE5MWZiYjhjOWFmYTZmZjhhY2VjN2E5N2ExNzczOTNiMmQzMjczNWQyMjVhOWYxZApodHRwczovL2NhdGFsb2dvLXZwZmUuZGlhbi5nb3YuY28vZG9jdW1lbnQvc2VhcmNocXI/ZG9jdW1lbnRrZXk9Y2Y5ODY0Mjk0NTAxZThhOTU3ODIzNWRkMmFiM2M0ZmQxZDkwODVmZTVkM2IzNDVkMTkxZmJiOGM5YWZhNmZmOGFjZWM3YTk3YTE3NzM5M2IyZDMyNzM1ZDIyNWE5ZjFk",
      "path": "1/fv09010914030002500000033.png",
      "url": "http://apidian.test/qr/1/fv09010914030002500000033.png"
    }
  },
  "status": "Validado por la DIAN",
  "message": "Consulta exitosa",
  "success": true
}
```

---

## Utilidades de Correo y Adquirentes

### Envío y Reenvío de Correos
```http
POST {{url}}/documents/sendmail/to?client_uuid={{client_uuid}}
POST {{url}}/documents/sendmail/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | No | CUFE/CUDE del documento (para reenvío por ID). |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Permite enviar por primera vez (con base64 adjuntos) o reenviar un documento ya emitido por CUFE/CUDE al adquirente u otros destinatarios.

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Correo electrónico enviado satisfactoriamente",
  "recipients": ["cliente@correo.com"]
}
```

---

### Consulta de Adquirente - 🟢 GET
```http
GET {{url}}/acquirer?identificationType=13&identificationNumber=1063279303&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `identificationType` | query | Sí | Tipo de identificación (13=CC, 31=NIT, etc.). |
| `identificationNumber` | query | Sí | Número de documento del adquirente. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Retorna información asociada (como correos) de un Adquirente registrado previamente en las facturas.

**Respuesta Exitosa (HTTP 200):**
```json
{
  "message": "Consulta generada con éxito",
  "content": {
    "ReceiverEmail": "correo@cliente.com",
    "ReceiverName": "CLIENTE EJEMPLO S.A.S",
    "StatusCode": "200"
  },
  "customer": {
    "id": 748,
    "country_id": 45,
    "city_id": 149,
    "identity_document_id": 3,
    "company_name": "CLIENTE EJEMPLO S.A.S",
    "dni": "901091403",
    "email": "correo@cliente.com"
  }
}
```

---

### Intercambio de Correos - 🟢 GET
```http
GET {{url}}/exchange-emails?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Obtiene la lista de correos registrados para recepción en la plataforma.

---

## Configuraciones

### Rango de Numeración - 🟢 GET
```http
GET {{url}}/numbering-range?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `type_id` | query | No | Tipo de documento: `1`=Factura, `3`=Doc Soporte, `4`=POS. |
| `sync` | query | No | `1` fuerza sincronización con la DIAN. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Obtiene las resoluciones y rangos de numeración activos de facturación.

---

## Estados Adicionales

### Estado del Documento en Pruebas (Test) - 🟘 POST
```http
POST {{url}}/status/document/test/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Verifica el estado de un documento en el ambiente de **pruebas** (habilitación) directamente con la DIAN. A diferencia del ZIP, usa el trackId del documento de prueba.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento de prueba. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "Envelope": {
      "Body": {
        "GetStatusResponse": {
          "GetStatusResult": {
            "IsValid": "true",
            "StatusCode": "00",
            "StatusDescription": "Procesado Correctamente.",
            "StatusMessage": "Documento verificado y validado por la DIAN."
          }
        }
      }
    }
  },
  "success": true
}
```

---

### Obtener Archivos del Documento - 🟢 GET
```http
GET {{url}}/documents/{uuid}/files?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Retorna los archivos asociados a un documento (PDF, XML, ApplicationResponse) identificado por su UUID interno.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | ✅ Sí | UUID interno del documento. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "document_uuid": "1868f3c9-98fb-11f1-b521-345a60fd780b",
        "uuid": "102035600026107941",
        "file_path": "xml/1/fv/fv636afa85-c756-463e-b28c-0c0fa8adf3c3.xml",
        "file_name": "fv636afa85-c756-463e-b28c-0c0fa8adf3c3.xml",
        "type": "xml"
      }
    ],
    "total": 3
  }
}
```

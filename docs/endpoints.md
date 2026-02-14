---
sidebar_position: 2
---

# 🔌 Endpoints API

<div style={{backgroundColor: '#e7f3ff', padding: '1.5rem', borderRadius: '8px', border: '2px solid #0066cc', margin: '1.5rem 0'}}>
  <strong>📖 Referencia Completa de Endpoints</strong><br/>
  Los endpoints son las URL que se utilizan para acceder a los recursos de la API. Cada endpoint es un punto de acceso que devuelve datos o realiza operaciones en el servidor.
</div>

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '1px solid #28a745', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🟢</div>
    <strong>Públicos</strong><br/>
    <small>Sin autenticación</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🔐</div>
    <strong>Privados</strong><br/>
    <small>Requieren token</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#d1ecf1', borderRadius: '8px', border: '1px solid #17a2b8', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>📄</div>
    <strong>Documentos</strong><br/>
    <small>CRUD y consultas</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🔔</div>
    <strong>Webhooks</strong><br/>
    <small>v3.0.0</small>
  </div>
</div>

## 🎯 Introducción a los Endpoints de la API

### 🎟️ Flujo Completo de una Factura Electrónica

```
1. AUTENTICACIÓN        2. CONSULTA              3. ENVÍO                4. ESTADO
   /auth/login              /document-type            /invoice               /status
       ↓                       ↓                        ↓                       ↓
  [Token]                 [Tabla DIAN]            [Factura JSON]        [Validado]
       ↓                       ↓                        ↓                       ↓
  Públicos                  Públicos               Privados               Privados
```

### 📋 Tabla de Contenidos

1. [Endpoints Públicos](#endpoints-públicos) - Sin autenticación
2. [Endpoints Privados](#endpoints-privados) - Con token
3. [Consultas de Documentos](#documentos) - Búsqueda y descargas
4. [Estado de Documentos](#estado-de-documentos) - Seguimiento DIAN
5. [Eventos y Acuses](#eventos---acuses) - Respuestas del adquirente
6. [Utilidades](#envío-de-correos-electrónicos-personalizados) - Correos y consultas
7. [Personal Access Tokens](#personal-access-tokens) - Gestión de tokens (v3.0.0)
8. [Webhooks](#webhooks) - Notificaciones automáticas (v3.0.0)
9. [Membresías y Consumo](#membresías-y-consumo) - Límites y estadísticas (v3.0.0)

## 🏷️ Tipos de Endpoints

<div style={{backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '1rem'}}>
  La API cuenta con <strong>dos categorías principales</strong> de endpoints según sus requisitos de autenticación:
</div>

| Tipo            | Autenticación | Uso                         | Headers                         |
| --------------- | ------------- | --------------------------- | ------------------------------- |
| **🟢 Públicos** | ❌ No         | Tablas DIAN, autenticación  | Ninguno                         |
| **🔐 Privados** | ✅ Sí         | Documentos, estado, eventos | `Authorization: Bearer {token}` |

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', marginTop: '1rem'}}>
  <strong>⚠️ Importante:</strong> Los endpoints privados requieren el header <code>Authorization: Bearer {'{token}'}</code> en todas las solicitudes.
</div>

## 🟢 Endpoints Públicos

<div style={{backgroundColor: '#d4edda', padding: '1.5rem', borderRadius: '8px', border: '2px solid #28a745', margin: '1.5rem 0'}}>
  <strong>❌ Autenticación NO requerida</strong><br/>
  Estos endpoints obtienen información de consulta (tablas DIAN, configuraciones, etc.) sin necesidad de token de acceso.
</div>

### Estructura de Respuesta Estándar

Todas las respuestas siguen este patrón:

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 1,
        "code": "01",
        "name": "Factura de Venta"
      }
    ]
  },
  "success": true
}
```

- `dataRecords.data`: Arreglo de registros
- `success`: Indica si fue exitosa (true/false)

## Tablas Referenciadas DIAN

### 🟢 Método: GET

Todos estos endpoints retornan un listado de valores permitidos en la DIAN.

**¿Cuándo usar?** Para obtener códigos válidos antes de enviar un documento.

### Documentos Electrónicos

#### Ambiente de Destino - 🟢 GET

```http
{{url}}/destination-environment
```

**Respuesta:** Ambientes (Producción, Pruebas)

#### Tipos de Documentos - 🟢 GET

```http
{{url}}/document-type
```

**Respuesta:** IDs y códigos DIAN (01=Factura, 02=Exportación, 03=Contingencia, etc.)

#### Métodos de Pago - 🟢 GET

```http
{{url}}/payment-methods
```

**Respuesta:** Formas de pago válidas

#### Medios de Pago - 🟢 GET

```http
{{url}}/payment-means
```

**Respuesta:** Medios (Efectivo, Tarjeta, Transferencia, etc.)

#### Identidades de Documentos - 🟢 GET

```http
{{url}}/identity-documents
```

**Respuesta:** Tipos de identificación (CC, NIT, Pasaporte, etc.)

#### Régimen Fiscal - 🟢 GET

```http
{{url}}/fiscal-regime
```

**Respuesta:** Responsabilidades fiscales

#### Régimen Contable - 🟢 GET

```http
{{url}}/accounting-regime
```

**Respuesta:** Códigos contables

#### Otros Endpoints de Referencia - 🟢 GET

| Endpoint               | Uso                                       |
| ---------------------- | ----------------------------------------- |
| `/delivery-conditions` | INCOTERMS                                 |
| `/correction-notes`    | Motivos de corrección                     |
| `/discount-codes`      | Códigos de descuento                      |
| `/operation-type`      | Tipo de operación (Nacional, Exportación) |
| `/taxes`               | Tributos e impuestos                      |
| `/quantity-units`      | Unidades (Kg, Lt, Pz, etc.)               |
| `/reference-price`     | Unidad de referencia                      |
| `/cities`              | Ciudades                                  |
| `/departments`         | Departamentos                             |
| `/countries`           | Países                                    |
| `/currencies`          | Monedas                                   |

### Nómina electrónica.

- #### Tipo de ajuste a la nota de ajuste

```http
{{url}}/ep/adjustment-note-type
```

- #### Tipo de contrato

```http
{{url}}/ep/contract-type
```

- #### Tipo de discapacidad

```http
{{url}}/ep/disability-type
```

- #### Horas extras

```http
{{url}}/ep/extra-hours
```

- #### Periodicidad de la nómina

```http
{{url}}/ep/payroll-period
```

- #### Tipo de trabajo

```http
{{url}}/ep/worker-type
```

- #### Subtipo de trabajo

```http
{{url}}/ep/worker-subtype
```

## Autenticación

### Iniciar Sesión - 🟘 POST

```http
POST {{url}}/auth/login
Content-Type: application/json
```

**Body requerido:**

```json
{
  "email": "usuario@empresa.com",
  "password": "tu_contraseña",
  "remember_me": 0
}
```

**Respuesta:** Incluye `access_token`, `user`, `expires_at` (90 días máximo).

Ver [Introducción - Token](/docs/intro#obtener-el-token-de-acceso) para detalles.

---

## Endpoints Privados

> ✅ **Autenticación REQUERIDA**
>
> Incluir en todos: `Authorization: Bearer {token}`

### Cerrar Sesión - 🟢 GET

```http
GET {{url}}/auth/logout
Authorization: Bearer {token}
```

**Uso:** Revoca el token. Recomendado al final de sesión.

---

## Documentos Electrónicos

### Enviar Factura - 🟘 POST

```http
POST {{url}}/invoice
Authorization: Bearer {token}
Content-Type: application/json
```

**Tipos soportados:**

- Factura nacional (01)
- Factura exportación (02)
- Factura contingencia (03, 04)
- Documento soporte (05)
- POS Electrónico (20)

**Body:** JSON con estructura completa. Ver [billing-fields](/docs/billing-fields) para todos los campos.

**Respuesta:** `document_key` (CUFE), estado, XML.

### Enviar Nota Crédito - 🟘 POST

```http
POST {{url}}/notes/credit
Authorization: Bearer {token}
Content-Type: application/json
```

**Casos:**

- Devoluciones
- Descuentos
- Correcciones hacia abajo

**Campo:** `type_document_id: 5`

### Enviar Nota Débito - 🟘 POST

```http
POST {{url}}/notes/debit
Authorization: Bearer {token}
Content-Type: application/json
```

**Casos:**

- Intereses
- Cargos adicionales
- Correcciones hacia arriba

**Campo:** `type_document_id: 4`

## Nómina Electrónica

### Enviar Nómina - 🟘 POST

```http
POST {{url}}/ep/payroll
Authorization: Bearer {token}
Content-Type: application/json
```

### Enviar Nota de Ajuste - Reemplazo - 🟘 POST

```http
POST {{url}}/ep/payroll/replace
Authorization: Bearer {token}
```

**Uso:** Corregir nómina ya enviada (reemplaza anterior).

### Enviar Nota de Ajuste - Eliminación - 🟘 POST

```http
POST {{url}}/ep/payroll/delete
Authorization: Bearer {token}
```

**Uso:** Eliminar nómina de forma legal ante DIAN.

## Documentos Soporte (No Obligados a Facturar)

### Enviar Documento Soporte - 🟘 POST

```http
POST {{url}}/ds/document
Authorization: Bearer {token}
Content-Type: application/json
```

**Aplicable a:** Residentes y no residentes

### Enviar Nota de Ajuste (Documento Soporte) - 🟘 POST

```http
POST {{url}}/ds/adjustment-note
Authorization: Bearer {token}
```

---

## Documentos 📄

> 🟢 GET para búsquedas
> 🟘 POST para descargas

### Búsqueda de Documentos - 🟢 GET

- #### Buscar documentos. Tipo de petición: `GET`

```http
{{url}}/documents?order_number=251956&query=&limit=1&resolution=&number=&prefix=
```

Para realizar la búsqueda de documentos se pueden utilizar los siguientes parámetros, los cuales se pueden utilizar en cualquier combinación(**opcionales**):

- #### Parámetros de búsqueda

```json
{
  "order_number": "Número de orden",
  "number": "Número de documento",
  "query": "Texto de búsqueda",
  "limit": "Número de registros a traer",
  "resolution": "Resolución de facturación",
  "prefix": "Prefijo de la resolución",
  "start_date": "Fecha de inicio: Fecha en la que se desea comenzar a buscar",
  "end_date": "Fecha de fin: Fecha en la que se desea terminar de buscar",
  "document_key": "Código del documento(CUFE,CUDE)",
  "document_type": "Tipo de documento",
  "document_status": "Estado del documento: -1: Indiferente, 0: Documento sin validar, 1: Documento validado correctamente"
}
```

### Último documento generado

Este endpoint es utilizado para obtener el último documento generado por la API.

- #### Último documento. Tipo de petición: `GET`

```http
{{url}}/documents/last?resolution=18764074347312&prefix=LZT
```

Para obtener el último documento generado se deben enviar los siguientes parámetros:

- #### Parámetros de búsqueda

```json
{
  "resolution": "Resolución de facturación",
  "prefix": "Prefijo de la resolución"
}
```

### Consumo de documentos

Este endpoint es utilizado para consultar el consumo de documentos generados por la API.

- #### Consumo de documentos. Tipo de petición: `GET`

```http
{{url}}/documents/consume?p_year=2024&p_type=4&p_dni=901091403
```

Para obtener el consumo de documentos se deben enviar los siguientes parámetros:

- #### Parámetros de búsqueda

```json
{
  "p_year": "2024",
  "p_type": "1",
  "p_dni": "452121"
}
```

Descripción de los parámetros:

- **p_year**: Año de consumo.
- **p_dni**: DNI del cliente.
- **p_type**: Tipo de solicitud.
  - 1: Consumo agrupado por mes y año, por cuenta desarrollador.
  - 2: Consumo agrupado por año, por cuenta desarrollador.
  - 3: Consumo agrupado por mes y año de cada cliente, por cuenta desarrollador.
  - 4: CConsumo agrupado por año de cada cliente, por cuenta desarrollador.
  - 5: Consumo agrupado por mes y año de cada cliente.
  - 6: Consumo agrupado por mes y año de cada cliente por tipo de documento

### Descargar PDF del documento

Este endpoint es utilizado para descargar el PDF del documento generado por la API.

- #### Descargar PDF. Tipo de petición: `GET`

```http
{{url}}/documents/pdf/{trackId}
```

Donde `trackId` es el código único de factura electrónica o documento soporte(**CUFE, CUDE**).
Para descargar el PDF del documento se debe enviar el `trackId` del documento generado.

- #### Parámetros de búsqueda

```json
{
  "regenerate": "Cuando es 1 le indica al API que debe reescribir representación grafica. Por defecto es 0"
}
```

### Descargar XML del documento

Este endpoint es utilizado para descargar el XML del documento generado por la API.

- #### Descargar XML. Tipo de petición: `GET`

```http
{{url}}/documents/xml/{trackId}
```

Donde `trackId` es el código único de factura electrónica o documento soporte (**CUFE, CUDE**).
Para descargar el XML del documento se debe enviar el `trackId` del documento generado.

### Descargar ATTACHED del documento

Este endpoint es utilizado para descargar el attachment del documento generado por la API.

- #### Descargar ATTACHED. Tipo de petición: `POST`

```http
{{url}}/documents/attached/{trackId}
```

Donde `trackId` es el código único de factura electrónica o documento soporte (**CUFE, CUDE**).
Para descargar el PDF del documento se debe enviar el `trackId` del documento generado.

- #### Parámetros de búsqueda

```json
{
  "regenerate": "Cuando es 1 le indica al API que debe reescribir representación grafica. Por defecto es 0"
}
```

## Estado de documentos `NEW`

Este endpoint es utilizado para consultar el estado de los documentos generados por la API y la DIAN.

- ### ZIP - Estado del documento en la DIAN en modo de pruebas

  Este endpoint es utilizado para consultar el estado de los documentos en la DIAN en modo de pruebas.
  - #### Estado del documento. Tipo de petición: `GET`
    ```https
    {{url}}/status/zip/53405404-0696-4418-9b76-7e63d7943bd0
    ```

    - #### Parámetros de búsqueda
    ```json
    {
      "trackId": "Código único de factura electrónica o documento soporte (CUFE, CUDE)"
    }
    ```

- ### Estado del documento en la DIAN en producción
  Este endpoint es utilizado para consultar el estado de los documentos en la DIAN en producción.
  - #### Estado del documento. Tipo de petición: `GET`
    ```https
    {{url}}/status/document/6b0f76c1d3f9b783602c5e46a0dd2a0d833e01f4f969e5ed2dfbbd2692b2cdbbb0b6a9db2af4a98e0a6df70121ae0892
    ```

    - #### Parámetros de búsqueda
      ```json
      {
        "trackId": "Código único de factura electrónica o documento soporte (CUFE, CUDE)"
      }
      ```
- ### Estado del documento en la API
  Este endpoint es utilizado para consultar el estado de los documentos generados por la API.
  - #### Estado del documento. Tipo de petición: `GET`
    ```https
    {{url}}/status?order_number=251956&resolution=&number=LZT836&prefix=
    ```

    - #### Parámetros de búsqueda
    ```json
    {
      "order_number": "Número de orden",
      "number": "Número del documento",
      "resolution": "Resolución de facturación",
      "prefix": "Prefijo de la resolución"
    }
    ```

    - #### Respuesta
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
          "data": "",
          "path": "1/fv09010914030002500000033.png",
          "url": "http://apidian.test/qr/1/fv09010914030002500000033.png"
        }
      },
      "status": "Validado por la DIAN",
      "message": "Consulta exitosa",
      "success": true
    }
    ```

    - #### Descripción de la respuesta
    ```json
    {
      "document": {
        "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485", // UUID del documento
        "document_number": "LZT836", // Número de documento
        "order_number": null, // Número de orden
        "document_key": "", // Código único de factura electrónica o documento soporte (CUFE, CUDE)
        "document_name": "fv09010914030002500000033.xml", // Nombre del documento
        "is_valid": true, // Indica si el documento es válido o no
        "invoice_date": "2025-02-14T05:00:00.000000Z", // Fecha de la factura
        "qr": {
          // Información del QR
          "qrDian": "", // URL del QR en la DIAN
          "data": "", // Datos del QR
          "path": "1/fv09010914030002500000033.png", // Ruta del QR
          "url": "" // URL del QR
        }
      },
      "status": "Validado por la DIAN", // Estado del documento en la DIAN
      "message": "Consulta exitosa", // Mensaje de respuesta
      "success": true // Indica si la consulta fue exitosa o no
    }
    ```

## Envío de correos electrónicos personalizados

Este endpoint es utilizado para enviar correos electrónicos personalizados a los clientes.

- ### para enviar un correo electrónico se debe tener en cuenta lo siguiente:
  - Mime type **(mime)** del documento a enviar.
  ```
      https://help.accusoft.com/PrizmViewer/v10.1/Config/MIME_Types.html
  ```

  - Estilo del documento a enviar, usando el estandar 2.1 de CSS.
  ```
      https://www.w3.org/TR/2011/REC-CSS2-20110607
  ```
- #### Enviar correo electrónico. Tipo de petición: `POST`

```http
{{url}}/documents/sendmail/to
```

- #### Parámetros del body
  ```json
  {
    "email_to"  : "lws_1234@hotmail.com;lopezsoft.com@gmail.com",
    "subject"   : "Documento electrónico",
    "title"     : "Titulo del correo",
    "message"   : "Mensaje del correo electrónico",
    "documents": [
      "content" : "base64",
      "mime"    : "application/pdf",
      "name"    : "Factura.pdf"
    ]
  }
  ```
- #### Descripción de los parámetros

```json
{
  "email_to": "Dirección de correo electrónico del destinatario",
  "subject": "Asunto del correo electrónico",
  "title": "Título del correo electrónico",
  "message": "Mensaje del correo electrónico",
  "documents": [
    // Arreglo de documentos a enviar
    {
      "content": "Contenido del documento en base64",
      "mime": "Tipo de contenido del documento",
      "name": "Nombre del documento"
    }
  ]
}
```

## Reenvío de correos electrónicos

Este endpoint es utilizado para reenviar correos electrónicos a los clientes.

- #### Reenviar correo electrónico. Tipo de petición: `POST`

```http
{{url}}//documents/sendmail/{{trackId}}
```

Donde `trackId` es el código único de factura electrónica o documento soporte (**CUFE, CUDE**).

- #### Parámetros del body
  ```json
  {
    "email_to": "lopezsoft.com@gmail.com;lws_1234@hotmail.com"
  }
  ```
- #### Descripción de los parámetros
  ```json
  {
    "email_to": "Dirección de correo electrónico del destinatario"
  }
  ```

## Consulta de adquirente `NEW`

Este endpoint es utilizado para consultar el adquirente de la factura electrónica.
De acuerdo a la Resolución 000202 de 2025, el adquirente es la persona natural o jurídica que recibe el bien o servicio.

- ### Consulta de adquirente. Tipo de petición: `GET`
  ```http
  {{url}}/acquirer?identificationType=13&identificationNumber=1063279303
  ```
- #### Parámetros de búsqueda
  ```json
  {
    "identificationType": "Tipo de identificación del adquirente",
    "identificationNumber": "Número de identificación del adquirente"
  }
  ```
- #### Tipos de identificación

  | CÓDIGO | NOMBRE DEL TIPO DE IDENTIFICACIÓN      |
  | ------ | -------------------------------------- |
  | 13     | Cédula de Ciudadanía                   |
  | 22     | Cédula de Extranjeria                  |
  | 31     | NIT                                    |
  | 11     | Registro civil de nacimiento           |
  | 12     | Tarjeta de identidad                   |
  | 21     | Tarjeta de extranjería                 |
  | 41     | Pasaporte                              |
  | 42     | Documento de identificación extranjero |
  | 50     | NIT de otro país                       |
  | 91     | NUIP                                   |
  | 48     | PPT (Permiso Protección Temporal)      |
  | 47     | PEP (Permiso Especial de Permanencia)  |
  | SC     | Salvoconducto                          |
  | CN     | Certificado de nacido vivo             |
  | AS     | Adulto sin identificar                 |
  | MS     | Menor sin identificar                  |
  | SI     | Sin identificación                     |
  | CD     | Carné diplomático                      |

- #### Respuesta
  ```json
  {
    "message": "Consulta generada con éxito",
    "content": {
      "Message": {
        "_attributes": {
          "nil": "true"
        }
      },
      "ReceiverEmail": "lopezsoft.com@gmail.com",
      "ReceiverName": "LOPEZ GOMEZ LEWIS OSWALDO",
      "StatusCode": "200"
    },
    "success": true
  }
  ```

## Eventos - Acuses

**NOTA:** La DIAN solo permite generar eventos para las facturas electrónicas a crédito.

### Mostrar en lista los eventos generados

Este endpoint es utilizado para mostrar en lista los eventos generados por la API.

- #### Mostrar eventos. Tipo de petición: `GET`

```http
{{url}}/events/document-receptions?startDate=&endDate=&trackId=&query&limit=20
```

Para mostrar los eventos generados se pueden utilizar los siguientes parámetros (**opcionales**) de búsqueda:

- #### Parámetros de búsqueda

```json
{
  "startDate": "Fecha de inicio (En la que se generó el evento en el API)",
  "endDate": "Fecha de fin (En la que se generó el evento en el API)",
  "trackId": "trackId del documento",
  "query": "Texto de búsqueda (NIT, nombre del proveedor.)",
  "limit": "Número de registros a traer, por defecto es 20 y máximo 50 registros"
}
```

### Estado del documento en la DIAN

Este endpoint es utilizado para obtener el documento en la DIAN y sus eventos, si tiene eventos generados.

- #### Estado del documento. Tipo de petición: `GET`

```http
{{url}}/events/status/{{trackId}}
```

Donde `trackId` es el trackId del documento.

### Importar documentos de la DIAN a la API para generar los eventos(ACUSES)

Estos endpoints son utilizados para importar los documentos de la DIAN a la API para generar los eventos(ACUSES).

- #### Importar documento usando trackId. Tipo de petición: `POST`

```http
{{url}}/events/import-track-id
```

En el body de la petición se debe enviar la propiedad `{{trackId}}` que debe contener el valor del trackId del documento.

- #### Importar documento usando trackId. Tipo de petición: `POST`

```http
{{url}}/events/{{trackId}}/import
```

Donde `trackId` es el **CUDE** del documento.

- #### Importar usando archivo excel. Tipo de petición: `POST`
  Para importar un archivo, este debe ser en formato EXCEL y debe contener los campos necesarios para la importación. De lo contrario, la importación no se realizará correctamente.
  Estos campos son: **Tipo de documento, trackId, Folio, Prefijo, Fecha Emisión, Fecha Recepción, NIT Emisor, Nombre Emisor, NIT Receptor, Nombre Receptor, IVA, ICA, IPC, Total, Estado, Grupo**.
  El archivo debe contener una fila de encabezado con los nombres de los campos. Acorde a documento excel que se baja de la plataforma de la DIAN.

```http
{{url}}/events/import-excel
```

Este listado lo puede bajar desde el portal de facturación de la DIAN.
Nota: El archivo no debe contener más de 100 registros.

- #### Importar usando el tipo de evento. Tipo de petición: `POST`
  Este endpoint es utilizado para importar los documentos de la DIAN a la API para generar los eventos(ACUSES) por tipo de evento.

```http
{{url}}/events/send/{{trackId}}
```

Donde `trackId` es el trackId del documento.

- #### Parámetros del body

```json
{
  "code": "Código del evento(030, 031, 032, 033)",
  "notes": "Notas del evento"
}
```

- #### Ejemplo de body Acuse de recibo

```json
{
  "code": "030",
  "notes": "Acuso recibido de factura."
}
```

- #### Ejemplo de body Reclamo de la factura

```json
{
  "code": "031",
  "notes": "Reclamo de factura."
}
```

- #### Ejemplo de body Recibo de la factura

```json
{
  "code": "032",
  "notes": "Recibo del bien y/o prestación del servicio."
}
```

- #### Ejemplo de body Aceptación expresa

```json
{
  "code": "033",
  "notes": "Aceptación expresa."
}
```

---

## Personal Access Tokens

<div style={{backgroundColor: '#d1ecf1', padding: '1.5rem', borderRadius: '8px', border: '2px solid #17a2b8', margin: '1.5rem 0'}}>
  <strong>🆕 Nuevo en v3.0.0 • ✅ Autenticación requerida</strong><br/>
  Los Personal Access Tokens (PAT) te permiten gestionar tus propios tokens de acceso con expiración configurable (1-90 días). Self-service sin contactar soporte.
</div>

**¿Qué puedes hacer con PATs?**

- ✅ Crear y renovar tokens sin contactar soporte
- ✅ Configurar expiración personalizada (1-90 días)
- ✅ Revocar tokens comprometidos instantáneamente
- ✅ Gestionar múltiples tokens para diferentes entornos
- ✅ Ver estadísticas de uso y último acceso

### Listar tus Tokens - 🟢 GET

```http
{{url}}/ubl2.1/tokens
```

**Headers requeridos:**

```
Authorization: Bearer {tu_token_actual}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "token-123",
      "name": "Token Producción",
      "description": "Token para ERP",
      "created_at": "2026-02-01T10:00:00Z",
      "expires_at": "2026-05-02T10:00:00Z",
      "last_used_at": "2026-02-06T14:30:00Z"
    }
  ]
}
```

### Crear Nuevo Token - 🔵 POST

```http
{{url}}/ubl2.1/tokens
```

**Headers requeridos:**

```
Authorization: Bearer {tu_token_actual}
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Token Producción",
  "description": "Token para integración ERP",
  "expires_in_days": 60
}
```

**Parámetros:**

| Campo             | Tipo    | Requerido | Descripción                               |
| ----------------- | ------- | --------- | ----------------------------------------- |
| `name`            | string  | ✅        | Nombre identificador (máx 100 caracteres) |
| `description`     | string  | ❌        | Descripción del uso (máx 500 caracteres)  |
| `expires_in_days` | integer | ❌        | Días hasta expiración (1-90, default: 30) |

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Token creado exitosamente",
  "data": {
    "id": "token-456",
    "name": "Token Producción",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "expires_at": "2026-05-07T16:45:00Z"
  }
}
```

:::warning Importante
El campo `token` solo se muestra una vez durante la creación. **Guárdalo en un lugar seguro**. No podrás recuperarlo después.
:::

### Ver Detalles de un Token - 🟢 GET

```http
{{url}}/ubl2.1/tokens/{token_id}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "id": "token-123",
    "name": "Token Producción",
    "description": "Token para ERP",
    "created_at": "2026-02-01T10:00:00Z",
    "expires_at": "2026-05-02T10:00:00Z",
    "last_used_at": "2026-02-06T14:30:00Z",
    "metadata": {
      "ip_address": "190.25.30.45",
      "user_agent": "MyERP/1.0"
    }
  }
}
```

### Revocar un Token - 🔴 DELETE

```http
{{url}}/ubl2.1/tokens/{token_id}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Token revocado exitosamente"
}
```

:::tip Uso Recomendado
Revoca tokens inmediatamente si:

- Sospechas que fue comprometido
- Ya no lo usarás
- El desarrollador que lo usaba dejó el equipo
  :::

### Revocar Todos los Tokens - 🔵 POST

```http
{{url}}/ubl2.1/tokens/revoke-all
```

Revoca todos tus tokens **excepto el que estás usando actualmente**.

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Se revocaron 3 tokens exitosamente"
}
```

### Límites

- **Creación:** Máximo 10 tokens nuevos por día
- **Activos:** Sin límite de tokens activos simultáneos
- **Expiración:** Entre 1 y 90 días

---

## Webhooks

<div style={{backgroundColor: '#e7f3ff', padding: '1.5rem', borderRadius: '8px', border: '2px solid #0066cc', margin: '1.5rem 0'}}>
  <strong>🆕 Nuevo en v3.0.0 • ✅ Autenticación requerida</strong><br/>
  Recibe notificaciones HTTP en tiempo real cuando ocurren eventos importantes (documentos creados/emitidos, emails enviados, pagos procesados). 26 eventos disponibles.
</div>

**Características principales:**

- 🔔 **26 tipos de eventos:** Documentos, emails, pagos, membresías
- 🔐 **Firma HMAC-SHA256:** Verificación de autenticidad
- 🔄 **Reintentos automáticos:** Hasta 6 intentos con backoff exponencial
- 🎨 **Headers personalizados:** Agrega tus propios headers
- 🧪 **Testing integrado:** Prueba webhooks antes de producción
- 📊 **Historial completo:** Rastreo de entregas exitosas y fallidas

### Eventos Disponibles - 🟢 GET

```http
{{url}}/ubl2.1/webhooks/events
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "documents": [
      { "value": "document.created", "label": "Documento Creado" },
      { "value": "document.emitted", "label": "Documento Emitido" },
      { "value": "document.accepted", "label": "Documento Aceptado" },
      { "value": "document.rejected", "label": "Documento Rechazado" },
      { "value": "document.voided", "label": "Documento Anulado" }
    ],
    "emails": [
      { "value": "email.sent", "label": "Email Enviado" },
      { "value": "email.delivered", "label": "Email Entregado" },
      { "value": "email.bounced", "label": "Email Rebotado" },
      { "value": "email.opened", "label": "Email Abierto" },
      { "value": "email.clicked", "label": "Link Clickeado" }
    ],
    "payments": [
      { "value": "payment.approved", "label": "Pago Aprobado" },
      { "value": "payment.declined", "label": "Pago Rechazado" },
      { "value": "payment.error", "label": "Error en Pago" }
    ],
    "memberships": [
      { "value": "membership.activated", "label": "Membresía Activada" },
      { "value": "membership.expiring_soon", "label": "Próxima a Vencer" },
      { "value": "membership.expired", "label": "Membresía Vencida" }
    ]
  }
}
```

### Listar Webhooks - 🟢 GET

```http
{{url}}/ubl2.1/webhooks
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "url": "https://tu-servidor.com/webhook/matias",
      "events": ["document.created", "document.emitted"],
      "is_active": true,
      "created_at": "2026-02-01T10:00:00Z",
      "stats": {
        "total_deliveries": 150,
        "successful": 145,
        "failed": 5
      }
    }
  ]
}
```

### Crear Webhook - 🔵 POST

```http
{{url}}/ubl2.1/webhooks
```

**Body:**

```json
{
  "url": "https://tu-servidor.com/webhook/matias",
  "events": ["document.created", "document.emitted", "email.sent"],
  "headers": {
    "Authorization": "Bearer tu-token-secreto",
    "X-Custom-Header": "valor-personalizado"
  },
  "is_active": true
}
```

**Parámetros:**

| Campo       | Tipo    | Requerido | Descripción                                         |
| ----------- | ------- | --------- | --------------------------------------------------- |
| `url`       | string  | ✅        | URL HTTPS donde recibirás las notificaciones        |
| `events`    | array   | ✅        | Array de eventos a los que te suscribes (mínimo 1)  |
| `headers`   | object  | ❌        | Headers personalizados para incluir en cada request |
| `is_active` | boolean | ❌        | Si el webhook está activo (default: true)           |

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Webhook creado exitosamente",
  "data": {
    "id": 1,
    "url": "https://tu-servidor.com/webhook/matias",
    "secret": "whsec_kJ8x3nQ9mP2vR5tY7wA1bC4dE6fG8hI0jK",
    "events": ["document.created", "document.emitted"],
    "is_active": true
  }
}
```

:::warning Importante - Secret
El `secret` se muestra **solo una vez**. Guárdalo para verificar la firma HMAC de los webhooks que recibas.
:::

### Actualizar Webhook - 🟡 PUT

```http
{{url}}/ubl2.1/webhooks/{webhook_id}
```

**Body:**

```json
{
  "url": "https://nuevo-servidor.com/webhook",
  "events": ["document.created"],
  "is_active": true
}
```

### Eliminar Webhook - 🔴 DELETE

```http
{{url}}/ubl2.1/webhooks/{webhook_id}
```

### Probar Webhook - 🔵 POST

```http
{{url}}/ubl2.1/webhooks/{webhook_id}/test
```

Envía un webhook de prueba para verificar tu configuración.

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Webhook enviado exitosamente",
  "data": {
    "status_code": 200,
    "response_time_ms": 245,
    "delivered_at": "2026-02-06T16:45:00Z"
  }
}
```

### Formato del Payload Recibido

Cuando ocurre un evento, recibirás un POST en tu URL con este formato:

```json
{
  "id": "whe_1234567890",
  "event": "document.created",
  "created_at": "2026-02-06T16:45:00Z",
  "data": {
    "document_id": 12345,
    "track_id": "CUDE123456789",
    "document_type": "invoice",
    "customer_name": "Cliente SA",
    "total": 1000000,
    "status": "pending"
  }
}
```

**Headers importantes:**

```
X-Webhook-Signature: sha256=abc123...
X-Webhook-ID: whe_1234567890
X-Event-Type: document.created
Content-Type: application/json
```

### Verificar Firma HMAC

Para garantizar que el webhook viene de Matias API:

```javascript
// Node.js
const crypto = require("crypto");

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");

  return `sha256=${hash}` === signature;
}

// Uso
const signature = request.headers["x-webhook-signature"];
const isValid = verifyWebhook(request.body, signature, "whsec_tu_secret");

if (!isValid) {
  return response.status(401).json({ error: "Invalid signature" });
}
```

```php
// PHP
function verifyWebhook($payload, $signature, $secret) {
    $hash = hash_hmac('sha256', json_encode($payload), $secret);
    return "sha256={$hash}" === $signature;
}

// Uso
$signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'];
$payload = json_decode(file_get_contents('php://input'), true);

if (!verifyWebhook($payload, $signature, 'whsec_tu_secret')) {
    http_response_code(401);
    exit('Invalid signature');
}
```

### Reintentos Automáticos

Si tu servidor responde con error (status &gt; 299), reintentamos automáticamente con backoff exponencial:

| Intento | Espera     |
| ------- | ---------- |
| 1       | 1 minuto   |
| 2       | 5 minutos  |
| 3       | 15 minutos |
| 4       | 1 hora     |
| 5       | 6 horas    |
| 6       | 24 horas   |

Después de 6 intentos fallidos, el webhook se marca como fallido y debes reintentar manualmente.

### Mejores Prácticas

✅ **Responde rápido:** Tu endpoint debe responder 200 OK en &lt;5 segundos  
✅ **Procesa async:** Usa colas para procesar el webhook después de responder  
✅ **Verifica firma:** Siempre valida el HMAC antes de procesar  
✅ **Idempotencia:** Guarda el `id` del webhook para evitar procesamiento duplicado  
✅ **Monitorea:** Revisa el historial de entregas regularmente

---

## Membresías y Consumo

<div style={{backgroundColor: '#d4edda', padding: '1.5rem', borderRadius: '8px', border: '2px solid #28a745', margin: '1.5rem 0'}}>
  <strong>🆕 Nuevo en v3.0.0 • ✅ Autenticación requerida</strong><br/>
  Consulta los límites de tu plan actual, consumo diario/mensual, historial de uso y estadísticas detalladas.
</div>

**Información disponible:**

- 📊 **Consumo en tiempo real:** Documentos usados hoy y este mes
- 📈 **Límites activos:** Máximo diario y mensual según tu plan
- 📉 **Histórico de uso:** Últimos 7, 30 o 90 días con gráficos
- ⏰ **Renovación automática:** Fecha de reset diario y mensual
- ⚠️ **Alertas proactivas:** Avisos cuando te acerques al límite

### Consultar Consumo Actual - 🟢 GET

```http
{{url}}/ubl2.1/memberships/consumption
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "plan": {
      "name": "Plan Básico",
      "type": "basico"
    },
    "daily": {
      "consumed": 45,
      "limit": 100,
      "remaining": 55,
      "percentage": 45,
      "reset_at": "2026-02-07T00:00:00Z"
    },
    "monthly": {
      "consumed": 850,
      "limit": 1000,
      "remaining": 150,
      "percentage": 85,
      "renewal_date": "2026-03-01T00:00:00Z"
    }
  }
}
```

### Historial de Consumo - 🟢 GET

```http
{{url}}/ubl2.1/memberships/history?period=30days
```

**Parámetros query:**

| Parámetro | Tipo   | Descripción                                   |
| --------- | ------ | --------------------------------------------- |
| `period`  | string | `7days`, `30days`, `90days` (default: 30days) |

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "period": "30days",
    "timeline": [
      { "date": "2026-02-01", "count": 42 },
      { "date": "2026-02-02", "count": 38 },
      { "date": "2026-02-03", "count": 51 }
    ],
    "total": 1250,
    "average_per_day": 41.6
  }
}
```

### Asignar Cuota a Cliente - 🔵 POST

```http
{{url}}/ubl2.1/memberships/quotas
```

**Uso:** Permite a las casas de software asignar cuotas de documentos a sus clientes.

**Headers requeridos:**

```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Body:**

```json
{
  "client_company_id": "155",
  "assigned_documents": "100",
  "start_date": "2026-01-01",
  "end_date": "2026-12-31"
}
```

**Parámetros:**

| Campo                | Tipo   | Requerido | Descripción                                             |
| -------------------- | ------ | --------- | ------------------------------------------------------- |
| `client_company_id`  | string | ✅        | ID de la empresa cliente a la que se asignará la cuota  |
| `assigned_documents` | string | ✅        | Cantidad de documentos a asignar                        |
| `start_date`         | string | ✅        | Fecha de inicio de la cuota (formato: YYYY-MM-DD)       |
| `end_date`           | string | ✅        | Fecha de finalización de la cuota (formato: YYYY-MM-DD) |

**Respuesta exitosa (200):**

```json
{
  "message": "Cuota asignada correctamente.",
  "quota": {
    "id": 3,
    "uuid": "25d8b421-8687-4600-bd14-db00a867460b",
    "subscription_id": 1,
    "client_company_id": 155,
    "assigned_documents": 100,
    "consumed_documents": 0,
    "start_date": "2026-01-01T05:00:00.000000Z",
    "end_date": "2026-12-31T05:00:00.000000Z",
    "created_at": "2025-08-19T02:47:17.000000Z",
    "updated_at": "2026-02-14T15:47:59.000000Z"
  },
  "success": true
}
```

**Ejemplo cURL:**

```bash
curl --location 'http://apidian.test/api/ubl2.1/memberships/quotas' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {token}' \
--data '{
    "client_company_id": "155",
    "assigned_documents": "100",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31"
}'
```

### Consultar Resumen de Membresía - 🟢 GET

```http
{{url}}/ubl2.1/memberships/summary
```

**Uso:** Obtiene un resumen completo de la membresía incluyendo tipo de plan, límites, consumo y cuotas asignadas a clientes.

**Headers requeridos:**

```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

**Respuesta exitosa (200):**

```json
{
  "data": {
    "type": "developer",
    "plan_name": "PLAN EMPRENDEDOR",
    "is_unlimited": 0,
    "valid_until": "2027-01-30",
    "limit": 3000,
    "consumed": 1533,
    "assigned_quotas": {
      "current_page": 1,
      "data": [
        {
          "id": 3,
          "uuid": "25d8b421-8687-4600-bd14-db00a867460b",
          "subscription_id": 1,
          "client_company_id": 155,
          "assigned_documents": 100,
          "consumed_documents": 0,
          "start_date": "2026-01-01T05:00:00.000000Z",
          "end_date": "2026-12-31T05:00:00.000000Z",
          "created_at": "2025-08-19T02:47:17.000000Z",
          "updated_at": "2026-02-14T15:47:59.000000Z",
          "client": {
            "id": 155,
            "company_name": "SALAS MACHADO CARLOS ALBERTO",
            "full_path_image": ""
          }
        }
      ],
      "first_page_url": "http://apidian.test/api/ubl2.1/memberships/summary?page=1",
      "from": 1,
      "last_page": 1,
      "last_page_url": "http://apidian.test/api/ubl2.1/memberships/summary?page=1",
      "links": [
        {
          "url": null,
          "label": "&laquo; Anterior",
          "active": false
        },
        {
          "url": "http://apidian.test/api/ubl2.1/memberships/summary?page=1",
          "label": "1",
          "active": true
        },
        {
          "url": null,
          "label": "Siguiente &raquo;",
          "active": false
        }
      ],
      "next_page_url": null,
      "path": "http://apidian.test/api/ubl2.1/memberships/summary",
      "per_page": 15,
      "prev_page_url": null,
      "to": 1,
      "total": 1
    }
  }
}
```

**Descripción de la respuesta:**

| Campo                  | Descripción                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `type`                 | Tipo de cuenta (developer, client)                           |
| `plan_name`            | Nombre del plan contratado                                   |
| `is_unlimited`         | Indica si el plan tiene documentos ilimitados (0: No, 1: Sí) |
| `valid_until`          | Fecha de vencimiento de la membresía                         |
| `limit`                | Límite total de documentos del plan                          |
| `consumed`             | Documentos consumidos hasta el momento                       |
| `assigned_quotas`      | Listado paginado de cuotas asignadas a clientes              |
| `assigned_quotas.data` | Array de cuotas con información detallada de cada asignación |
| `client`               | Información del cliente al que se asignó la cuota            |

**Ejemplo cURL:**

```bash
curl --location 'http://apidian.test/api/ubl2.1/memberships/summary' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {token}'
```

### Códigos de Error Relacionados

Cuando alcanzas un límite, recibirás estos códigos HTTP:

#### 402 Payment Required - Límite Alcanzado

```json
{
  "success": false,
  "message": "Límite de documentos de la membresía alcanzado.",
  "details": {
    "consumed": 1000,
    "limit": 1000,
    "remaining": 0,
    "renewal_date": "2026-03-01"
  },
  "upgrade_url": "https://app.matias-api.com/upgrade"
}
```

#### 403 Forbidden - Funcionalidad No Disponible

```json
{
  "success": false,
  "message": "Esta funcionalidad no está disponible en el plan FREE.",
  "feature": "xml_download",
  "upgrade_url": "https://app.matias-api.com/upgrade"
}
```

### Headers de Respuesta

En cada respuesta de endpoints de documentos, recibirás headers informativos:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 150
X-RateLimit-Reset: 1709251200
X-Plan-Type: basico
```

---

## 📋 Notas de Versión 3.0.0

<div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '2px solid #6c757d', margin: '1.5rem 0'}}>
  <strong>🚀 Nuevas Funcionalidades v3.0.0</strong><br/>
  Febrero 2026 - Actualización mayor con Personal Access Tokens, Webhooks y sistema de Membresías.
</div>

### ⚡ Cambios Importantes

#### Nuevos Códigos de Estado HTTP

- **402 Payment Required:** Límite de plan alcanzado
- **403 Forbidden:** Funcionalidad no disponible en tu plan

#### Nuevos Headers

Todos los endpoints privados ahora retornan información de límites en headers.

#### Retrocompatibilidad

✅ Todos los endpoints existentes siguen funcionando  
✅ Tokens anteriores (de 90 días) siguen válidos  
✅ No hay breaking changes en la API

#### Migración Recomendada

1. **Crea Personal Access Tokens:** Para mayor seguridad y control
2. **Configura Webhooks:** Para notificaciones en tiempo real
3. **Monitorea Consumo:** Revisa límites regularmente

### 💬 Soporte

<div style={{backgroundColor: '#e7f3ff', padding: '1rem', borderRadius: '8px', border: '1px solid #0066cc', margin: '1rem 0'}}>
  ¿Preguntas sobre la nueva versión? Contacta a soporte técnico o consulta la documentación completa.
</div>

---

## 🎯 Próximos Pasos

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '2rem 0'}}>
  <a href="/docs/use-cases/simple-invoice" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '2px solid #0066cc', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📄</div>
      <strong>Factura Simple</strong><br/>
      <small>Ejemplo práctico de uso</small>
    </div>
  </a>
  <a href="/docs/billing-fields" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '2px solid #28a745', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📋</div>
      <strong>Campos de Documentos</strong><br/>
      <small>Referencia completa</small>
    </div>
  </a>
  <a href="/docs/use-cases/common-errors" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⚠️</div>
      <strong>Errores Comunes</strong><br/>
      <small>Troubleshooting</small>
    </div>
  </a>
  <a href="/docs/glossary" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#d1ecf1', borderRadius: '8px', border: '2px solid #17a2b8', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📚</div>
      <strong>Glosario</strong><br/>
      <small>Términos técnicos</small>
    </div>
  </a>
</div>

---

<div style={{backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginTop: '2rem'}}>
  <small>
    📅 <strong>Última actualización:</strong> Febrero 2026 (v3.0.0) • 
    🔌 <strong>Endpoints:</strong> 50+ rutas documentadas • 
    🎯 <strong>Nivel:</strong> ⭐⭐⭐ Referencia Técnica
  </small>
</div>
